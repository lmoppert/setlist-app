import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./database/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Former SQLite configuration
// import { env } from "prisma/config";
// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
// console.log('DEBUG: ', process.cwd())
// console.log('URL: ', env("DATABASE_URL"))
// const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") ?? 'file:./prisma/dev.db' });

@Injectable()
 export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  prisma = new PrismaClient({ adapter });

  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}