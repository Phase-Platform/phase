import {
  PrismaClient,
  TaskStatus,
  Priority,
  TaskType,
  ComplexityLevel,
} from "@prisma/client";

export async function seedTasks(prisma: PrismaClient) {
  const tasks = [
    {
      id: "task_1",
      title: "Database Schema Design",
      description:
        "Design and implement the database schema for the e-commerce platform",
      projectId: "proj_1",
      phaseId: "phase_2",
      featureId: null,
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      assignedToId: "user_2",
      estimatedHours: 16,
      metadata: {
        type: "DESIGN",
        complexity: "HIGH",
        dependencies: [],
        deliverables: [
          "Entity Relationship Diagram",
          "Database Schema Documentation",
          "Migration Scripts",
        ],
      },
    },
    {
      id: "task_2",
      title: "API Endpoints Implementation",
      description: "Implement RESTful API endpoints for user authentication",
      projectId: "proj_1",
      phaseId: "phase_3",
      featureId: "feat_1",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignedToId: "user_1",
      estimatedHours: 24,
      metadata: {
        type: "DEVELOPMENT",
        complexity: "MEDIUM",
        dependencies: ["task_1"],
        deliverables: ["API Documentation", "Unit Tests", "Integration Tests"],
      },
    },
    {
      id: "task_3",
      title: "Frontend Components Development",
      description:
        "Develop reusable frontend components for the product catalog",
      projectId: "proj_1",
      phaseId: "phase_3",
      featureId: "feat_2",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assignedToId: "user_2",
      estimatedHours: 32,
      metadata: {
        type: "DEVELOPMENT",
        complexity: "MEDIUM",
        dependencies: ["task_2"],
        deliverables: [
          "Component Library",
          "Storybook Documentation",
          "Unit Tests",
        ],
      },
    },
    {
      id: "task_4",
      title: "Payment Gateway Integration",
      description: "Integrate payment gateway for secure transactions",
      projectId: "proj_1",
      phaseId: "phase_3",
      featureId: "feat_4",
      status: TaskStatus.TODO,
      priority: Priority.CRITICAL,
      assignedToId: "user_1",
      estimatedHours: 40,
      metadata: {
        type: "INTEGRATION",
        complexity: "HIGH",
        dependencies: ["task_2", "task_3"],
        deliverables: [
          "Payment Integration Documentation",
          "Security Audit Report",
          "Test Cases",
        ],
      },
    },
    {
      id: "task_5",
      title: "Performance Testing",
      description: "Conduct performance testing for critical features",
      projectId: "proj_1",
      phaseId: "phase_4",
      featureId: null,
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assignedToId: "user_3",
      estimatedHours: 24,
      metadata: {
        type: "TESTING",
        complexity: "MEDIUM",
        dependencies: ["task_2", "task_3", "task_4"],
        deliverables: [
          "Performance Test Report",
          "Load Test Results",
          "Optimization Recommendations",
        ],
      },
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        creatorId: task.assignedToId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create task comments
    const comments = [
      {
        content: `Initial setup for ${task.title}`,
        userId: task.assignedToId,
        type: "UPDATE",
      },
      {
        content: `Progress update: Started working on ${task.title}`,
        userId: task.assignedToId,
        type: "UPDATE",
      },
    ];

    for (const comment of comments) {
      await prisma.comment.create({
        data: {
          content: comment.content,
          userId: comment.userId,
          projectId: task.projectId,
          entityType: "TASK",
          entityId: task.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create task attachments
    if (task.metadata.deliverables) {
      for (const deliverable of task.metadata.deliverables) {
        await prisma.attachment.create({
          data: {
            name: deliverable,
            type: "DOCUMENT",
            url: `https://example.com/documents/${task.id}/${deliverable.toLowerCase().replace(/\s+/g, "-")}`,
            size: 1024, // Default size
            userId: task.assignedToId,
            taskId: task.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    // Create task time entries
    if (
      task.status === TaskStatus.IN_PROGRESS ||
      task.status === TaskStatus.COMPLETED
    ) {
      const timeEntries = [
        {
          userId: task.assignedToId,
          duration: Math.floor(task.estimatedHours / 2) * 60, // Convert hours to minutes
          description: "Initial implementation",
          date: new Date(),
        },
        {
          userId: task.assignedToId,
          duration: Math.floor(task.estimatedHours / 4) * 60, // Convert hours to minutes
          description: "Code review and fixes",
          date: new Date(),
        },
      ];

      for (const timeEntry of timeEntries) {
        await prisma.timeEntry.create({
          data: {
            ...timeEntry,
            projectId: task.projectId,
            taskId: task.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
  }
}
