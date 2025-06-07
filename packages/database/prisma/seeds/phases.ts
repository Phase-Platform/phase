import { FeatureStatus, type PrismaClient } from '@prisma/client';

export async function seedPhases(prisma: PrismaClient) {
  const phases = [
    {
      id: 'phase_1',
      title: 'Planning',
      description: 'Initial project planning and requirements gathering',
      projectId: 'proj_1',
      type: 'REQUIREMENTS',
      order: 1,
      status: FeatureStatus.DONE,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      metadata: {
        deliverables: [
          'Project Charter',
          'Requirements Document',
          'Project Plan',
        ],
        dependencies: [],
        risks: [
          {
            description: 'Scope creep during requirements gathering',
            impact: 'HIGH',
            mitigation: 'Regular stakeholder reviews',
          },
        ],
      },
    },
    {
      id: 'phase_2',
      title: 'Design',
      description: 'System architecture and UI/UX design',
      projectId: 'proj_1',
      type: 'DESIGN',
      order: 2,
      status: FeatureStatus.IN_PROGRESS,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-28'),
      metadata: {
        deliverables: [
          'System Architecture Document',
          'UI/UX Design Mockups',
          'Database Schema',
        ],
        dependencies: ['phase_1'],
        risks: [
          {
            description: 'Design changes affecting timeline',
            impact: 'MEDIUM',
            mitigation: 'Early stakeholder feedback',
          },
        ],
      },
    },
    {
      id: 'phase_3',
      title: 'Development',
      description: 'Core feature development and implementation',
      projectId: 'proj_1',
      type: 'DEVELOPMENT',
      order: 3,
      status: FeatureStatus.BACKLOG,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      metadata: {
        deliverables: [
          'Frontend Implementation',
          'Backend Services',
          'API Integration',
        ],
        dependencies: ['phase_2'],
        risks: [
          {
            description: 'Technical challenges in implementation',
            impact: 'HIGH',
            mitigation: 'Regular code reviews and pair programming',
          },
        ],
      },
    },
    {
      id: 'phase_4',
      title: 'Testing',
      description: 'Quality assurance and testing',
      projectId: 'proj_1',
      type: 'TESTING',
      order: 4,
      status: FeatureStatus.BACKLOG,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-31'),
      metadata: {
        deliverables: ['Test Plans', 'Test Cases', 'Bug Reports'],
        dependencies: ['phase_3'],
        risks: [
          {
            description: 'Critical bugs requiring major changes',
            impact: 'HIGH',
            mitigation: 'Early testing and continuous integration',
          },
        ],
      },
    },
    {
      id: 'phase_5',
      title: 'Deployment',
      description: 'Production deployment and launch',
      projectId: 'proj_1',
      type: 'DEPLOYMENT',
      order: 5,
      status: FeatureStatus.BACKLOG,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
      metadata: {
        deliverables: [
          'Deployment Plan',
          'Production Environment',
          'Launch Checklist',
        ],
        dependencies: ['phase_4'],
        risks: [
          {
            description: 'Deployment issues affecting users',
            impact: 'CRITICAL',
            mitigation: 'Staged rollout and rollback plan',
          },
        ],
      },
    },
  ];

  // Create all phases in parallel
  await Promise.all(
    phases.map(async (phase) => {
      const createdPhase = await prisma.feature.create({
        data: {
          ...phase,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create phase checkpoints
      const checkpoints = [
        {
          title: 'Phase Kickoff',
          description: 'Initial phase setup and team alignment',
          dueDate: new Date(
            phase.startDate.getTime() + 2 * 24 * 60 * 60 * 1000
          ), // 2 days after start
          status: phase.status === FeatureStatus.DONE ? 'COMPLETED' : 'PENDING',
        },
        {
          title: 'Mid-phase Review',
          description: 'Progress review and adjustments',
          dueDate: new Date(
            phase.startDate.getTime() +
              (phase.endDate.getTime() - phase.startDate.getTime()) / 2
          ),
          status: 'PENDING',
        },
        {
          title: 'Phase Completion',
          description: 'Final review and handover',
          dueDate: new Date(phase.endDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before end
          status: 'PENDING',
        },
      ];

      // Create all checkpoints in parallel
      await Promise.all(
        checkpoints.map((checkpoint) =>
          prisma.comment.create({
            data: {
              content: JSON.stringify(checkpoint),
              userId: 'user_1',
              projectId: phase.projectId,
              entityId: createdPhase.id,
              entityType: 'FEATURE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );

      // Create phase metrics
      const getProgressValue = (status: FeatureStatus) => {
        if (status === FeatureStatus.DONE) return 100;
        if (status === FeatureStatus.IN_PROGRESS) return 50;
        return 0;
      };

      const metrics = [
        {
          name: 'Progress',
          value: getProgressValue(phase.status),
          target: 100,
          unit: '%',
          type: 'PERCENTAGE',
        },
        {
          name: 'Deliverables Completed',
          value:
            phase.status === FeatureStatus.DONE
              ? phase.metadata.deliverables.length
              : 0,
          target: phase.metadata.deliverables.length,
          unit: 'items',
          type: 'COUNT',
        },
      ];

      // Create all metrics in parallel
      await Promise.all(
        metrics.map((metric) =>
          prisma.comment.create({
            data: {
              content: JSON.stringify(metric),
              userId: 'user_1',
              projectId: phase.projectId,
              entityId: createdPhase.id,
              entityType: 'FEATURE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );
    })
  );
}
