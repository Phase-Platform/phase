import { Methodology, type PrismaClient, TaskType } from '@prisma/client';

export async function seedWorkflowTemplates(prisma: PrismaClient) {
  const workflowTemplates = [
    {
      name: 'Standard Agile Workflow',
      description: 'Standard workflow for agile software development',
      type: 'AGILE',
      status: 'ACTIVE',
      category: 'SOFTWARE_DEVELOPMENT',
      methodology: Methodology.SCRUM,
      metadata: {
        methodology: 'Scrum',
        sprintDuration: 14,
        ceremonies: [
          'Daily Standup',
          'Sprint Planning',
          'Sprint Review',
          'Sprint Retrospective',
        ],
        roles: ['Product Owner', 'Scrum Master', 'Development Team'],
      },
      phases: [
        {
          name: 'Backlog',
          description: 'Product backlog items',
          order: 1,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Create User Story',
              description: 'Create a new user story',
              type: TaskType.DEVELOPMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Estimate Story Points',
              description: 'Estimate story points for the user story',
              type: TaskType.DEVELOPMENT,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Sprint Planning',
          description: 'Sprint planning phase',
          order: 2,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Select Stories',
              description: 'Select stories for the sprint',
              type: TaskType.DEVELOPMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Create Sprint Backlog',
              description: 'Create sprint backlog',
              type: TaskType.DEVELOPMENT,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Development',
          description: 'Development phase',
          order: 3,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Implement Feature',
              description: 'Implement the feature',
              type: TaskType.DEVELOPMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Write Tests',
              description: 'Write unit tests',
              type: TaskType.TESTING,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Code Review',
              description: 'Review the code',
              type: TaskType.REVIEW,
              order: 3,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Testing',
          description: 'Testing phase',
          order: 4,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'QA Testing',
              description: 'Perform QA testing',
              type: TaskType.TESTING,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Bug Fixing',
              description: 'Fix identified bugs',
              type: TaskType.DEVELOPMENT,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Done',
          description: 'Completed items',
          order: 5,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Documentation',
              description: 'Update documentation',
              type: TaskType.DOCUMENTATION,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Deployment',
              description: 'Deploy to production',
              type: TaskType.DEPLOYMENT,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
      ],
    },
    {
      name: 'Kanban Workflow',
      description: 'Workflow for continuous delivery using Kanban',
      type: 'KANBAN',
      status: 'ACTIVE',
      category: 'SOFTWARE_DEVELOPMENT',
      methodology: Methodology.KANBAN,
      metadata: {
        methodology: 'Kanban',
        wipLimits: {
          'To Do': 10,
          'In Progress': 5,
          Review: 3,
          Done: 10,
        },
        metrics: ['Lead Time', 'Cycle Time', 'Throughput'],
      },
      phases: [
        {
          name: 'To Do',
          description: 'Backlog items',
          order: 1,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Create Ticket',
              description: 'Create a new ticket',
              type: TaskType.DEVELOPMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Prioritize',
              description: 'Prioritize the ticket',
              type: TaskType.DEVELOPMENT,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'In Progress',
          description: 'Items being worked on',
          order: 2,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Development',
              description: 'Implement the feature',
              type: TaskType.DEVELOPMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'Testing',
              description: 'Test the implementation',
              type: TaskType.TESTING,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Review',
          description: 'Items under review',
          order: 3,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Code Review',
              description: 'Review the code',
              type: TaskType.REVIEW,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
            {
              title: 'QA Review',
              description: 'QA review',
              type: TaskType.REVIEW,
              order: 2,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
        {
          name: 'Done',
          description: 'Completed items',
          order: 4,
          status: 'ACTIVE',
          type: 'DEVELOPMENT',
          isRequired: true,
          allowedRoles: [],
          tasks: [
            {
              title: 'Deployment',
              description: 'Deploy to production',
              type: TaskType.DEPLOYMENT,
              order: 1,
              isRequired: true,
              complexity: 'MEDIUM',
            },
          ],
        },
      ],
    },
  ];

  await Promise.all(
    workflowTemplates.map(async (template) => {
      const { phases, ...templateData } = template;

      const createdTemplate = await prisma.workflowTemplate.create({
        data: {
          ...templateData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await Promise.all(
        phases.map(async (phase) => {
          const { tasks, ...phaseData } = phase;

          const createdPhase = await prisma.phaseTemplate.create({
            data: {
              ...phaseData,
              workflowId: createdTemplate.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          await Promise.all(
            tasks.map((task) =>
              prisma.taskTemplate.create({
                data: {
                  ...task,
                  phaseId: createdPhase.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              })
            )
          );
        })
      );
    })
  );
}
