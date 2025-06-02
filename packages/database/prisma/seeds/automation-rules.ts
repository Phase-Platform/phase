import { PrismaClient } from "@prisma/client";

export async function seedAutomationRules(prisma: PrismaClient) {
  const automationRules = [
    {
      id: "auto_1",
      name: "Task Status Update",
      description:
        "Automatically update task status based on completion criteria",
      trigger: {
        type: "TASK_UPDATED",
        conditions: [
          {
            field: "status",
            operator: "EQUALS",
            value: "IN_PROGRESS",
          },
        ],
      },
      actions: [
        {
          type: "UPDATE_FIELD",
          target: "TASK",
          field: "status",
          value: "IN_REVIEW",
        },
        {
          type: "CREATE_NOTIFICATION",
          target: "ASSIGNEE",
          template: "TASK_READY_FOR_REVIEW",
        },
      ],
      projectId: "proj_1",
      createdById: "user_1",
      isActive: true,
      metadata: {
        priority: "HIGH",
        lastTriggered: new Date(),
        triggerCount: 5,
      },
    },
    {
      id: "auto_2",
      name: "Feature Completion",
      description: "Automatically handle feature completion workflow",
      trigger: {
        type: "FEATURE_UPDATED",
        conditions: [
          {
            field: "status",
            operator: "EQUALS",
            value: "COMPLETED",
          },
        ],
      },
      actions: [
        {
          type: "CREATE_TASK",
          target: "PROJECT",
          template: "FEATURE_DOCUMENTATION",
        },
        {
          type: "SEND_WEBHOOK",
          target: "SLACK",
          event: "FEATURE_COMPLETED",
        },
      ],
      projectId: "proj_1",
      createdById: "user_1",
      isActive: true,
      metadata: {
        priority: "MEDIUM",
        lastTriggered: new Date(),
        triggerCount: 3,
      },
    },
    {
      id: "auto_3",
      name: "Release Preparation",
      description: "Automatically prepare release when all features are ready",
      trigger: {
        type: "FEATURE_UPDATED",
        conditions: [
          {
            field: "status",
            operator: "EQUALS",
            value: "READY_FOR_RELEASE",
          },
        ],
      },
      actions: [
        {
          type: "CREATE_RELEASE",
          target: "PROJECT",
          template: "STANDARD_RELEASE",
        },
        {
          type: "NOTIFY_TEAM",
          target: "ALL",
          template: "RELEASE_PREPARATION",
        },
      ],
      projectId: "proj_1",
      createdById: "user_1",
      isActive: true,
      metadata: {
        priority: "HIGH",
        lastTriggered: new Date(),
        triggerCount: 2,
      },
    },
  ];

  for (const rule of automationRules) {
    await prisma.automationRule.create({
      data: {
        ...rule,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create automation logs
    const logs = [
      {
        level: "INFO",
        message: `Automation rule ${rule.name} created successfully`,
        metadata: {
          timestamp: new Date(),
          details: "Initial setup completed",
        },
      },
      {
        level: "INFO",
        message: `First trigger for ${rule.name}`,
        metadata: {
          timestamp: new Date(),
          details: "First successful execution",
        },
      },
    ];

    for (const log of logs) {
      await prisma.automationLog.create({
        data: {
          automationRuleId: rule.id,
          level: log.level,
          message: log.message,
          metadata: log.metadata,
        },
      });
    }
  }
}
