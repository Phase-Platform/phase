import { type PrismaClient, ProjectStatus } from '@prisma/client';

export async function seedProjects(prisma: PrismaClient) {
  const projects = [
    {
      id: 'proj_1',
      name: 'E-commerce Platform',
      description: 'Modern e-commerce platform with advanced features',
      status: ProjectStatus.ACTIVE,
      ownerId: 'user_1',
      slug: 'e-commerce-platform',
      organizationId: 'org_1',
      metadata: {
        type: 'WEB_APPLICATION',
        industry: 'Retail',
        technologies: ['React', 'Node.js', 'PostgreSQL'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        budget: {
          currency: 'USD',
          amount: 500000,
        },
        stakeholders: [
          {
            name: 'Product Owner',
            email: 'product.owner@example.com',
            role: 'Product Management',
          },
          {
            name: 'Business Analyst',
            email: 'business.analyst@example.com',
            role: 'Business Analysis',
          },
        ],
      },
      settings: {
        visibility: 'PRIVATE',
        allowGuestAccess: false,
        defaultBranch: 'main',
        requireCodeReview: true,
        requireTests: true,
        repository: {
          name: 'e-commerce-platform-repo',
          type: 'GITHUB',
          url: 'https://github.com/org/e-commerce-platform',
          branch: 'main',
          status: 'ACTIVE',
        },
        milestones: [
          {
            title: 'Project Kickoff',
            description: 'Initial project setup and team alignment',
            dueDate: new Date('2024-01-01'),
            status: 'PENDING',
          },
        ],
      },
    },
    {
      id: 'proj_2',
      name: 'Mobile Banking App',
      description: 'Secure and user-friendly mobile banking application',
      status: ProjectStatus.PLANNING,
      ownerId: 'user_2',
      slug: 'mobile-banking-app',
      organizationId: 'org_1',
      metadata: {
        type: 'MOBILE_APPLICATION',
        industry: 'Finance',
        technologies: ['React Native', 'Node.js', 'MongoDB'],
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-03-31'),
        budget: {
          currency: 'USD',
          amount: 750000,
        },
        stakeholders: [
          {
            name: 'Bank Manager',
            email: 'bank.manager@example.com',
            role: 'Banking',
          },
          {
            name: 'Security Officer',
            email: 'security.officer@example.com',
            role: 'Security',
          },
        ],
      },
      settings: {
        visibility: 'PRIVATE',
        allowGuestAccess: false,
        defaultBranch: 'main',
        requireCodeReview: true,
        requireTests: true,
        repository: {
          name: 'mobile-banking-app-repo',
          type: 'GITHUB',
          url: 'https://github.com/org/mobile-banking-app',
          branch: 'main',
          status: 'ACTIVE',
        },
        milestones: [
          {
            title: 'Project Kickoff',
            description: 'Initial project setup and team alignment',
            dueDate: new Date('2024-04-01'),
            status: 'PENDING',
          },
        ],
      },
    },
  ];

  // Create all projects in parallel
  await Promise.all(
    projects.map((project) =>
      prisma.project.create({
        data: {
          ...project,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );
}
