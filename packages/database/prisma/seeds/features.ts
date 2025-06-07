import { FeatureStatus, Priority, type PrismaClient } from '@prisma/client';

export async function seedFeatures(prisma: PrismaClient) {
  const features = [
    {
      id: 'feat_1',
      title: 'User Authentication',
      description: 'Secure user authentication and authorization system',
      projectId: 'proj_1',
      sprintId: 'sprint_1',
      status: FeatureStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignedUserId: 'user_1',
      acceptanceCriteria:
        'Users can register with email and password\nUsers can login with credentials\nPassword reset functionality\nSession management',
      labels: ['core', 'security'],
      tags: {
        type: 'CORE',
        complexity: 'MEDIUM',
        estimatedEffort: '2 weeks',
        dependencies: [],
      },
    },
    {
      id: 'feat_2',
      title: 'Product Catalog',
      description: 'Product listing and search functionality',
      projectId: 'proj_1',
      sprintId: 'sprint_1',
      status: FeatureStatus.BACKLOG,
      priority: Priority.HIGH,
      assignedUserId: 'user_2',
      acceptanceCriteria:
        'Product listing with pagination\nAdvanced search and filtering\nProduct categories and tags\nProduct details view',
      labels: ['core', 'product'],
      tags: {
        type: 'CORE',
        complexity: 'HIGH',
        estimatedEffort: '3 weeks',
        dependencies: [],
      },
    },
    {
      id: 'feat_3',
      title: 'Shopping Cart',
      description: 'Shopping cart and checkout process',
      projectId: 'proj_1',
      sprintId: 'sprint_1',
      status: FeatureStatus.BACKLOG,
      priority: Priority.HIGH,
      assignedUserId: 'user_2',
      acceptanceCriteria:
        'Add/remove items from cart\nUpdate quantities\nSave cart for later\nProceed to checkout',
      labels: ['core', 'cart'],
      tags: {
        type: 'CORE',
        complexity: 'MEDIUM',
        estimatedEffort: '2 weeks',
        dependencies: ['feat_2'],
      },
    },
    {
      id: 'feat_4',
      title: 'Payment Integration',
      description: 'Secure payment processing system',
      projectId: 'proj_1',
      sprintId: 'sprint_1',
      status: FeatureStatus.BACKLOG,
      priority: Priority.CRITICAL,
      assignedUserId: 'user_1',
      acceptanceCriteria:
        'Multiple payment methods\nSecure payment processing\nPayment confirmation\nOrder history',
      labels: ['core', 'payment'],
      tags: {
        type: 'CORE',
        complexity: 'HIGH',
        estimatedEffort: '3 weeks',
        dependencies: ['feat_3'],
      },
    },
    {
      id: 'feat_5',
      title: 'User Reviews',
      description: 'Product review and rating system',
      projectId: 'proj_1',
      sprintId: 'sprint_1',
      status: FeatureStatus.BACKLOG,
      priority: Priority.MEDIUM,
      assignedUserId: 'user_3',
      acceptanceCriteria:
        'Write product reviews\nRate products\nView all reviews\nReview moderation',
      labels: ['enhancement', 'reviews'],
      tags: {
        type: 'ENHANCEMENT',
        complexity: 'LOW',
        estimatedEffort: '1 week',
        dependencies: ['feat_2'],
      },
    },
  ];

  await Promise.all(
    features.map((feature) =>
      prisma.feature.create({
        data: {
          ...feature,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );
}
