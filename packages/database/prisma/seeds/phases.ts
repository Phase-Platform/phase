import {
  PrismaClient,
  SDLCPhaseType,
  PhaseStatus,
  CheckpointStatus,
  MetricType,
} from "@prisma/client";

export async function seedPhases(prisma: PrismaClient) {
  const phases = [
    {
      id: "phase_1",
      name: "Planning",
      description: "Initial project planning and requirements gathering",
      projectId: "proj_1",
      type: SDLCPhaseType.REQUIREMENTS,
      order: 1,
      status: PhaseStatus.COMPLETED,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      metadata: {
        deliverables: [
          "Project Charter",
          "Requirements Document",
          "Project Plan",
        ],
        dependencies: [],
        risks: [
          {
            description: "Scope creep during requirements gathering",
            impact: "HIGH",
            mitigation: "Regular stakeholder reviews",
          },
        ],
      },
    },
    {
      id: "phase_2",
      name: "Design",
      description: "System architecture and UI/UX design",
      projectId: "proj_1",
      type: SDLCPhaseType.DESIGN,
      order: 2,
      status: PhaseStatus.IN_PROGRESS,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-28"),
      metadata: {
        deliverables: [
          "System Architecture Document",
          "UI/UX Design Mockups",
          "Database Schema",
        ],
        dependencies: ["phase_1"],
        risks: [
          {
            description: "Design changes affecting timeline",
            impact: "MEDIUM",
            mitigation: "Early stakeholder feedback",
          },
        ],
      },
    },
    {
      id: "phase_3",
      name: "Development",
      description: "Core feature development and implementation",
      projectId: "proj_1",
      type: SDLCPhaseType.DEVELOPMENT,
      order: 3,
      status: PhaseStatus.NOT_STARTED,
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-06-30"),
      metadata: {
        deliverables: [
          "Frontend Implementation",
          "Backend Services",
          "API Integration",
        ],
        dependencies: ["phase_2"],
        risks: [
          {
            description: "Technical challenges in implementation",
            impact: "HIGH",
            mitigation: "Regular code reviews and pair programming",
          },
        ],
      },
    },
    {
      id: "phase_4",
      name: "Testing",
      description: "Quality assurance and testing",
      projectId: "proj_1",
      type: SDLCPhaseType.TESTING,
      order: 4,
      status: PhaseStatus.NOT_STARTED,
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-08-31"),
      metadata: {
        deliverables: ["Test Plans", "Test Cases", "Bug Reports"],
        dependencies: ["phase_3"],
        risks: [
          {
            description: "Critical bugs requiring major changes",
            impact: "HIGH",
            mitigation: "Early testing and continuous integration",
          },
        ],
      },
    },
    {
      id: "phase_5",
      name: "Deployment",
      description: "Production deployment and launch",
      projectId: "proj_1",
      type: SDLCPhaseType.DEPLOYMENT,
      order: 5,
      status: PhaseStatus.NOT_STARTED,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-09-30"),
      metadata: {
        deliverables: [
          "Deployment Plan",
          "Production Environment",
          "Launch Checklist",
        ],
        dependencies: ["phase_4"],
        risks: [
          {
            description: "Deployment issues affecting users",
            impact: "CRITICAL",
            mitigation: "Staged rollout and rollback plan",
          },
        ],
      },
    },
  ];

  for (const phase of phases) {
    await prisma.phase.create({
      data: {
        ...phase,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create phase checkpoints
    const checkpoints = [
      {
        title: "Phase Kickoff",
        description: "Initial phase setup and team alignment",
        dueDate: new Date(phase.startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days after start
        status:
          phase.status === PhaseStatus.COMPLETED
            ? CheckpointStatus.COMPLETED
            : CheckpointStatus.PENDING,
      },
      {
        title: "Mid-phase Review",
        description: "Progress review and adjustments",
        dueDate: new Date(
          phase.startDate.getTime() +
            (phase.endDate.getTime() - phase.startDate.getTime()) / 2,
        ),
        status: CheckpointStatus.PENDING,
      },
      {
        title: "Phase Completion",
        description: "Final review and handover",
        dueDate: new Date(phase.endDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before end
        status: CheckpointStatus.PENDING,
      },
    ];

    for (const checkpoint of checkpoints) {
      await prisma.phaseCheckpoint.create({
        data: {
          ...checkpoint,
          phaseId: phase.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create phase metrics
    const metrics = [
      {
        name: "Progress",
        value:
          phase.status === PhaseStatus.COMPLETED
            ? 100
            : phase.status === PhaseStatus.IN_PROGRESS
              ? 50
              : 0,
        target: 100,
        unit: "%",
        type: MetricType.PERCENTAGE,
      },
      {
        name: "Deliverables Completed",
        value:
          phase.status === PhaseStatus.COMPLETED
            ? phase.metadata.deliverables.length
            : 0,
        target: phase.metadata.deliverables.length,
        unit: "items",
        type: MetricType.COUNT,
      },
    ];

    for (const metric of metrics) {
      await prisma.phaseMetric.create({
        data: {
          ...metric,
          phaseId: phase.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}
