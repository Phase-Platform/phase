import { PrismaClient, Methodology, TaskType } from "@prisma/client";

export async function seedWorkflowTemplates(prisma: PrismaClient) {
  const workflowTemplates = [
    {
      id: "wf_1",
      name: "Standard Agile Workflow",
      description: "Standard workflow for agile software development",
      type: "AGILE",
      status: "ACTIVE",
      category: "SOFTWARE_DEVELOPMENT",
      methodology: Methodology.SCRUM,
      metadata: {
        methodology: "Scrum",
        sprintDuration: 14,
        ceremonies: [
          "Daily Standup",
          "Sprint Planning",
          "Sprint Review",
          "Sprint Retrospective",
        ],
        roles: ["Product Owner", "Scrum Master", "Development Team"],
      },
      phases: [
        {
          name: "Backlog",
          description: "Product backlog items",
          order: 1,
          status: "ACTIVE",
          tasks: [
            {
              name: "Create User Story",
              description: "Create a new user story",
              type: "TASK",
              order: 1,
            },
            {
              name: "Estimate Story Points",
              description: "Estimate story points for the user story",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "Sprint Planning",
          description: "Sprint planning phase",
          order: 2,
          status: "ACTIVE",
          tasks: [
            {
              name: "Select Stories",
              description: "Select stories for the sprint",
              type: "TASK",
              order: 1,
            },
            {
              name: "Create Sprint Backlog",
              description: "Create sprint backlog",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "Development",
          description: "Development phase",
          order: 3,
          status: "ACTIVE",
          tasks: [
            {
              name: "Implement Feature",
              description: "Implement the feature",
              type: "TASK",
              order: 1,
            },
            {
              name: "Write Tests",
              description: "Write unit tests",
              type: "TASK",
              order: 2,
            },
            {
              name: "Code Review",
              description: "Review the code",
              type: "TASK",
              order: 3,
            },
          ],
        },
        {
          name: "Testing",
          description: "Testing phase",
          order: 4,
          status: "ACTIVE",
          tasks: [
            {
              name: "QA Testing",
              description: "Perform QA testing",
              type: "TASK",
              order: 1,
            },
            {
              name: "Bug Fixing",
              description: "Fix identified bugs",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "Done",
          description: "Completed items",
          order: 5,
          status: "ACTIVE",
          tasks: [
            {
              name: "Documentation",
              description: "Update documentation",
              type: "TASK",
              order: 1,
            },
            {
              name: "Deployment",
              description: "Deploy to production",
              type: "TASK",
              order: 2,
            },
          ],
        },
      ],
    },
    {
      id: "wf_2",
      name: "Kanban Workflow",
      description: "Workflow for continuous delivery using Kanban",
      type: "KANBAN",
      status: "ACTIVE",
      category: "SOFTWARE_DEVELOPMENT",
      methodology: Methodology.KANBAN,
      metadata: {
        methodology: "Kanban",
        wipLimits: {
          "To Do": 10,
          "In Progress": 5,
          Review: 3,
          Done: 10,
        },
        metrics: ["Lead Time", "Cycle Time", "Throughput"],
      },
      phases: [
        {
          name: "To Do",
          description: "Backlog items",
          order: 1,
          status: "ACTIVE",
          tasks: [
            {
              name: "Create Ticket",
              description: "Create a new ticket",
              type: "TASK",
              order: 1,
            },
            {
              name: "Prioritize",
              description: "Prioritize the ticket",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "In Progress",
          description: "Items being worked on",
          order: 2,
          status: "ACTIVE",
          tasks: [
            {
              name: "Development",
              description: "Implement the feature",
              type: "TASK",
              order: 1,
            },
            {
              name: "Testing",
              description: "Test the implementation",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "Review",
          description: "Items under review",
          order: 3,
          status: "ACTIVE",
          tasks: [
            {
              name: "Code Review",
              description: "Review the code",
              type: "TASK",
              order: 1,
            },
            {
              name: "QA Review",
              description: "QA review",
              type: "TASK",
              order: 2,
            },
          ],
        },
        {
          name: "Done",
          description: "Completed items",
          order: 4,
          status: "ACTIVE",
          tasks: [
            {
              name: "Deployment",
              description: "Deploy to production",
              type: "TASK",
              order: 1,
            },
          ],
        },
      ],
    },
  ];

  for (const template of workflowTemplates) {
    const { phases, ...templateData } = template;

    const createdTemplate = await prisma.workflowTemplate.create({
      data: {
        ...templateData,
        createdAt: new Date(),
      },
    });

    // Create phases for the template
    for (const phase of phases) {
      const { tasks, ...phaseData } = phase;

      const createdPhase = await prisma.phaseTemplate.create({
        data: {
          ...phaseData,
          workflowId: createdTemplate.id,
          createdAt: new Date(),
          type: "DEVELOPMENT",
          isRequired: true,
          allowedRoles: [],
        },
      });

      // Create tasks for each phase
      for (const task of tasks) {
        await prisma.taskTemplate.create({
          data: {
            title: task.name,
            description: task.description,
            type: TaskType.DEVELOPMENT,
            phaseId: createdPhase.id,
            order: task.order,
            createdAt: new Date(),
            isRequired: true,
            complexity: "MEDIUM",
          },
        });
      }
    }
  }
}
