import type { PrismaClient } from '@prisma/client';

export async function seedNotifications(prisma: PrismaClient) {
  const notifications = [
    {
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Implement User Registration" task',
      userId: 'user_3',
      projectId: 'proj_1',
      metadata: {
        taskId: 'task_2',
        taskTitle: 'Implement User Registration',
        assignedBy: 'user_1',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    {
      type: 'CODE_REVIEW_REQUESTED',
      title: 'Code Review Request',
      message:
        'Your code review has been requested for "Authentication Module"',
      userId: 'user_1',
      projectId: 'proj_1',
      metadata: {
        reviewId: 'review_1',
        reviewTitle: 'Authentication Module Review',
        author: 'user_3',
        changes: {
          files: 2,
          additions: 250,
          deletions: 20,
        },
      },
    },
    {
      type: 'PHASE_COMPLETED',
      title: 'Phase Completed',
      message: 'Requirements Gathering phase has been completed',
      userId: 'user_1',
      projectId: 'proj_1',
      phaseId: 'phase_1',
      metadata: {
        phaseName: 'Requirements Gathering',
        completedBy: 'user_2',
        nextPhase: 'Design Phase',
        deliverables: ['Requirements Specification', 'User Stories'],
      },
    },
    {
      type: 'DEADLINE_APPROACHING',
      title: 'Task Deadline Approaching',
      message: 'Task "Design Authentication Flow" is due in 2 days',
      userId: 'user_1',
      projectId: 'proj_1',
      metadata: {
        taskId: 'task_1',
        taskTitle: 'Design Authentication Flow',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        daysRemaining: 2,
      },
    },
    {
      type: 'COMMENT_MENTION',
      title: 'You were mentioned in a comment',
      message:
        'user_2 mentioned you in a comment on "Project Requirements Specification"',
      userId: 'user_1',
      projectId: 'proj_1',
      metadata: {
        commentId: 'comment_1',
        documentId: 'doc_1',
        documentTitle: 'Project Requirements Specification',
        mentionedBy: 'user_2',
        commentContent: 'Please review the security requirements section',
      },
    },
  ];

  // Create unread notifications in parallel
  await Promise.all(
    notifications.map(async (notification) => {
      await prisma.notification.create({
        data: {
          ...notification,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );

  // Create some read notifications
  const readNotifications = [
    {
      type: 'TASK_UPDATED',
      title: 'Task Updated',
      message: 'Task "Write Authentication Tests" has been updated',
      userId: 'user_4',
      projectId: 'proj_1',
      read: true,
      metadata: {
        taskId: 'task_3',
        taskTitle: 'Write Authentication Tests',
        updatedBy: 'user_1',
        changes: ['Added test cases', 'Updated acceptance criteria'],
      },
    },
    {
      type: 'DOCUMENT_PUBLISHED',
      title: 'Document Published',
      message: 'API Documentation has been published',
      userId: 'user_2',
      projectId: 'proj_1',
      read: true,
      metadata: {
        documentId: 'doc_2',
        documentTitle: 'API Documentation',
        publishedBy: 'user_2',
        version: '1.0',
      },
    },
  ];

  // Create read notifications in parallel
  await Promise.all(
    readNotifications.map(async (notification) => {
      await prisma.notification.create({
        data: {
          ...notification,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
      });
    })
  );
}
