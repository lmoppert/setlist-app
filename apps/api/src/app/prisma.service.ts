import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from "./database/client";
import { env } from "prisma/config";

// console.log('DEBUG: ', process.cwd())
// console.log('URL: ', env("DATABASE_URL"))
const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") ?? 'file:./prisma/dev.db' });

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