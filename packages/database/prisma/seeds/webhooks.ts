import { PrismaClient } from "@prisma/client";

export async function seedWebhooks(prisma: PrismaClient) {
  const webhooks = [
    {
      id: "web_1",
      name: "GitHub Webhook",
      url: "https://api.example.com/webhooks/github",
      events: ["push", "pull_request", "issues"],
      secret: "github_webhook_secret",
      status: "ACTIVE",
      projectId: "proj_1",
      createdById: "user_1",
      metadata: {
        description: "Webhook for GitHub repository events",
        lastTriggered: new Date(),
        successCount: 10,
        failureCount: 0,
      },
    },
    {
      id: "web_2",
      name: "Slack Notifications",
      url: "https://hooks.slack.com/services/example",
      events: ["task_created", "task_updated", "deployment"],
      secret: "slack_webhook_secret",
      status: "ACTIVE",
      projectId: "proj_1",
      createdById: "user_1",
      metadata: {
        description: "Webhook for Slack notifications",
        lastTriggered: new Date(),
        successCount: 15,
        failureCount: 1,
      },
    },
    {
      id: "web_3",
      name: "Jira Sync",
      url: "https://example.atlassian.net/webhook",
      events: ["issue_created", "issue_updated", "comment_created"],
      secret: "jira_webhook_secret",
      status: "ACTIVE",
      projectId: "proj_1",
      createdById: "user_1",
      metadata: {
        description: "Webhook for Jira synchronization",
        lastTriggered: new Date(),
        successCount: 8,
        failureCount: 0,
      },
    },
  ];

  for (const webhook of webhooks) {
    await prisma.webhook.create({
      data: {
        ...webhook,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create webhook logs
    const logs = [
      {
        level: "INFO",
        message: `Webhook ${webhook.name} created successfully`,
        metadata: {
          timestamp: new Date(),
          details: "Initial setup completed",
        },
      },
      {
        level: "INFO",
        message: `First event triggered for ${webhook.name}`,
        metadata: {
          timestamp: new Date(),
          details: "First successful event delivery",
        },
      },
    ];

    // Update webhook with logs in metadata
    await prisma.webhook.update({
      where: { id: webhook.id },
      data: {
        metadata: {
          ...webhook.metadata,
          logs: logs,
        },
      },
    });
  }
}
