import { PrismaClient, TeamRole } from "@prisma/client";

export async function seedTeams(prisma: PrismaClient) {
  const teams = [
    {
      id: "team_1",
      name: "Frontend Team",
      description: "Responsible for user interface development",
      projectId: "proj_1",
      organizationId: "org_1",
      leadId: "user_1",
      status: "ACTIVE",
      metadata: {
        focus: "User Interface",
        technologies: ["React", "TypeScript", "Next.js"],
        meetingSchedule: {
          daily: "10:00 AM UTC",
          weekly: "Monday 2:00 PM UTC",
        },
      },
      members: ["user_1", "user_2", "user_5"],
    },
    {
      id: "team_2",
      name: "Backend Team",
      description: "Responsible for server-side development",
      projectId: "proj_1",
      organizationId: "org_1",
      leadId: "user_2",
      status: "ACTIVE",
      metadata: {
        focus: "Server-side Development",
        technologies: ["Node.js", "Python", "PostgreSQL"],
        meetingSchedule: {
          daily: "11:00 AM UTC",
          weekly: "Tuesday 2:00 PM UTC",
        },
      },
      members: ["user_2", "user_3"],
    },
    {
      id: "team_3",
      name: "QA Team",
      description: "Responsible for quality assurance and testing",
      projectId: "proj_1",
      organizationId: "org_1",
      leadId: "user_3",
      status: "ACTIVE",
      metadata: {
        focus: "Quality Assurance",
        technologies: ["Jest", "Cypress", "Selenium"],
        meetingSchedule: {
          daily: "12:00 PM UTC",
          weekly: "Wednesday 2:00 PM UTC",
        },
      },
      members: ["user_3"],
    },
  ];

  for (const team of teams) {
    const { members, ...teamData } = team;

    await prisma.team.create({
      data: {
        ...teamData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create team memberships
    for (const memberId of members) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: memberId,
          role: memberId === team.leadId ? TeamRole.LEADER : TeamRole.MEMBER,
          joinedAt: new Date(),
        },
      });
    }

    // Create team channels
    const channels = [
      {
        name: "general",
        description: "General team discussions",
        type: "PUBLIC",
        metadata: {
          purpose: "Team-wide announcements and discussions",
          rules: ["Be respectful", "Stay on topic"],
        },
      },
      {
        name: "tech-discussion",
        description: "Technical discussions and problem-solving",
        type: "PUBLIC",
        metadata: {
          purpose: "Technical discussions and code reviews",
          rules: ["Share code snippets", "Document solutions"],
        },
      },
      {
        name: "planning",
        description: "Sprint planning and task management",
        type: "PRIVATE",
        metadata: {
          purpose: "Sprint planning and task assignments",
          rules: ["Update task status", "Report blockers"],
        },
      },
    ];

    for (const channel of channels) {
      await prisma.teamChannel.create({
        data: {
          ...channel,
          teamId: team.id,
          createdById: team.leadId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}
