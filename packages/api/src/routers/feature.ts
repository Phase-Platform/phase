import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { FeatureStatus, Priority } from '@phase-platform/database';

export const featureRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.feature.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.feature.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.feature.create({
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.feature.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.feature.delete({
        where: { id: input.id },
      });
    }),
});
