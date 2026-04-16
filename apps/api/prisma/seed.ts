import { env } from "@prisma/config";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/app/database/client';

const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

async function main() {
  const member = await prisma.member.create({
    data: { name: 'Volker', mainInstrument: 'E-Gitarre' }
  });

  await prisma.song.create({
    data: {
      name: 'Hideaway',
      artist: 'The Beat Farmers',
      duration: 280,
      tempo: 138,
      key: 'Am',
      assignments: {
        create: {
          memberId: member.id,
          instrument: 'E-Gitarre',
          isLead: true
        }
      }
    }
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());