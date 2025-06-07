import type { PrismaClient } from '@prisma/client';

export async function seedCustomFields(prisma: PrismaClient) {
  const customFields = [
    {
      id: 'cf_1',
      name: 'Priority Level',
      type: 'SELECT',
      entityType: 'TASK',
      projectId: 'proj_1',
      createdById: 'user_1',
      options: ['Low', 'Medium', 'High', 'Critical'],
      defaultValue: 'Medium',
      isRequired: true,
      order: 1,
      metadata: {
        description: 'Task priority level',
        color: '#FF5733',
      },
    },
    {
      id: 'cf_2',
      name: 'Story Points',
      type: 'NUMBER',
      entityType: 'TASK',
      projectId: 'proj_1',
      createdById: 'user_1',
      minValue: 1,
      maxValue: 13,
      defaultValue: 3,
      isRequired: true,
      order: 2,
      metadata: {
        description: 'Agile story points estimation',
        unit: 'points',
      },
    },
    {
      id: 'cf_3',
      name: 'Environment',
      type: 'SELECT',
      entityType: 'FEATURE',
      projectId: 'proj_1',
      createdById: 'user_1',
      options: ['Development', 'Staging', 'Production'],
      defaultValue: 'Development',
      isRequired: true,
      order: 1,
      metadata: {
        description: 'Deployment environment',
        color: '#33FF57',
      },
    },
    {
      id: 'cf_4',
      name: 'Risk Level',
      type: 'SELECT',
      entityType: 'FEATURE',
      projectId: 'proj_1',
      createdById: 'user_1',
      options: ['Low', 'Medium', 'High'],
      defaultValue: 'Low',
      isRequired: true,
      order: 2,
      metadata: {
        description: 'Feature risk assessment',
        color: '#3357FF',
      },
    },
  ];

  // Create activity logs for custom fields and their values in parallel
  await Promise.all(
    customFields.map(async (field) => {
      // Create activity log for the custom field
      await prisma.activityLog.create({
        data: {
          type: 'SYSTEM',
          description: `Custom field created: ${field.name}`,
          metadata: {
            ...field,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          userId: field.createdById,
          projectId: field.projectId,
        },
      });

      // Create activity logs for field values
      const values = [
        {
          entityId: 'task_1',
          entityType: 'TASK',
          customFieldId: field.id,
          value: field.defaultValue,
        },
        {
          entityId: 'feature_1',
          entityType: 'FEATURE',
          customFieldId: field.id,
          value: field.defaultValue,
        },
      ];

      await Promise.all(
        values.map((value) =>
          prisma.activityLog.create({
            data: {
              type: 'SYSTEM',
              description: `Custom field value set for ${field.name}`,
              metadata: {
                ...value,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              userId: field.createdById,
              projectId: field.projectId,
            },
          })
        )
      );
    })
  );
}
