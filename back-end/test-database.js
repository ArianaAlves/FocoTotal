#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'development');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    // Try to list users (if table exists)
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Users table accessible, count: ${userCount}`);
    } catch (error) {
      console.log('⚠️  Users table not accessible:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

testDatabase().catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});