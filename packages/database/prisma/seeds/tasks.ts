import { FeatureStatus, Priority, type PrismaClient } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient) {
  const tasks = [
    {
      id: 'task_1',
      title: 'Database Schema Design',
      description:
        'Design and implement the database schema for the e-commerce platform',
      projectId: 'proj_1',
      phaseId: 'phase_2',
      featureId: null,
      status: FeatureStatus.BACKLOG,
      priority: Priority.HIGH,
      assignedUserId: 'user_2',
      storyPoints: 8,
      businessValue: 5,
      acceptanceCriteria:
        'Schema should support all required entities and relationships',
      labels: ['database', 'design'],
      tags: {
        type: 'DESIGN',
        complexity: 'HIGH',
        dependencies: [],
        deliverables: [
          'Entity Relationship Diagram',
          'Database Schema Documentation',
          'Migration Scripts',
        ],
      },
    },
    {
      id: 'task_2',
      title: 'API Endpoints Implementation',
      description: 'Implement RESTful API endpoints for user authentication',
      projectId: 'proj_1',
      phaseId: 'phase_3',
      featureId: 'feat_1',
      status: FeatureStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignedUserId: 'user_1',
      storyPoints: 13,
      businessValue: 8,
      acceptanceCriteria: 'API should handle all authentication flows securely',
      labels: ['api', 'authentication'],
      tags: {
        type: 'DEVELOPMENT',
        complexity: 'MEDIUM',
        dependencies: ['task_1'],
        deliverables: ['API Documentation', 'Unit Tests', 'Integration Tests'],
      },
    },
    {
      id: 'task_3',
      title: 'Frontend Components Development',
      description:
        'Develop reusable frontend components for the product catalog',
      projectId: 'proj_1',
      phaseId: 'phase_3',
      featureId: 'feat_2',
      status: FeatureStatus.BACKLOG,
      priority: Priority.HIGH,
      assignedUserId: 'user_2',
      storyPoints: 21,
      businessValue: 7,
      acceptanceCriteria:
        'Components should be reusable and follow design system',
      labels: ['frontend', 'components'],
      tags: {
        type: 'DEVELOPMENT',
        complexity: 'MEDIUM',
        dependencies: ['task_2'],
        deliverables: [
          'Component Library',
          'Storybook Documentation',
          'Unit Tests',
        ],
      },
    },
    {
      id: 'task_4',
      title: 'Payment Gateway Integration',
      description: 'Integrate payment gateway for secure transactions',
      projectId: 'proj_1',
      phaseId: 'phase_3',
      featureId: 'feat_4',
      status: FeatureStatus.BACKLOG,
      priority: Priority.CRITICAL,
      assignedUserId: 'user_1',
      storyPoints: 13,
      businessValue: 9,
      acceptanceCriteria: 'Payment processing should be secure and reliable',
      labels: ['payment', 'integration'],
      tags: {
        type: 'INTEGRATION',
        complexity: 'HIGH',
        dependencies: ['task_2', 'task_3'],
        deliverables: [
          'Payment Integration Documentation',
          'Security Audit Report',
          'Test Cases',
        ],
      },
    },
    {
      id: 'task_5',
      title: 'Performance Testing',
      description: 'Conduct performance testing for critical features',
      projectId: 'proj_1',
      phaseId: 'phase_4',
      featureId: null,
      status: FeatureStatus.BACKLOG,
      priority: Priority.HIGH,
      assignedUserId: 'user_3',
      storyPoints: 8,
      businessValue: 6,
      acceptanceCriteria:
        'System should meet performance requirements under load',
      labels: ['testing', 'performance'],
      tags: {
        type: 'TESTING',
        complexity: 'MEDIUM',
        dependencies: ['task_2', 'task_3', 'task_4'],
        deliverables: [
          'Performance Test Report',
          'Load Test Results',
          'Optimization Recommendations',
        ],
      },
    },
  ];

  // Create all features in parallel
  await Promise.all(
    tasks.map(async (task) => {
      const createdFeature = await prisma.feature.create({
        data: {
          ...task,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create comments in parallel
      const comments = [
        {
          content: `Initial setup for ${task.title}`,
          userId: task.assignedUserId,
          type: 'UPDATE',
        },
        {
          content: `Progress update: Started working on ${task.title}`,
          userId: task.assignedUserId,
          type: 'UPDATE',
        },
      ];

      await Promise.all(
        comments.map((comment) =>
          prisma.comment.create({
            data: {
              content: comment.content,
              userId: comment.userId,
              projectId: task.projectId,
              entityType: 'FEATURE',
              entityId: createdFeature.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );
    })
  );
}
