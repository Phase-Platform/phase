import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { UserRole } from '@phase-platform/database';

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
        isActive: z.boolean().optional(),
        title: z.string().optional(),
        department: z.string().optional(),
        preferences: z.any().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: input,
      });
    }),

  update: privateProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
