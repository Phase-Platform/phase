import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { BugStatus, Priority, Severity } from '@phase-platform/database';

export const bugRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bug.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bug.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bug.create({
        data: input,
      });
    }),

  update: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bug.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bug.delete({
        where: { id: input.id },
      });
    }),
});
