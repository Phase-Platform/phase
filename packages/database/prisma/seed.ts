import * as seeds from './seeds';

import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  try {
    // Run all seed functions in the correct order
    await seeds.seedOrganizations(prisma);
    await seeds.seedUsers(prisma);
    await seeds.seedTeams(prisma);
    await seeds.seedWorkflowTemplates(prisma);
    await seeds.seedProjects(prisma);
    await seeds.seedPhases(prisma);
    await seeds.seedFeatures(prisma);
    await seeds.seedTasks(prisma);
    await seeds.seedTestSuites(prisma);
    await seeds.seedTestCases(prisma);
    await seeds.seedCodeReviews(prisma);
    await seeds.seedDocuments(prisma);
    await seeds.seedNotifications(prisma);
    await seeds.seedReleases(prisma);
    await seeds.seedEnvironments(prisma);
    await seeds.seedDeployments(prisma);
    await seeds.seedIntegrations(prisma);
    await seeds.seedWebhooks(prisma);
    await seeds.seedMetrics(prisma);
    await seeds.seedCustomFields(prisma);
    await seeds.seedAutomationRules(prisma);

    // eslint-disable-next-line no-console
    console.log('Seeding completed successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
