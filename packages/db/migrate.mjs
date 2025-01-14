import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();
const CLERK_API_URL = 'https://api.clerk.com/v1/users';
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY is not set');
  process.exit(1);
}

async function createClerkUser(user) {
    const passwordDigest = await bcrypt.hash(user.password, 10);

  const response = await fetch(CLERK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_id: user.id,
      first_name: user.name.split(' ')[0],
      last_name: user.name.split(' ').slice(1).join(' '),
      email_address: [user.email],
      // username: user.username,
      created_at: user.createdAt.toISOString(),
      password_digest: passwordDigest,
      password_hasher: 'bcrypt',
      public_metadata: {
        defaultWorkspaceId: user.defaultWorkspaceId,
        onBoarding: user.onBoarding,
        avatarUrl: user.avatarUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Clerk user: ${await response.text()}`);
  }

  const clerkUser = await response.json();
  return clerkUser.id;
}

async function migrateUsers() {
  const users = await prisma.user.findMany({
    where: { externalId: null },
  });
  console.log(`Found ${users.length} users to migrate`);

  for (const user of users) {
    try {
      console.log(`Migrating user: ${user.email}`);
      const clerkExternalId = await createClerkUser(user);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { externalId: clerkExternalId },
      });
      
      console.log(`Successfully migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Error migrating user ${user.email}:`, error.message);
    }
  }
}

migrateUsers()
  .catch((error) => {
    console.error('Migration failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('Starting user migration to Clerk...');