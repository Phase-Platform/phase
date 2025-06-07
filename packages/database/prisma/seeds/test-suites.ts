import {
  Priority,
  type PrismaClient,
  TestCaseStatus,
  TestExecutionStatus,
  TestType,
} from '@prisma/client';

export async function seedTestSuites(prisma: PrismaClient) {
  const testSuites = [
    {
      id: 'suite_1',
      name: 'Authentication Test Suite',
      description: 'Test suite for user authentication functionality',
      projectId: 'proj_1',
      metadata: {
        type: 'FUNCTIONAL',
        priority: 'HIGH',
        environment: 'TEST',
        tags: ['authentication', 'security', 'user-management'],
      },
    },
    {
      id: 'suite_2',
      name: 'Product Catalog Test Suite',
      description: 'Test suite for product catalog functionality',
      projectId: 'proj_1',
      metadata: {
        type: 'FUNCTIONAL',
        priority: 'HIGH',
        environment: 'TEST',
        tags: ['catalog', 'products', 'search'],
      },
    },
    {
      id: 'suite_3',
      name: 'Shopping Cart Test Suite',
      description: 'Test suite for shopping cart functionality',
      projectId: 'proj_1',
      metadata: {
        type: 'FUNCTIONAL',
        priority: 'HIGH',
        environment: 'TEST',
        tags: ['cart', 'checkout', 'orders'],
      },
    },
    {
      id: 'suite_4',
      name: 'Payment Integration Test Suite',
      description: 'Test suite for payment processing functionality',
      projectId: 'proj_1',
      metadata: {
        type: 'INTEGRATION',
        priority: 'CRITICAL',
        environment: 'TEST',
        tags: ['payments', 'security', 'integration'],
      },
    },
    {
      id: 'suite_5',
      name: 'Performance Test Suite',
      description: 'Test suite for performance and load testing',
      projectId: 'proj_1',
      metadata: {
        type: 'PERFORMANCE',
        priority: 'HIGH',
        environment: 'STAGING',
        tags: ['performance', 'load', 'stress'],
      },
    },
  ];

  // Create all test suites in parallel
  await Promise.all(
    testSuites.map(async (suite) => {
      const createdSuite = await prisma.testSuite.create({
        data: {
          id: suite.id,
          name: suite.name,
          description: suite.description,
          projectId: suite.projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create test cases for each suite
      const testCases = [
        {
          title: 'Basic Functionality Test',
          description: 'Test basic functionality of the feature',
          type: TestType.FUNCTIONAL,
          priority: Priority.HIGH,
          status: TestCaseStatus.ACTIVE,
          expected: 'All basic functionality should work as expected',
          steps: ['Step 1', 'Step 2', 'Step 3'],
        },
        {
          title: 'Edge Cases Test',
          description: 'Test edge cases and boundary conditions',
          type: TestType.FUNCTIONAL,
          priority: Priority.HIGH,
          status: TestCaseStatus.ACTIVE,
          expected: 'System should handle all edge cases correctly',
          steps: ['Step 1', 'Step 2', 'Step 3'],
        },
        {
          title: 'Error Handling Test',
          description: 'Test error handling and recovery',
          type: TestType.FUNCTIONAL,
          priority: Priority.HIGH,
          status: TestCaseStatus.ACTIVE,
          expected:
            'System should handle errors gracefully with appropriate messages',
          steps: ['Step 1', 'Step 2', 'Step 3'],
        },
      ];

      // Create all test cases in parallel
      await Promise.all(
        testCases.map((testCase) =>
          prisma.testCase.create({
            data: {
              ...testCase,
              testSuiteId: createdSuite.id,
              projectId: createdSuite.projectId,
              createdById: 'user_3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );

      // Create test runs for each suite
      const testRuns = [
        {
          status: TestExecutionStatus.PASSED,
          startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
          executedBy: 'user_3',
          environment: suite.metadata.environment,
          notes: 'Initial test run completed',
          defects: [],
        },
        {
          status: TestExecutionStatus.NOT_EXECUTED,
          startedAt: new Date(),
          completedAt: null,
          executedBy: 'user_3',
          environment: suite.metadata.environment,
          notes: 'Regression test run in progress',
          defects: [],
        },
      ];

      // Create all test runs in parallel
      await Promise.all(
        testRuns.map((testRun) =>
          prisma.testExecution.create({
            data: {
              ...testRun,
              testCaseId: 'tc_1', // Using a known test case ID
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );
    })
  );
}
