import type { PrismaClient } from '@prisma/client';

export async function seedOrganizations(prisma: PrismaClient) {
  const organizations = [
    {
      id: 'org_1',
      name: 'TechCorp Solutions',
      slug: 'techcorp-solutions',
      description: 'Leading technology solutions provider',
      logo: 'https://example.com/logos/techcorp.png',
      website: 'https://techcorp.example.com',
      isActive: true,
      settings: {
        theme: 'light',
        features: {
          codeReview: true,
          continuousIntegration: true,
          automatedTesting: true,
          deploymentAutomation: true,
        },
        security: {
          twoFactorAuth: true,
          ipWhitelist: ['192.168.1.0/24'],
          sessionTimeout: 3600,
        },
        notifications: {
          email: true,
          slack: true,
          webhook: true,
        },
      },
      metadata: {
        industry: 'Technology',
        size: 'Enterprise',
        founded: '2010',
        headquarters: 'San Francisco, CA',
        contact: {
          email: 'contact@techcorp.example.com',
          phone: '+1-555-0123',
        },
      },
    },
    {
      id: 'org_2',
      name: 'InnovateSoft',
      slug: 'innovatesoft',
      description: 'Innovative software development company',
      logo: 'https://example.com/logos/innovatesoft.png',
      website: 'https://innovatesoft.example.com',
      isActive: true,
      settings: {
        theme: 'light',
        features: {
          codeReview: true,
          continuousIntegration: true,
          automatedTesting: true,
          deploymentAutomation: true,
        },
        security: {
          twoFactorAuth: true,
          ipWhitelist: ['192.168.1.0/24'],
          sessionTimeout: 3600,
        },
        notifications: {
          email: true,
          slack: true,
          webhook: true,
        },
      },
      metadata: {
        industry: 'Software Development',
        size: 'Mid-size',
        founded: '2015',
        headquarters: 'New York, NY',
        contact: {
          email: 'info@innovatesoft.example.com',
          phone: '+1-555-0124',
        },
      },
    },
  ];

  // Create organizations in parallel
  await Promise.all(
    organizations.map(async (org) => {
      await prisma.organization.create({
        data: {
          ...org,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );
}
