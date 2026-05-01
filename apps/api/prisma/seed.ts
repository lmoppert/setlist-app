import { createPrismaClient } from "../src/app/lib/prisma";
import { slugify } from "@setlist-app/shared-utils";

import members from "./data/members.json";
import songs from "./data/songs.json";
import setlists from "./data/setlists.json";
import instruments from "./data/instruments.json";

const prisma = createPrismaClient();

async function main() {
  console.log('Bereinige Datenbank...')
  await prisma.instrument.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.setlistEntry.deleteMany({});
  await prisma.setlist.deleteMany({});
  await prisma.song.deleteMany({});

  console.log('Datenbank ist Leer, starte Import...')

  // Band members
  await prisma.member.createMany({
    data: members.map(member => ({
      name: member.name,
      isLeadVocalist: member.isLeadVocalist,
    })),
    skipDuplicates: true,
  });

  // Songs
  await prisma.song.createMany({
    data: songs.map(song => ({
      slug: slugify(song.title),
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      tempo: song.tempo,
      key: song.key,
      leadVocals: song.leadVocals,
    })),
    skipDuplicates: true,
  });
  
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

  console.log('Datenbank ist wieder gefüllt!')
}

main().catch(console.error).finally(() => prisma.$disconnect());