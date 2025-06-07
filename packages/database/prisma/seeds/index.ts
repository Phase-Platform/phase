import { clearScreenDown } from 'readline';

import { seedAutomationRules } from './automation-rules';
import { seedCodeReviews } from './code-reviews';
import { seedCustomFields } from './custom-fields';
import { seedDeployments } from './deployments';
import { seedDocuments } from './documents';
import { seedEnvironments } from './environments';
import { seedFeatures } from './features';
import { seedIntegrations } from './integrations';
import { logger } from './logger';
import { seedMetrics } from './metrics';
import { seedNotifications } from './notifications';
import { seedOrganizations } from './organizations';
import { seedPhases } from './phases';
import { seedProjects } from './projects';
import { seedReleases } from './releases';
import { seedTasks } from './tasks';
import { seedTeams } from './teams';
import { seedTestCases } from './test-cases';
import { seedTestSuites } from './test-suites';
import { seedUsers } from './users';
import { seedWebhooks } from './webhooks';
import { seedWorkflowTemplates } from './workflow-templates';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  clearScreenDown(process.stdout);
  logger.info('Starting database seeding...');

  try {
    // Seed core entities first
    await seedUsers(prisma);
    await seedTeams(prisma);
    await seedOrganizations(prisma);
    await seedProjects(prisma);
    await seedPhases(prisma);
    await seedFeatures(prisma);
    await seedTasks(prisma);

    // Seed testing related entities
    await seedTestSuites(prisma);
    await seedTestCases(prisma);

    // Seed documentation and review entities
    await seedCodeReviews(prisma);
    await seedDocuments(prisma);

    // Seed notification and release entities
    await seedNotifications(prisma);
    await seedReleases(prisma);
    await seedEnvironments(prisma);

    // Seed metrics and analytics
    await seedMetrics(prisma);

    // Seed workflow and automation entities
    await seedWorkflowTemplates(prisma);
    await seedIntegrations(prisma);
    await seedWebhooks(prisma);
    await seedCustomFields(prisma);
    await seedAutomationRules(prisma);

    // Seed deployment entities
    await seedDeployments(prisma);

    logger.success('Database seeding completed successfully!');
  } catch (error) {
    logger.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});

export * from './automation-rules';
export * from './code-reviews';
export * from './custom-fields';
export * from './deployments';
export * from './documents';
export * from './environments';
export * from './features';
export * from './integrations';
export * from './metrics';
export * from './notifications';
export * from './organizations';
export * from './phases';
export * from './projects';
export * from './releases';
export * from './tasks';
export * from './teams';
export * from './test-cases';
export * from './test-suites';
export * from './users';
export * from './webhooks';
export * from './workflow-templates';
