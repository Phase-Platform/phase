import { EnvironmentType, type PrismaClient } from '@prisma/client';

export async function seedEnvironments(prisma: PrismaClient) {
  const environments = [
    {
      id: 'env_1',
      name: 'Production',
      description: 'Production environment for live applications',
      type: EnvironmentType.PRODUCTION,
      projectId: 'proj_1',
      url: 'https://app.example.com',
      config: {
        region: 'us-east-1',
        cloudProvider: 'AWS',
        infrastructure: {
          type: 'kubernetes',
          version: '1.24',
          nodes: 3,
        },
        monitoring: {
          tools: ['Prometheus', 'Grafana', 'ELK Stack'],
          alerts: true,
        },
      },
      variables: {
        DATABASE_URL:
          'postgresql://user:pass@production-db.example.com:5432/db',
        API_KEY: 'production_api_key_123',
        LOG_LEVEL: 'ERROR',
        ENVIRONMENT: 'PRODUCTION',
      },
    },
    {
      id: 'env_2',
      name: 'Staging',
      description: 'Staging environment for pre-production testing',
      type: EnvironmentType.STAGING,
      projectId: 'proj_1',
      url: 'https://staging.example.com',
      config: {
        region: 'us-east-1',
        cloudProvider: 'AWS',
        infrastructure: {
          type: 'kubernetes',
          version: '1.24',
          nodes: 2,
        },
        monitoring: {
          tools: ['Prometheus', 'Grafana'],
          alerts: true,
        },
      },
      variables: {
        DATABASE_URL: 'postgresql://user:pass@staging-db.example.com:5432/db',
        API_KEY: 'staging_api_key_123',
        LOG_LEVEL: 'DEBUG',
        ENVIRONMENT: 'STAGING',
      },
    },
    {
      id: 'env_3',
      name: 'Development',
      description: 'Development environment for feature development',
      type: EnvironmentType.DEVELOPMENT,
      projectId: 'proj_1',
      url: 'https://dev.example.com',
      config: {
        region: 'us-east-1',
        cloudProvider: 'AWS',
        infrastructure: {
          type: 'kubernetes',
          version: '1.24',
          nodes: 1,
        },
        monitoring: {
          tools: ['Prometheus'],
          alerts: false,
        },
      },
      variables: {
        DATABASE_URL:
          'postgresql://user:pass@development-db.example.com:5432/db',
        API_KEY: 'development_api_key_123',
        LOG_LEVEL: 'DEBUG',
        ENVIRONMENT: 'DEVELOPMENT',
      },
    },
  ];

  await Promise.all(
    environments.map((env) =>
      prisma.environment.create({
        data: {
          ...env,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );
}
