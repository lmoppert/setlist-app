import { env } from "@prisma/config";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/app/database/client';
import { slugify } from "./utils";

const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bereinige Datenbank...')
  await prisma.assignment.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.song.deleteMany({});

  console.log('Datenbank ist Leer, starte Import...')
  // Lead Vocalists
  const lead1 = await prisma.member.create({
    data: { name: 'Volker', mainInstrument: 'E-Gitarre' }
  });
  const lead2 = await prisma.member.create({
    data: { name: 'Bernd', mainInstrument: 'Akkustik-Gitarre' }
  });

  // Songs
  let songName = 'Straw In The Wind';
  await prisma.song.create({
    data: {
      name: songName,
      slug: slugify(songName),
      artist: 'The Steel Woods',
      duration: 270,
      tempo: 57,
      key: 'Dm',
      assignments: {
        create: {
          memberId: lead1.id,
          instrument: 'E-Gitarre',
          isLead: true
        }
      }
    }
  });
  songName = 'Whitehouse Road';
  await prisma.song.create({
    data: {
      name: songName,
      slug: slugify(songName),
      artist: 'Tyler Childers',
      duration: 310,
      tempo: 158,
      key: 'D',
      assignments: {
        create: {
          memberId: lead2.id,
          instrument: 'Akkustik-Gitarre',
          isLead: true
        }
      }
    }
  });
  songName = 'Hideaway';
  await prisma.song.create({
    data: {
      name: songName,
      slug: slugify(songName),
      artist: 'The Beat Farmers',
      duration: 280,
      tempo: 138,
      key: 'Am',
      assignments: {
        create: {
          memberId: lead1.id,
          instrument: 'E-Gitarre',
          isLead: true
        }
      }
    }
  });
  songName = 'Huricane';
  await prisma.song.create({
    data: {
      name: songName,
      slug: slugify(songName),
      artist: 'The Band Of Heathens',
      duration: 310,
      tempo: 130,
      key: 'Am',
      assignments: {
        create: {
          memberId: lead2.id,
          instrument: 'E-Gitarre',
          isLead: true
        }
      }
    }
  });
  await prisma.setlist.create({
    data: {
      date: new Date('2025-05-17'),
      location: 'Kahlscheurer Weiher',
      slug: '2025-05-17-kahlscheurer-weiher',
      name: 'ALL am Kal',
      duration: 60,
      entries: {
        create: [
          {
            position: 1,
            isObtional: false,
            isEncore: false,
            song: {
              connect: { slug: 'straw-in-the-wind' },
            }
          },
          {
            position: 2,
            isObtional: false,
            isEncore: false,
            song: {
              connect: { slug: 'whitehouse-road' }
            }
          },
          {
            position: 3,
            isObtional: false,
            isEncore: false,
            song: {
              connect: { slug: 'hideaway' }
            }
          },
          {
            position: 4,
            isObtional: false,
            isEncore: false,
            song: {
              connect: { slug: 'hurricane' }
            }
          }
        ]
      }
    }
  })

  console.log('Datenbank ist wieder gefüllt!')
}

main().catch(console.error).finally(() => prisma.$disconnect());