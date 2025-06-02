import { PrismaClient } from "@prisma/client";

export async function seedFeatures(prisma: PrismaClient) {
  const features = [
    {
      id: "feat_1",
      name: "User Authentication",
      description: "Secure user authentication and authorization system",
      projectId: "proj_1",
      phaseId: "phase_3",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assignedToId: "user_1",
      metadata: {
        type: "CORE",
        complexity: "MEDIUM",
        estimatedEffort: "2 weeks",
        dependencies: [],
        acceptanceCriteria: [
          "Users can register with email and password",
          "Users can login with credentials",
          "Password reset functionality",
          "Session management",
        ],
      },
    },
    {
      id: "feat_2",
      name: "Product Catalog",
      description: "Product listing and search functionality",
      projectId: "proj_1",
      phaseId: "phase_3",
      status: "PENDING",
      priority: "HIGH",
      assignedToId: "user_2",
      metadata: {
        type: "CORE",
        complexity: "HIGH",
        estimatedEffort: "3 weeks",
        dependencies: [],
        acceptanceCriteria: [
          "Product listing with pagination",
          "Advanced search and filtering",
          "Product categories and tags",
          "Product details view",
        ],
      },
    },
    {
      id: "feat_3",
      name: "Shopping Cart",
      description: "Shopping cart and checkout process",
      projectId: "proj_1",
      phaseId: "phase_3",
      status: "PENDING",
      priority: "HIGH",
      assignedToId: "user_2",
      metadata: {
        type: "CORE",
        complexity: "MEDIUM",
        estimatedEffort: "2 weeks",
        dependencies: ["feat_2"],
        acceptanceCriteria: [
          "Add/remove items from cart",
          "Update quantities",
          "Save cart for later",
          "Proceed to checkout",
        ],
      },
    },
    {
      id: "feat_4",
      name: "Payment Integration",
      description: "Secure payment processing system",
      projectId: "proj_1",
      phaseId: "phase_3",
      status: "PENDING",
      priority: "CRITICAL",
      assignedToId: "user_1",
      metadata: {
        type: "CORE",
        complexity: "HIGH",
        estimatedEffort: "3 weeks",
        dependencies: ["feat_3"],
        acceptanceCriteria: [
          "Multiple payment methods",
          "Secure payment processing",
          "Payment confirmation",
          "Order history",
        ],
      },
    },
    {
      id: "feat_5",
      name: "User Reviews",
      description: "Product review and rating system",
      projectId: "proj_1",
      phaseId: "phase_3",
      status: "PENDING",
      priority: "MEDIUM",
      assignedToId: "user_3",
      metadata: {
        type: "ENHANCEMENT",
        complexity: "LOW",
        estimatedEffort: "1 week",
        dependencies: ["feat_2"],
        acceptanceCriteria: [
          "Write product reviews",
          "Rate products",
          "View all reviews",
          "Review moderation",
        ],
      },
    },
  ];

  for (const feature of features) {
    await prisma.feature.create({
      data: {
        ...feature,
        title: feature.name,
        status: feature.status as
          | "BACKLOG"
          | "PLANNED"
          | "IN_PROGRESS"
          | "REVIEW"
          | "COMPLETED"
          | "BLOCKED",
        priority: feature.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create feature tasks
    const tasks = [
      {
        title: "Requirements Analysis",
        description: "Analyze and document feature requirements",
        status: feature.status === "COMPLETED" ? "COMPLETED" : "PENDING",
        priority: feature.priority,
        assignedToId: feature.assignedToId,
        estimatedHours: 8,
      },
      {
        title: "Technical Design",
        description: "Create technical design document",
        status: "PENDING",
        priority: feature.priority,
        assignedToId: feature.assignedToId,
        estimatedHours: 16,
      },
      {
        title: "Implementation",
        description: "Implement feature functionality",
        status: "PENDING",
        priority: feature.priority,
        assignedToId: feature.assignedToId,
        estimatedHours: 40,
      },
      {
        title: "Testing",
        description: "Write and execute tests",
        status: "PENDING",
        priority: feature.priority,
        assignedToId: "user_3", // QA Engineer
        estimatedHours: 16,
      },
    ];

    for (const task of tasks) {
      await prisma.task.create({
        data: {
          ...task,
          featureId: feature.id,
          projectId: feature.projectId,
          phaseId: feature.phaseId,
          creatorId: feature.assignedToId,
          status: task.status as
            | "TODO"
            | "IN_PROGRESS"
            | "REVIEW"
            | "COMPLETED"
            | "BLOCKED",
          priority: task.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create feature test cases
    const testCases = feature.metadata.acceptanceCriteria.map(
      (criteria, index) => ({
        title: `Test Case ${index + 1}`,
        description: criteria,
        type: "FUNCTIONAL",
        priority: feature.priority,
        status: "PENDING",
        steps: [
          {
            step: 1,
            action: `Setup for testing ${criteria}`,
            expectedResult: "Environment ready for testing",
          },
          {
            step: 2,
            action: `Execute test for ${criteria}`,
            expectedResult: "Test passes successfully",
          },
        ],
        expected: criteria,
      }),
    );

    for (const testCase of testCases) {
      await prisma.testCase.create({
        data: {
          ...testCase,
          featureId: feature.id,
          projectId: feature.projectId,
          status: testCase.status as "ACTIVE" | "INACTIVE" | "DEPRECATED",
          priority: testCase.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          type: testCase.type as
            | "FUNCTIONAL"
            | "INTEGRATION"
            | "UNIT"
            | "E2E"
            | "PERFORMANCE"
            | "SECURITY"
            | "USABILITY",
          expected: testCase.expected || "Expected behavior not specified",
          steps: testCase.steps.map(
            (step) =>
              `${step.step}. ${step.action} - Expected: ${step.expectedResult}`,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}
