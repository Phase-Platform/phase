import type { PrismaClient } from '@prisma/client';

export async function seedIntegrations(prisma: PrismaClient) {
  const integrations = [
    {
      id: 'int_1',
      name: 'GitHub Integration',
      type: 'GITHUB',
      status: 'ACTIVE',
      projectId: 'proj_1',
      createdById: 'user_1',
      config: {
        repository: 'example/repo',
        branch: 'main',
        webhookSecret: 'github_webhook_secret',
        events: ['push', 'pull_request', 'issues'],
        permissions: {
          read: true,
          write: true,
          admin: false,
        },
      },
      metadata: {
        lastSync: new Date(),
        syncStatus: 'SUCCESS',
        errorCount: 0,
      },
    },
    {
      id: 'int_2',
      name: 'Slack Integration',
      type: 'SLACK',
      status: 'ACTIVE',
      projectId: 'proj_1',
      createdById: 'user_1',
      config: {
        workspace: 'example-workspace',
        channels: ['#general', '#deployments', '#alerts'],
        botToken: 'slack_bot_token',
        events: ['task_created', 'task_updated', 'deployment'],
      },
      metadata: {
        lastSync: new Date(),
        syncStatus: 'SUCCESS',
        errorCount: 0,
      },
    },
    {
      id: 'int_3',
      name: 'Jira Integration',
      type: 'JIRA',
      status: 'ACTIVE',
      projectId: 'proj_1',
      createdById: 'user_1',
      config: {
        projectKey: 'PROJ',
        baseUrl: 'https://example.atlassian.net',
        apiToken: 'jira_api_token',
        syncDirection: 'BIDIRECTIONAL',
        fieldMappings: {
          status: 'status',
          priority: 'priority',
          assignee: 'assignee',
        },
      },
      metadata: {
        lastSync: new Date(),
        syncStatus: 'SUCCESS',
        errorCount: 0,
      },
    },
  ];

  // Create integrations and their related data in parallel
  await Promise.all(
    integrations.map(async (integration) => {
      // Create integration
      await prisma.integration.create({
        data: {
          ...integration,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create integration logs
      const logs = [
        {
          level: 'INFO',
          message: `Integration ${integration.name} initialized successfully`,
          metadata: {
            timestamp: new Date(),
            details: 'Initial setup completed',
          },
        },
        {
          level: 'INFO',
          message: `First sync completed for ${integration.name}`,
          metadata: {
            timestamp: new Date(),
            details: 'Initial data sync successful',
          },
        },
      ];

      await Promise.all(
        logs.map(async (log) => {
          await prisma.integrationLog.create({
            data: {
              ...log,
              integrationId: integration.id,
              createdAt: new Date(),
            },
          });
        })
      );

      // Create integration settings
      await prisma.integrationSetting.create({
        data: {
          integrationId: integration.id,
          syncInterval: 300, // 5 minutes
          retryAttempts: 3,
          timeout: 30,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );
}
