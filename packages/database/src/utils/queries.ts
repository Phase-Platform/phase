import type { PrismaClient } from "@prisma/client";

export const queries = {
  // Add your common database queries here
  async findUserByEmail(prisma: PrismaClient, email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findOrganizationBySlug(prisma: PrismaClient, slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
    });
  },
};
