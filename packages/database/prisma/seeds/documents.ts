import { PrismaClient } from "@prisma/client";

export async function seedDocuments(prisma: PrismaClient) {
  const documents = [
    {
      title: "Project Requirements Specification",
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
      type: "REQUIREMENTS",
      status: "PUBLISHED",
      projectId: "proj_1",
      phaseId: "phase_1",
      createdById: "user_1",
      version: "1.0",
      tags: ["requirements", "specification", "documentation"],
      metadata: {
        category: "Project Documentation",
        audience: "Development Team",
        lastReviewed: new Date(),
      },
    },
    {
      title: "API Documentation",
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
      type: "API_DOCS",
      status: "PUBLISHED",
      projectId: "proj_1",
      phaseId: "phase_2",
      createdById: "user_2",
      version: "1.0",
      tags: ["api", "documentation", "technical"],
      metadata: {
        category: "Technical Documentation",
        audience: "Developers",
        lastUpdated: new Date(),
      },
    },
    {
      title: "Test Plan",
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
      type: "TEST_PLAN",
      status: "DRAFT",
      projectId: "proj_1",
      phaseId: "phase_3",
      createdById: "user_4",
      version: "0.1",
      tags: ["testing", "plan", "qa"],
      metadata: {
        category: "Testing Documentation",
        audience: "QA Team",
        lastModified: new Date(),
      },
    },
  ];

  for (const doc of documents) {
    const createdDoc = await prisma.document.create({
      data: {
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: doc.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Create attachments for documents
    if (doc.type === "REQUIREMENTS") {
      await prisma.attachment.create({
        data: {
          name: "Requirements Diagram",
          type: "image/png",
          url: "https://storage.example.com/diagrams/requirements.png",
          size: 1024 * 1024, // 1MB
          userId: doc.createdById,
          documentId: createdDoc.id,
          metadata: {
            format: "PNG",
            dimensions: "1920x1080",
          },
        },
      });
    }

    // Create comments for documents
    await prisma.comment.create({
      data: {
        content:
          "Great documentation! Please add more details about the security requirements.",
        userId: "user_2",
        projectId: doc.projectId,
        entityType: "DOCUMENT",
        entityId: createdDoc.id,
        metadata: {
          type: "feedback",
          priority: "medium",
        },
      },
    });
  }
}
