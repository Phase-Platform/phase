import {
  PrismaClient,
  TestCaseStatus,
  Priority,
  TestType,
  TestExecutionStatus,
} from "@prisma/client";

export async function seedTestCases(prisma: PrismaClient) {
  const testCases = [
    {
      id: "tc_1",
      title: "User Registration Test",
      description:
        "Test user registration functionality with valid and invalid data",
      type: TestType.FUNCTIONAL,
      priority: Priority.HIGH,
      status: TestCaseStatus.ACTIVE,
      projectId: "proj_1",
      featureId: "feat_1",
      suiteId: "suite_1",
      createdById: "user_3",
      expected:
        "User should be successfully registered with valid data and receive appropriate errors with invalid data",
      metadata: {
        category: "Authentication",
        environment: "TEST",
        prerequisites: [
          "Application is running",
          "Database is accessible",
          "Email service is configured",
        ],
        testData: {
          validUser: {
            email: "test@example.com",
            password: "Test123!",
            name: "Test User",
          },
          invalidUsers: [
            {
              email: "invalid-email",
              password: "weak",
              name: "Invalid User",
            },
            {
              email: "test@example.com",
              password: "",
              name: "Empty Password",
            },
          ],
        },
      },
    },
    {
      id: "tc_2",
      title: "Product Search Test",
      description: "Test product search functionality with various filters",
      type: TestType.FUNCTIONAL,
      priority: Priority.HIGH,
      status: TestCaseStatus.ACTIVE,
      projectId: "proj_1",
      featureId: "feat_2",
      suiteId: "suite_2",
      createdById: "user_3",
      expected:
        "Search should return relevant products based on search terms and filters",
      metadata: {
        category: "Catalog",
        environment: "TEST",
        prerequisites: [
          "Products are added to the catalog",
          "Search index is built",
        ],
        testData: {
          searchTerms: ["laptop", "smartphone", "headphones"],
          filters: {
            priceRange: [0, 1000],
            categories: ["Electronics", "Accessories"],
            brands: ["Apple", "Samsung"],
          },
        },
      },
    },
    {
      id: "tc_3",
      title: "Shopping Cart Operations Test",
      description: "Test shopping cart operations (add, update, remove items)",
      type: TestType.FUNCTIONAL,
      priority: Priority.HIGH,
      status: TestCaseStatus.ACTIVE,
      projectId: "proj_1",
      featureId: "feat_3",
      suiteId: "suite_3",
      createdById: "user_3",
      expected:
        "Cart operations should correctly update item quantities and totals",
      metadata: {
        category: "Cart",
        environment: "TEST",
        prerequisites: ["User is logged in", "Products are available"],
        testData: {
          products: [
            {
              id: "prod_1",
              name: "Laptop",
              price: 999.99,
              quantity: 1,
            },
            {
              id: "prod_2",
              name: "Mouse",
              price: 29.99,
              quantity: 2,
            },
          ],
        },
      },
    },
    {
      id: "tc_4",
      title: "Payment Processing Test",
      description: "Test payment processing with different payment methods",
      type: TestType.INTEGRATION,
      priority: Priority.CRITICAL,
      status: TestCaseStatus.ACTIVE,
      projectId: "proj_1",
      featureId: "feat_4",
      suiteId: "suite_4",
      createdById: "user_3",
      expected:
        "Payments should be processed successfully with valid payment methods",
      metadata: {
        category: "Payments",
        environment: "TEST",
        prerequisites: [
          "Payment gateway is configured",
          "Test cards are available",
        ],
        testData: {
          paymentMethods: [
            {
              type: "CREDIT_CARD",
              number: "4111111111111111",
              expiry: "12/25",
              cvv: "123",
            },
            {
              type: "PAYPAL",
              email: "test@example.com",
            },
          ],
        },
      },
    },
    {
      id: "tc_5",
      title: "Load Test",
      description: "Test system performance under load",
      type: TestType.PERFORMANCE,
      priority: Priority.HIGH,
      status: TestCaseStatus.ACTIVE,
      projectId: "proj_1",
      featureId: null,
      suiteId: "suite_5",
      createdById: "user_3",
      expected:
        "System should handle concurrent users within acceptable response times",
      metadata: {
        category: "Performance",
        environment: "STAGING",
        prerequisites: [
          "Load testing tools are configured",
          "Test environment is ready",
        ],
        testData: {
          concurrentUsers: 1000,
          duration: "1 hour",
          scenarios: [
            "Product browsing",
            "Search operations",
            "Checkout process",
          ],
        },
      },
    },
  ];

  for (const testCase of testCases) {
    await prisma.testCase.create({
      data: {
        ...testCase,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create test steps based on test case type
    let steps: { stepNumber: number; action: string; expected: string }[] = [];
    switch (testCase.type) {
      case TestType.FUNCTIONAL:
        if (testCase.id === "tc_1") {
          // User Registration Test
          steps = [
            {
              stepNumber: 1,
              action: "Navigate to the registration page",
              expected:
                "Registration form should be displayed with all required fields",
            },
            {
              stepNumber: 2,
              action: "Enter valid user information (name, email, password)",
              expected:
                "Form should accept the input without validation errors",
            },
            {
              stepNumber: 3,
              action: "Submit the registration form",
              expected:
                "User should be registered successfully and redirected to dashboard",
            },
            {
              stepNumber: 4,
              action: "Verify email confirmation",
              expected:
                "Confirmation email should be sent to the registered email address",
            },
          ];
        } else if (testCase.id === "tc_2") {
          // Product Search Test
          steps = [
            {
              stepNumber: 1,
              action: "Navigate to the product search page",
              expected: "Search bar and filter options should be visible",
            },
            {
              stepNumber: 2,
              action: 'Enter search term "laptop"',
              expected:
                "Search results should display relevant laptop products",
            },
            {
              stepNumber: 3,
              action: "Apply price range filter (0-1000)",
              expected:
                "Results should be filtered to show only laptops within price range",
            },
            {
              stepNumber: 4,
              action: 'Apply category filter "Electronics"',
              expected:
                "Results should be further filtered to show only electronics",
            },
          ];
        } else if (testCase.id === "tc_3") {
          // Shopping Cart Test
          steps = [
            {
              stepNumber: 1,
              action: "Add a laptop to the cart",
              expected:
                "Cart should update with the laptop item and correct total",
            },
            {
              stepNumber: 2,
              action: "Add a mouse to the cart",
              expected: "Cart should update with both items and updated total",
            },
            {
              stepNumber: 3,
              action: "Update laptop quantity to 2",
              expected:
                "Cart should update with new quantity and recalculated total",
            },
            {
              stepNumber: 4,
              action: "Remove the mouse from cart",
              expected: "Cart should only contain laptops with correct total",
            },
          ];
        }
        break;

      case TestType.INTEGRATION:
        if (testCase.id === "tc_4") {
          // Payment Processing Test
          steps = [
            {
              stepNumber: 1,
              action: "Select credit card payment method",
              expected: "Credit card form should be displayed",
            },
            {
              stepNumber: 2,
              action: "Enter valid credit card details",
              expected:
                "Form should accept the input without validation errors",
            },
            {
              stepNumber: 3,
              action: "Submit payment",
              expected:
                "Payment should be processed and confirmation received from payment gateway",
            },
            {
              stepNumber: 4,
              action: "Verify order status update",
              expected:
                'Order status should be updated to "PAID" in the system',
            },
          ];
        }
        break;

      case TestType.PERFORMANCE:
        if (testCase.id === "tc_5") {
          // Load Test
          steps = [
            {
              stepNumber: 1,
              action: "Simulate 1000 concurrent users browsing products",
              expected:
                "Response time should be under 2 seconds for 95% of requests",
            },
            {
              stepNumber: 2,
              action:
                "Simulate 1000 concurrent users performing search operations",
              expected: "Search results should be returned within 3 seconds",
            },
            {
              stepNumber: 3,
              action: "Simulate 500 concurrent users in checkout process",
              expected: "Checkout process should complete within 5 seconds",
            },
            {
              stepNumber: 4,
              action: "Monitor system resources during load test",
              expected:
                "CPU usage should not exceed 80% and memory usage should be stable",
            },
          ];
        }
        break;
    }

    for (const step of steps) {
      await prisma.testStep.create({
        data: {
          ...step,
          testCaseId: testCase.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create test executions
    const executions = [
      {
        status: TestExecutionStatus.PASSED,
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour later
        executedBy: "user_3",
        environment: testCase.metadata.environment,
        notes: "All test steps passed successfully",
        results: {
          passed: 4,
          failed: 0,
          skipped: 0,
        },
      },
      {
        status: TestExecutionStatus.FAILED,
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour later
        executedBy: "user_3",
        environment: testCase.metadata.environment,
        notes: "Step 3 failed: Test scenario did not execute as expected",
        results: {
          passed: 2,
          failed: 1,
          skipped: 1,
        },
      },
    ];

    for (const execution of executions) {
      await prisma.testExecution.create({
        data: {
          ...execution,
          testCaseId: testCase.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}
