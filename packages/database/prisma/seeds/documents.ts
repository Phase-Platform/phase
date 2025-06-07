import { Prisma, type PrismaClient } from '@prisma/client';

interface DocumentData {
  title: string;
  content: string;
  type: string;
  status: string;
  projectId: string;
  phaseId: string;
  createdById: string;
  version: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

interface CreatedDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  projectId: string;
  phaseId: string;
  createdById: string;
  version: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export async function seedDocuments(prisma: PrismaClient) {
  const documents: DocumentData[] = [
    {
      title: 'Project Requirements Specification',
      content: `
# Project Requirements Specification

## Overview
This document outlines the requirements for the E-commerce Platform project.

## Functional Requirements
1. User Authentication
   - User registration
   - User login
   - Password reset
   - Email verification

2. Product Management
   - Product listing
   - Product search
   - Product categories
   - Product variants

3. Shopping Cart
   - Add/remove items
   - Update quantities
   - Save cart
   - Price calculations

## Non-Functional Requirements
1. Performance
   - Page load time < 2 seconds
   - API response time < 500ms

2. Security
   - HTTPS encryption
   - Password hashing
   - Rate limiting
   - Input validation

## Technical Requirements
1. Frontend
   - React.js
   - TypeScript
   - Material-UI

2. Backend
   - Node.js
   - Express
   - PostgreSQL
   - Redis

## Timeline
- Phase 1: Requirements & Design (2 weeks)
- Phase 2: Development (8 weeks)
- Phase 3: Testing (2 weeks)
- Phase 4: Deployment (1 week)
      `,
      type: 'REQUIREMENTS',
      status: 'PUBLISHED',
      projectId: 'proj_1',
      phaseId: 'phase_1',
      createdById: 'user_1',
      version: '1.0',
      tags: ['requirements', 'specification', 'documentation'],
      metadata: {
        category: 'Project Documentation',
        audience: 'Development Team',
        lastReviewed: new Date(),
      },
    },
    {
      title: 'API Documentation',
      content: `
# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

Request Body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### POST /api/auth/login
Login user.

Request Body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

Response:
\`\`\`json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`
      `,
      type: 'API_DOCS',
      status: 'PUBLISHED',
      projectId: 'proj_1',
      phaseId: 'phase_2',
      createdById: 'user_2',
      version: '1.0',
      tags: ['api', 'documentation', 'technical'],
      metadata: {
        category: 'Technical Documentation',
        audience: 'Developers',
        lastUpdated: new Date(),
      },
    },
    {
      title: 'Test Plan',
      content: `
# Test Plan

## Test Strategy
1. Unit Testing
   - Frontend components
   - Backend services
   - API endpoints

2. Integration Testing
   - API integration
   - Database integration
   - Third-party services

3. End-to-End Testing
   - User flows
   - Critical paths
   - Edge cases

## Test Environment
- Development
- Staging
- Production

## Test Schedule
- Unit Tests: Daily
- Integration Tests: Weekly
- E2E Tests: Before releases

## Test Tools
- Jest
- Cypress
- Postman
- JMeter
      `,
      type: 'TEST_PLAN',
      status: 'DRAFT',
      projectId: 'proj_1',
      phaseId: 'phase_3',
      createdById: 'user_4',
      version: '0.1',
      tags: ['testing', 'plan', 'qa'],
      metadata: {
        category: 'Testing Documentation',
        audience: 'QA Team',
        lastModified: new Date(),
      },
    },
  ];

  // Create all documents in parallel
  const createdDocs = await Promise.all(
    documents.map(
      (doc) =>
        prisma.$queryRaw<CreatedDocument[]>`
        INSERT INTO documents (
          id, title, content, type, status, version, tags, metadata,
          project_id, phase_id, created_by_id, created_at, updated_at, published_at
        ) VALUES (
          ${Prisma.sql`gen_random_uuid()`},
          ${doc.title},
          ${doc.content},
          ${doc.type},
          ${doc.status},
          ${doc.version},
          ${doc.tags},
          ${doc.metadata},
          ${doc.projectId},
          ${doc.phaseId},
          ${doc.createdById},
          ${new Date()},
          ${new Date()},
          ${doc.status === 'PUBLISHED' ? new Date() : null}
        )
        RETURNING *
      `
    )
  );

  // Flatten the array of arrays into a single array of documents
  const flatDocs = createdDocs.flat();

  // Create attachments and comments in parallel
  await Promise.all(
    flatDocs.flatMap((doc) => {
      const operations: Prisma.PrismaPromise<unknown>[] = [];

      // Add attachment for requirements document
      if (
        documents[documents.findIndex((d) => d.title === doc.title)].type ===
        'REQUIREMENTS'
      ) {
        operations.push(
          prisma.$queryRaw`
            INSERT INTO attachments (
              id, name, type, url, size, metadata,
              user_id, document_id, created_at, updated_at
            ) VALUES (
              ${Prisma.sql`gen_random_uuid()`},
              ${'Requirements Diagram'},
              ${'image/png'},
              ${'https://storage.example.com/diagrams/requirements.png'},
              ${1024 * 1024},
              ${{ format: 'PNG', dimensions: '1920x1080' }},
              ${doc.createdById},
              ${doc.id},
              ${new Date()},
              ${new Date()}
            )
          `
        );
      }

      // Add comment
      operations.push(
        prisma.$queryRaw`
          INSERT INTO comments (
            id, content, user_id, project_id,
            entity_type, entity_id, metadata,
            created_at, updated_at
          ) VALUES (
            ${Prisma.sql`gen_random_uuid()`},
            ${'Great documentation! Please add more details about the security requirements.'},
            ${'user_2'},
            ${doc.projectId},
            ${'DOCUMENT'},
            ${doc.id},
            ${{ type: 'feedback', priority: 'medium' }},
            ${new Date()},
            ${new Date()}
          )
        `
      );

      return operations;
    })
  );
}
