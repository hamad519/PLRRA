// One-off script to create an admin user.
// Run with: node scripts/create-admin.js
// Delete after use.

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const username = 'Hammad';
  const email = 'madikhokhar10@gmail.com';
  const plainPassword = '@Hammad@1122';
  const role = 'admin';

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    console.log('⚠️  User already exists:', existing);
    return;
  }

  const password = await bcrypt.hash(plainPassword, 10);
  const user = await prisma.user.create({
    data: { username, email, password, role },
  });

  console.log('✅ User created:');
  console.log('   id:      ', user.id);
  console.log('   username:', user.username);
  console.log('   email:   ', user.email);
  console.log('   role:    ', user.role);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
