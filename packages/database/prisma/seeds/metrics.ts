import { PrismaClient } from "@prisma/client";

export async function seedMetrics(prisma: PrismaClient) {
  const metrics = [
    {
      name: "Code Coverage",
      description: "Percentage of code covered by tests",
      type: "PERCENTAGE",
      projectId: "proj_1",
      value: 85.5,
      target: 90,
      unit: "%",
      metadata: {
        category: "Quality",
        source: "Jest",
        lastUpdated: new Date(),
        trend: "increasing",
        history: [
          { date: new Date("2024-01-01"), value: 75 },
          { date: new Date("2024-02-01"), value: 80 },
          { date: new Date("2024-03-01"), value: 85.5 },
        ],
      },
    },
    {
      name: "Build Time",
      description: "Average time to build the application",
      type: "DURATION",
      projectId: "proj_1",
      value: 420,
      target: 300,
      unit: "seconds",
      metadata: {
        category: "Performance",
        source: "CI/CD",
        lastUpdated: new Date(),
        trend: "decreasing",
        history: [
          { date: new Date("2024-01-01"), value: 600 },
          { date: new Date("2024-02-01"), value: 500 },
          { date: new Date("2024-03-01"), value: 420 },
        ],
      },
    },
    {
      name: "API Response Time",
      description: "Average API response time",
      type: "DURATION",
      projectId: "proj_1",
      value: 150,
      target: 100,
      unit: "ms",
      metadata: {
        category: "Performance",
        source: "New Relic",
        lastUpdated: new Date(),
        trend: "stable",
        history: [
          { date: new Date("2024-01-01"), value: 160 },
          { date: new Date("2024-02-01"), value: 155 },
          { date: new Date("2024-03-01"), value: 150 },
        ],
      },
    },
    {
      name: "Bug Count",
      description: "Number of open bugs",
      type: "COUNT",
      projectId: "proj_1",
      value: 12,
      target: 5,
      unit: "bugs",
      metadata: {
        category: "Quality",
        source: "Jira",
        lastUpdated: new Date(),
        trend: "increasing",
        history: [
          { date: new Date("2024-01-01"), value: 8 },
          { date: new Date("2024-02-01"), value: 10 },
          { date: new Date("2024-03-01"), value: 12 },
        ],
      },
    },
    {
      name: "Deployment Frequency",
      description: "Number of deployments per week",
      type: "COUNT",
      projectId: "proj_1",
      value: 5,
      target: 7,
      unit: "deployments/week",
      metadata: {
        category: "DevOps",
        source: "GitHub Actions",
        lastUpdated: new Date(),
        trend: "increasing",
        history: [
          { date: new Date("2024-01-01"), value: 3 },
          { date: new Date("2024-02-01"), value: 4 },
          { date: new Date("2024-03-01"), value: 5 },
        ],
      },
    },
  ];

  for (const metric of metrics) {
    await prisma.metric.create({
      data: {
        ...metric,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
