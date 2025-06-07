import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { Priority, ProjectStatus } from '@phase-platform/database';

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: input,
      });
    }),

  update: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: { id: input.id },
      });
    }),
});
