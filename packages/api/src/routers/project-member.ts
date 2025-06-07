import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { ProjectRole } from '@phase-platform/database';

export const projectMemberRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.projectMember.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.projectMember.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(ProjectRole),
        permissions: z.any().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.projectMember.create({
        data: input,
      });
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          projectId: z.string().optional(),
          userId: z.string().optional(),
          role: z.nativeEnum(ProjectRole).optional(),
          permissions: z.any().optional(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.projectMember.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.projectMember.delete({
        where: { id: input.id },
      });
    }),
});
