import type { PrismaClient } from '@prisma/client';

export async function seedCodeReviews(prisma: PrismaClient) {
  const codeReviews = [
    {
      title: 'Authentication Module Review',
      description: 'Code review for user authentication implementation',
      status: 'IN_PROGRESS',
      type: 'FEATURE',
      projectId: 'proj_1',
      taskId: 'task_2',
      authorId: 'user_3',
      reviewerId: 'user_1',
      changes: {
        files: [
          {
            path: 'src/auth/register.ts',
            additions: 150,
            deletions: 0,
            changes: [
              {
                line: 10,
                content: 'Added input validation',
                type: 'addition',
              },
              {
                line: 25,
                content: 'Implemented password hashing',
                type: 'addition',
              },
            ],
          },
          {
            path: 'src/auth/login.ts',
            additions: 100,
            deletions: 20,
            changes: [
              {
                line: 15,
                content: 'Updated login logic',
                type: 'modification',
              },
            ],
          },
        ],
      },
      comments: {
        general: [
          {
            author: 'user_1',
            content:
              'Good implementation overall, but consider adding rate limiting',
            timestamp: new Date(),
          },
          {
            author: 'user_3',
            content: 'Added rate limiting as suggested',
            timestamp: new Date(),
          },
        ],
        inline: [
          {
            file: 'src/auth/register.ts',
            line: 25,
            author: 'user_1',
            content: 'Consider using a stronger hashing algorithm',
            timestamp: new Date(),
          },
        ],
      },
      metrics: {
        codeCoverage: 85,
        complexity: 'medium',
        issues: 2,
        suggestions: 3,
      },
    },
    {
      title: 'API Endpoints Refactoring',
      description: 'Code review for API endpoints refactoring',
      status: 'PENDING',
      type: 'REFACTOR',
      projectId: 'proj_1',
      taskId: 'task_3',
      authorId: 'user_2',
      reviewerId: 'user_4',
      changes: {
        files: [
          {
            path: 'src/api/routes.ts',
            additions: 50,
            deletions: 30,
            changes: [
              {
                line: 5,
                content: 'Refactored route handlers',
                type: 'modification',
              },
            ],
          },
        ],
      },
      comments: {
        general: [
          {
            author: 'user_4',
            content: 'Good refactoring, improved code organization',
            timestamp: new Date(),
          },
        ],
      },
      metrics: {
        codeCoverage: 90,
        complexity: 'low',
        issues: 0,
        suggestions: 1,
      },
    },
  ];

  // Create activity logs for code reviews in parallel
  await Promise.all(
    codeReviews.map((review) =>
      prisma.activityLog.create({
        data: {
          type: 'SYSTEM',
          description: `Code review created: ${review.title}`,
          metadata: {
            ...review,
            startedAt: new Date(),
            completedAt: review.status === 'IN_PROGRESS' ? null : new Date(),
            reviewType: 'standard',
            priority: 'high',
            relatedIssues: ['issue-123', 'issue-124'],
          },
          userId: review.authorId,
          projectId: review.projectId,
        },
      })
    )
  );
}
