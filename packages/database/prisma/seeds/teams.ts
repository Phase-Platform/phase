import { type PrismaClient, ProjectRole } from '@prisma/client';

export async function seedTeams(prisma: PrismaClient) {
  const teams = [
    {
      id: 'team_1',
      name: 'Frontend Team',
      description: 'Responsible for user interface development',
      projectId: 'proj_1',
      organizationId: 'org_1',
      leadId: 'user_1',
      status: 'ACTIVE',
      metadata: {
        focus: 'User Interface',
        technologies: ['React', 'TypeScript', 'Next.js'],
        meetingSchedule: {
          daily: '10:00 AM UTC',
          weekly: 'Monday 2:00 PM UTC',
        },
      },
      members: ['user_1', 'user_2', 'user_5'],
    },
    {
      id: 'team_2',
      name: 'Backend Team',
      description: 'Responsible for server-side development',
      projectId: 'proj_1',
      organizationId: 'org_1',
      leadId: 'user_2',
      status: 'ACTIVE',
      metadata: {
        focus: 'Server-side Development',
        technologies: ['Node.js', 'Python', 'PostgreSQL'],
        meetingSchedule: {
          daily: '11:00 AM UTC',
          weekly: 'Tuesday 2:00 PM UTC',
        },
      },
      members: ['user_2', 'user_3'],
    },
    {
      id: 'team_3',
      name: 'QA Team',
      description: 'Responsible for quality assurance and testing',
      projectId: 'proj_1',
      organizationId: 'org_1',
      leadId: 'user_3',
      status: 'ACTIVE',
      metadata: {
        focus: 'Quality Assurance',
        technologies: ['Jest', 'Cypress', 'Selenium'],
        meetingSchedule: {
          daily: '12:00 PM UTC',
          weekly: 'Wednesday 2:00 PM UTC',
        },
      },
      members: ['user_3'],
    },
  ];

  // Create all team memberships in parallel
  await Promise.all(
    teams.map(async (team) => {
      const { members, ...teamData } = team;

      // Create team memberships
      await Promise.all(
        members.map((memberId) =>
          prisma.projectMember.create({
            data: {
              projectId: team.projectId,
              userId: memberId,
              role:
                memberId === team.leadId
                  ? ProjectRole.MANAGER
                  : ProjectRole.DEVELOPER,
              permissions: {
                team: team.name,
                isLead: memberId === team.leadId,
                ...teamData.metadata,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );
    })
  );
}
