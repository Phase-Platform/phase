import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./users";
import { seedTeams } from "./teams";
import { seedProjects } from "./projects";
import { seedPhases } from "./phases";
import { seedFeatures } from "./features";
import { seedTasks } from "./tasks";
import { seedTestSuites } from "./test-suites";
import { seedTestCases } from "./test-cases";
import { seedCodeReviews } from "./code-reviews";
import { seedDocuments } from "./documents";
import { seedNotifications } from "./notifications";
import { seedReleases } from "./releases";
import { seedEnvironments } from "./environments";
import { seedMetrics } from "./metrics";
import { seedOrganizations } from "./organizations";
import { seedWorkflowTemplates } from "./workflow-templates";
import { seedIntegrations } from "./integrations";
import { seedWebhooks } from "./webhooks";
import { seedCustomFields } from "./custom-fields";
import { seedAutomationRules } from "./automation-rules";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

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

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export * from "./organizations";
export * from "./users";
export * from "./teams";
export * from "./projects";
export * from "./phases";
export * from "./features";
export * from "./tasks";
export * from "./test-suites";
export * from "./test-cases";
export * from "./code-reviews";
export * from "./documents";
export * from "./notifications";
export * from "./releases";
export * from "./environments";
export * from "./metrics";
export * from "./workflow-templates";
export * from "./integrations";
export * from "./webhooks";
export * from "./custom-fields";
export * from "./automation-rules";
export * from "./deployments";
