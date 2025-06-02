import { PrismaClient, UserRole, ProjectRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.comment.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@phase.com',
      name: 'Super Admin',
      role: UserRole.ADMIN,
      isActive: true,
      title: 'Platform Administrator',
      department: 'IT',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Developer',
      role: UserRole.DEVELOPER,
      isActive: true,
      title: 'Senior Developer',
      department: 'Engineering',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      name: 'Sarah Designer',
      role: UserRole.DEVELOPER,
      isActive: true,
      title: 'UI/UX Designer',
      department: 'Design',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    },
  });

  const mike = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      name: 'Mike Tester',
      role: UserRole.TESTER,
      isActive: true,
      title: 'QA Engineer',
      department: 'Quality Assurance',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    },
  });

  // Create organization
  console.log('🏢 Creating organization...');
  const organization = await prisma.organization.create({
    data: {
      name: 'Phase Platform',
      slug: 'phase-platform',
      description: 'A comprehensive SDLC management system',
      website: 'https://phaseplatform.com',
      settings: {
        theme: 'default',
        features: {
          analytics: true,
          notifications: true,
        },
      },
    },
  });

  // Create project
  console.log('📋 Creating project...');
  const project = await prisma.project.create({
    data: {
      name: 'Phase Platform Development',
      slug: 'phase-platform-dev',
      description: 'Main development project for Phase Platform',
      organizationId: organization.id,
      status: 'ACTIVE',
      ownerId: superAdmin.id,
      settings: {
        sprintDuration: 2,
        storyPointScale: 'fibonacci',
      },
    },
  });

  // Add project members
  console.log('👥 Adding project members...');
  await prisma.projectMember.createMany({
    data: [
      {
        projectId: project.id,
        userId: superAdmin.id,
        role: ProjectRole.OWNER,
        permissions: {
          canManageProject: true,
          canManageMembers: true,
        },
      },
      {
        projectId: project.id,
        userId: john.id,
        role: ProjectRole.DEVELOPER,
        permissions: {
          canManageProject: false,
          canManageMembers: false,
        },
      },
      {
        projectId: project.id,
        userId: sarah.id,
        role: ProjectRole.DEVELOPER,
        permissions: {
          canManageProject: false,
          canManageMembers: false,
        },
      },
      {
        projectId: project.id,
        userId: mike.id,
        role: ProjectRole.TESTER,
        permissions: {
          canManageProject: false,
          canManageMembers: false,
        },
      },
    ],
  });

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
