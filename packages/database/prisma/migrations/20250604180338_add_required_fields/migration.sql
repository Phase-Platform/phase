/*
  Warnings:

  - You are about to drop the column `action` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Made the column `projectId` on table `activity_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Made the column `projectId` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Made the column `organizationId` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdById` to the `releases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `test_cases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organizationId_fkey";

-- DropIndex
DROP INDEX "activity_logs_action_idx";

-- DropIndex
DROP INDEX "comments_authorId_idx";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "action",
DROP COLUMN "details",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'No description',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'SYSTEM',
ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authorId",
ADD COLUMN     "entityId" TEXT NOT NULL DEFAULT 'legacy',
ADD COLUMN     "entityType" TEXT NOT NULL DEFAULT 'LEGACY',
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "releases" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_cases" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");

-- CreateIndex
CREATE INDEX "releases_createdById_idx" ON "releases"("createdById");

-- CreateIndex
CREATE INDEX "test_cases_createdById_idx" ON "test_cases"("createdById");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
