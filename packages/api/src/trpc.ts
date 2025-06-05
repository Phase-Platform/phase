import { z } from "zod";

import {
  BugStatus,
  FeatureStatus,
  Priority,
  prisma,
  ProjectRole,
  ProjectStatus,
  Severity,
  SprintStatus,
  UserRole,
} from "@phase-platform/database";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

// User Router (already present)
const userRouter = t.router({
  getAll: t.procedure.query(() => prisma.user.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => prisma.user.findUnique({ where: { id: input.id } })),
  create: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
        isActive: z.boolean().optional(),
        title: z.string().optional(),
        department: z.string().optional(),
        preferences: z.any().optional(),
      }),
    )
    .mutation(({ input }) => prisma.user.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          email: z.string().email().optional(),
          name: z.string().optional(),
          role: z.nativeEnum(UserRole).optional(),
          isActive: z.boolean().optional(),
          title: z.string().optional(),
          department: z.string().optional(),
          preferences: z.any().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.user.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => prisma.user.delete({ where: { id: input.id } })),
});

// Organization Router
const organizationRouter = t.router({
  getAll: t.procedure.query(() => prisma.organization.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.organization.findUnique({ where: { id: input.id } }),
    ),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
        isActive: z.boolean().optional(),
        settings: z.any().optional(),
      }),
    )
    .mutation(({ input }) => prisma.organization.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          logo: z.string().optional(),
          website: z.string().optional(),
          isActive: z.boolean().optional(),
          settings: z.any().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.organization.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.organization.delete({ where: { id: input.id } }),
    ),
});

// Project Router
const projectRouter = t.router({
  getAll: t.procedure.query(() => prisma.project.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.project.findUnique({ where: { id: input.id } }),
    ),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        ownerId: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(ProjectStatus).optional(),
        priority: z.nativeEnum(Priority).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        budget: z.number().optional(),
        repository: z.string().optional(),
        settings: z.any().optional(),
        metadata: z.any().optional(),
        organizationId: z.string(),
      }),
    )
    .mutation(({ input }) => prisma.project.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          status: z.nativeEnum(ProjectStatus).optional(),
          priority: z.nativeEnum(Priority).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          budget: z.number().optional(),
          repository: z.string().optional(),
          settings: z.any().optional(),
          metadata: z.any().optional(),
          organizationId: z.string().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.project.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.project.delete({ where: { id: input.id } }),
    ),
});

// ProjectMember Router
const projectMemberRouter = t.router({
  getAll: t.procedure.query(() => prisma.projectMember.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.projectMember.findUnique({ where: { id: input.id } }),
    ),
  create: t.procedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(ProjectRole),
        permissions: z.any().optional(),
      }),
    )
    .mutation(({ input }) => prisma.projectMember.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          projectId: z.string().optional(),
          userId: z.string().optional(),
          role: z.nativeEnum(ProjectRole).optional(),
          permissions: z.any().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.projectMember.update({
        where: { id: input.id },
        data: input.data,
      }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.projectMember.delete({ where: { id: input.id } }),
    ),
});

// Feature Router
const featureRouter = t.router({
  getAll: t.procedure.query(() => prisma.feature.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.feature.findUnique({ where: { id: input.id } }),
    ),
  create: t.procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(FeatureStatus).optional(),
        priority: z.nativeEnum(Priority).optional(),
        storyPoints: z.number().optional(),
        businessValue: z.number().optional(),
        acceptanceCriteria: z.string().optional(),
        assignedUserId: z.string().optional(),
        projectId: z.string(),
        sprintId: z.string().optional(),
        parentFeatureId: z.string().optional(),
        labels: z.array(z.string()).optional(),
        tags: z.any().optional(),
        completedAt: z.date().optional(),
      }),
    )
    .mutation(({ input }) => prisma.feature.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.nativeEnum(FeatureStatus).optional(),
          priority: z.nativeEnum(Priority).optional(),
          storyPoints: z.number().optional(),
          businessValue: z.number().optional(),
          acceptanceCriteria: z.string().optional(),
          assignedUserId: z.string().optional(),
          projectId: z.string().optional(),
          sprintId: z.string().optional(),
          parentFeatureId: z.string().optional(),
          labels: z.array(z.string()).optional(),
          tags: z.any().optional(),
          completedAt: z.date().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.feature.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.feature.delete({ where: { id: input.id } }),
    ),
});

// Bug Router
const bugRouter = t.router({
  getAll: t.procedure.query(() => prisma.bug.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => prisma.bug.findUnique({ where: { id: input.id } })),
  create: t.procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(BugStatus).optional(),
        severity: z.nativeEnum(Severity).optional(),
        priority: z.nativeEnum(Priority).optional(),
        stepsToReproduce: z.string().optional(),
        expectedBehavior: z.string().optional(),
        actualBehavior: z.string().optional(),
        environment: z.string().optional(),
        assignedUserId: z.string().optional(),
        reportedUserId: z.string().optional(),
        projectId: z.string(),
        sprintId: z.string().optional(),
        featureId: z.string().optional(),
        resolution: z.string().optional(),
        labels: z.array(z.string()).optional(),
        tags: z.any().optional(),
        resolvedAt: z.date().optional(),
        closedAt: z.date().optional(),
      }),
    )
    .mutation(({ input }) => prisma.bug.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.nativeEnum(BugStatus).optional(),
          severity: z.nativeEnum(Severity).optional(),
          priority: z.nativeEnum(Priority).optional(),
          stepsToReproduce: z.string().optional(),
          expectedBehavior: z.string().optional(),
          actualBehavior: z.string().optional(),
          environment: z.string().optional(),
          assignedUserId: z.string().optional(),
          reportedUserId: z.string().optional(),
          sprintId: z.string().optional(),
          featureId: z.string().optional(),
          resolution: z.string().optional(),
          labels: z.array(z.string()).optional(),
          tags: z.any().optional(),
          resolvedAt: z.date().optional(),
          closedAt: z.date().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.bug.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => prisma.bug.delete({ where: { id: input.id } })),
});

// Sprint Router
const sprintRouter = t.router({
  getAll: t.procedure.query(() => prisma.sprint.findMany()),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.sprint.findUnique({ where: { id: input.id } }),
    ),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(SprintStatus).optional(),
        goal: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        capacity: z.number().optional(),
        commitment: z.number().optional(),
        projectId: z.string(),
      }),
    )
    .mutation(({ input }) => prisma.sprint.create({ data: input })),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          status: z.nativeEnum(SprintStatus).optional(),
          goal: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          capacity: z.number().optional(),
          commitment: z.number().optional(),
          projectId: z.string().optional(),
        }),
      }),
    )
    .mutation(({ input }) =>
      prisma.sprint.update({ where: { id: input.id }, data: input.data }),
    ),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => prisma.sprint.delete({ where: { id: input.id } })),
});

export const appRouter = t.router({
  user: userRouter,
  organization: organizationRouter,
  project: projectRouter,
  projectMember: projectMemberRouter,
  feature: featureRouter,
  bug: bugRouter,
  sprint: sprintRouter,
});

export type AppRouter = typeof appRouter;
