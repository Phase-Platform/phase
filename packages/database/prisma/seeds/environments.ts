import { PrismaClient } from "@prisma/client";

export async function seedEnvironments(prisma: PrismaClient) {
  const environments = [
    {
      id: "env_1",
      name: "Production",
      description: "Production environment for live applications",
      type: "PRODUCTION",
      projectId: "proj_1",
      status: "ACTIVE",
      url: "https://app.example.com",
      metadata: {
        region: "us-east-1",
        cloudProvider: "AWS",
        infrastructure: {
          type: "kubernetes",
          version: "1.24",
          nodes: 3,
        },
        monitoring: {
          tools: ["Prometheus", "Grafana", "ELK Stack"],
          alerts: true,
        },
      },
    },
    {
      id: "env_2",
      name: "Staging",
      description: "Staging environment for pre-production testing",
      type: "STAGING",
      projectId: "proj_1",
      status: "ACTIVE",
      url: "https://staging.example.com",
      metadata: {
        region: "us-east-1",
        cloudProvider: "AWS",
        infrastructure: {
          type: "kubernetes",
          version: "1.24",
          nodes: 2,
        },
        monitoring: {
          tools: ["Prometheus", "Grafana"],
          alerts: true,
        },
      },
    },
    {
      id: "env_3",
      name: "Development",
      description: "Development environment for feature development",
      type: "DEVELOPMENT",
      projectId: "proj_1",
      status: "ACTIVE",
      url: "https://dev.example.com",
      metadata: {
        region: "us-east-1",
        cloudProvider: "AWS",
        infrastructure: {
          type: "kubernetes",
          version: "1.24",
          nodes: 1,
        },
        monitoring: {
          tools: ["Prometheus"],
          alerts: false,
        },
      },
    },
  ];

  for (const env of environments) {
    await prisma.environment.create({
      data: {
        ...env,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create environment variables for each environment
    const variables = [
      {
        key: "DATABASE_URL",
        value: `postgresql://user:pass@${env.name.toLowerCase()}-db.example.com:5432/db`,
        environmentId: env.id,
        isSecret: true,
      },
      {
        key: "API_KEY",
        value: `${env.name.toLowerCase()}_api_key_123`,
        environmentId: env.id,
        isSecret: true,
      },
      {
        key: "LOG_LEVEL",
        value: env.type === "PRODUCTION" ? "ERROR" : "DEBUG",
        environmentId: env.id,
        isSecret: false,
      },
      {
        key: "ENVIRONMENT",
        value: env.name.toUpperCase(),
        environmentId: env.id,
        isSecret: false,
      },
    ];

    for (const variable of variables) {
      await prisma.environmentVariable.create({
        data: {
          ...variable,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}
