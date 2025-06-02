import { PrismaClient } from "@prisma/client";

export async function seedReleases(prisma: PrismaClient) {
  const releases = [
    {
      version: "1.0.0",
      name: "Initial Release",
      description: "First production release with core features",
      status: "PUBLISHED",
      projectId: "proj_1",
      createdById: "user_1",
      releaseDate: new Date("2024-03-01"),
      notes: `
# Release Notes v1.0.0

## New Features
- User authentication system
- Product catalog
- Shopping cart functionality
- Basic order management

## Improvements
- Performance optimizations
- Enhanced security measures
- Better error handling

## Bug Fixes
- Fixed login issues
- Resolved cart persistence problems
- Addressed payment processing bugs

## Technical Details
- Updated dependencies
- Improved API documentation
- Enhanced logging system
      `,
      metadata: {
        type: "major",
        breakingChanges: true,
        requiresMigration: true,
        databaseChanges: true,
      },
    },
    {
      version: "1.1.0",
      name: "Feature Update",
      description: "Release with new features and improvements",
      status: "DRAFT",
      projectId: "proj_1",
      createdById: "user_2",
      releaseDate: new Date("2024-04-01"),
      notes: `
# Release Notes v1.1.0

## New Features
- Advanced search functionality
- Product reviews and ratings
- Wishlist feature
- Social sharing

## Improvements
- Enhanced product filtering
- Better mobile responsiveness
- Improved checkout process
- Faster page loads

## Bug Fixes
- Fixed search results pagination
- Resolved image loading issues
- Addressed notification bugs

## Technical Details
- Updated frontend dependencies
- Optimized database queries
- Enhanced caching system
      `,
      metadata: {
        type: "minor",
        breakingChanges: false,
        requiresMigration: false,
        databaseChanges: true,
      },
    },
  ];

  for (const release of releases) {
    const createdRelease = await prisma.release.create({
      data: {
        ...release,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create deployments for each release
    const deployments = [
      {
        version: release.version,
        status: "COMPLETED",
        projectId: release.projectId,
        environmentId: "env_1",
        releaseId: createdRelease.id,
        startTime: new Date(release.releaseDate.getTime() - 3600000), // 1 hour before release
        endTime: new Date(release.releaseDate.getTime() + 1800000), // 30 minutes after release
        logs: `
[2024-03-01 09:00:00] Starting deployment
[2024-03-01 09:05:00] Running database migrations
[2024-03-01 09:10:00] Deploying backend services
[2024-03-01 09:15:00] Deploying frontend application
[2024-03-01 09:20:00] Running smoke tests
[2024-03-01 09:25:00] Deployment completed successfully
        `,
        metadata: {
          duration: "25 minutes",
          success: true,
          rollback: false,
          affectedServices: ["backend", "frontend", "database"],
        },
      },
    ];

    for (const deployment of deployments) {
      await prisma.deployment.create({
        data: deployment,
      });
    }
  }
}
