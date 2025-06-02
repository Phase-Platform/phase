import { PrismaClient } from "@prisma/client";

export async function seedDeployments(prisma: PrismaClient) {
  const deployments = [
    {
      version: "1.0.0",
      status: "COMPLETED",
      projectId: "proj_1",
      environmentId: "env_1",
      startTime: new Date("2024-03-01T09:00:00Z"),
      endTime: new Date("2024-03-01T09:25:00Z"),
      logs: `
[2024-03-01 09:00:00] Starting deployment
[2024-03-01 09:05:00] Running database migrations
[2024-03-01 09:10:00] Deploying backend services
[2024-03-01 09:15:00] Deploying frontend application
[2024-03-01 09:20:00] Running smoke tests
[2024-03-01 09:25:00] Deployment completed successfully
      `,
      metadata: {
        duration: "25 minutes",
        success: true,
        rollback: false,
        affectedServices: ["backend", "frontend", "database"],
      },
    },
  ];

  for (const deployment of deployments) {
    await prisma.deployment.create({
      data: deployment,
    });
  }
}
