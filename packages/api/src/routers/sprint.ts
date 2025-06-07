import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { SprintStatus } from '@phase-platform/database';

export const sprintRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sprint.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.sprint.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sprint.create({
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
          status: z.nativeEnum(SprintStatus).optional(),
          goal: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          capacity: z.number().optional(),
          commitment: z.number().optional(),
          projectId: z.string().optional(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sprint.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sprint.delete({
        where: { id: input.id },
      });
    }),
});
