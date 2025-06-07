import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';

export const organizationRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.organization.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.organization.findUnique({
        where: { id: input.id },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
        isActive: z.boolean().optional(),
        settings: z.any().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organization.create({
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
          logo: z.string().optional(),
          website: z.string().optional(),
          isActive: z.boolean().optional(),
          settings: z.any().optional(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organization.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organization.delete({
        where: { id: input.id },
      });
    }),
});
