import "dotenv/config";
import * as argon2 from 'argon2';
import { createPrismaClient } from "../src/app/lib/prisma";
import { slugify } from "@setlist-app/shared-utils";

import members from "./data/members.json";
import songs from "./data/songs.json";
import setlists from "./data/setlists.json";

const prisma = createPrismaClient();

async function resetData() {
  console.log('Bereinige Datenbank...');
  await prisma.instrument.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.setlistEntry.deleteMany({});
  await prisma.setlist.deleteMany({});
  await prisma.song.deleteMany({});
  console.log('Daten wurden entfernt!');
}

async function seedData() {
  console.log('Starte den Import...')

  // Band members
  await prisma.member.createMany({
    data: members.map(member => ({
      name: member.name,
      isLeadVocalist: member.isLeadVocalist,
    })),
    skipDuplicates: true,
  });

  // Songs
  for (const song of songs) {
    await prisma.song.create({
      data: {
        slug: slugify(song.title),
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        tempo: song.tempo,
        key: song.key,
        leadVocals: song.leadVocals,
        instruments: {
          create: song.instruments.map(inst => ({
            name: inst.gear,
            tuning: inst.tuning,
            member: { connect: { name: inst.name } },
          }))
        }
      },
    });
  };
  
  // Setlists
  for (const setlist of setlists) {
    await prisma.setlist.create({
      data: {
        date: new Date(setlist.date),
        location: setlist.location!,
        slug: setlist.slug,
        name: setlist.name,
        duration: setlist.duration,
        entries: {
          create: setlist.entries.map((entry, index) => ({
            position: index + 1,
            isAccustic: false,
            isEncore: setlist.encStart ? index >= setlist.encStart : false,
            song: { connect: { slug: slugify(songs[entry].title), } }
          }))
        }
      }
    });
  };
  console.log('Datenbank ist wieder gefüllt!');
}

async function createInitialUser() {
  const password = process.env.BAND_PW
  if (!password) {
    console.log('Es wurde kein Band-Passwort konfiguriert, ich breche ab!')
    return;
  }
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.upsert({
    where: {
      username: 'band',
    },
    update: {},
    create: {
      username: 'band',
      passwordHash,
      displayName: 'Pontchartrain',
      role: 'MEMBER',
    }
  })
  console.log('Ersten Benutzer angelegt.');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--user-only')) {
    await createInitialUser();
    return;
  }
  await resetData();
  await createInitialUser();
  await seedData();
  console.log('Seed wurde vollständig abgeschlossen!');
}


main().catch(console.error).finally(() => prisma.$disconnect());