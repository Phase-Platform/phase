import { type PrismaClient, UserRole } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  const users = [
    {
      id: 'user_1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: UserRole.ADMIN,
      isActive: true,
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          inApp: true,
        },
        language: 'en',
        timezone: 'UTC',
      },
      metadata: {
        department: 'Engineering',
        position: 'Tech Lead',
        skills: ['JavaScript', 'TypeScript', 'Node.js', 'React'],
        joinDate: new Date('2023-01-01'),
      },
    },
    {
      id: 'user_2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: UserRole.DEVELOPER,
      isActive: true,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          inApp: true,
        },
        language: 'en',
        timezone: 'UTC',
      },
      metadata: {
        department: 'Engineering',
        position: 'Senior Developer',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        joinDate: new Date('2023-02-15'),
      },
    },
    {
      id: 'user_3',
      email: 'mike.wilson@example.com',
      name: 'Mike Wilson',
      role: UserRole.TESTER,
      isActive: true,
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          inApp: true,
        },
        language: 'en',
        timezone: 'UTC',
      },
      metadata: {
        department: 'Quality Assurance',
        position: 'QA Engineer',
        skills: ['Selenium', 'Jest', 'Cypress', 'Postman'],
        joinDate: new Date('2023-03-01'),
      },
    },
    {
      id: 'user_4',
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      role: UserRole.MANAGER,
      isActive: true,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          inApp: true,
        },
        language: 'en',
        timezone: 'UTC',
      },
      metadata: {
        department: 'Project Management',
        position: 'Project Manager',
        skills: ['Agile', 'Scrum', 'Jira', 'Confluence'],
        joinDate: new Date('2023-04-01'),
      },
    },
    {
      id: 'user_5',
      email: 'alex.brown@example.com',
      name: 'Alex Brown',
      role: UserRole.DEVELOPER,
      isActive: false,
      preferences: {
        theme: 'dark',
        notifications: {
          email: false,
          push: false,
          inApp: false,
        },
        language: 'en',
        timezone: 'UTC',
      },
      metadata: {
        department: 'Engineering',
        position: 'Junior Developer',
        skills: ['JavaScript', 'React', 'HTML', 'CSS'],
        joinDate: new Date('2023-05-01'),
        lastActive: new Date('2023-12-31'),
      },
    },
  ];

  await Promise.all(
    users.map(async (user) => {
      await prisma.user.create({
        data: {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create user session for active users
      if (user.isActive) {
        await prisma.session.create({
          data: {
            sessionToken: `session_${user.id}_${Date.now()}`,
            userId: user.id,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
        });
      }
    })
  );
}
