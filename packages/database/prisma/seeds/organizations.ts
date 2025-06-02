import { PrismaClient, Role } from "@prisma/client";

export async function seedOrganizations(prisma: PrismaClient) {
  const organizations = [
    {
      id: "org_1",
      name: "TechCorp Solutions",
      slug: "techcorp-solutions",
      description: "Leading technology solutions provider",
      logo: "https://example.com/logos/techcorp.png",
      website: "https://techcorp.example.com",
      status: "ACTIVE",
      metadata: {
        industry: "Technology",
        size: "Enterprise",
        founded: "2010",
        headquarters: "San Francisco, CA",
        contact: {
          email: "contact@techcorp.example.com",
          phone: "+1-555-0123",
        },
      },
    },
    {
      id: "org_2",
      name: "InnovateSoft",
      slug: "innovatesoft",
      description: "Innovative software development company",
      logo: "https://example.com/logos/innovatesoft.png",
      website: "https://innovatesoft.example.com",
      status: "ACTIVE",
      metadata: {
        industry: "Software Development",
        size: "Mid-size",
        founded: "2015",
        headquarters: "New York, NY",
        contact: {
          email: "info@innovatesoft.example.com",
          phone: "+1-555-0124",
        },
      },
    },
  ];

  for (const org of organizations) {
    await prisma.organization.create({
      data: {
        ...org,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create organization settings
    await prisma.organizationSetting.create({
      data: {
        organizationId: org.id,
        theme: "light",
        features: {
          codeReview: true,
          continuousIntegration: true,
          automatedTesting: true,
          deploymentAutomation: true,
        },
        security: {
          twoFactorAuth: true,
          ipWhitelist: ["192.168.1.0/24"],
          sessionTimeout: 3600,
        },
        notifications: {
          email: true,
          slack: true,
          webhook: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create organization memberships
    const memberships = [
      {
        userId: "user_1",
        role: Role.ADMIN,
        isActive: true,
      },
      {
        userId: "user_2",
        role: Role.MANAGER,
        isActive: true,
      },
      {
        userId: "user_3",
        role: Role.DEVELOPER,
        isActive: true,
      },
    ];

    for (const membership of memberships) {
      await prisma.membership.create({
        data: {
          ...membership,
          organizationId: org.id,
        },
      });
    }
  }
}
