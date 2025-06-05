# Phase Platform

<div align="center">
  <h1>🚀 Phase Platform</h1>
  <p><strong>Comprehensive Software Development Lifecycle Management System</strong></p>
  
  [![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

## ✨ Overview

Phase Platform is a modern, comprehensive Software Development Lifecycle (SDLC) management system designed to streamline your development workflow from planning to deployment. Built with cutting-edge technologies, it provides teams with the tools they need to manage projects, track progress, and deliver high-quality software efficiently.

## 🎯 Key Features

### 📋 Project Management

- **Multi-project support** with organizational hierarchy
- **Agile sprint planning** and tracking
- **Kanban boards** with drag-and-drop functionality
- **Resource allocation** and capacity planning
- **Milestone tracking** and reporting

### 🔧 Development Workflow

- **Feature management** with user stories
- **Bug tracking** and issue resolution
- **Code review** integration
- **Branch management** and Git integration
- **Automated deployment** pipelines

### 🧪 Quality Assurance

- **Test case management** and execution
- **Test automation** integration
- **Bug reporting** and tracking
- **Quality metrics** and reporting
- **Performance monitoring**

### 🚀 Release Management

- **Release planning** and scheduling
- **Environment management** (Dev, Staging, Prod)
- **Deployment tracking** and rollback
- **Change management** and approval workflows
- **Release notes** generation

### 👥 Team Collaboration

- **Real-time comments** and discussions
- **Activity feeds** and notifications
- **Role-based access control**
- **Team member management**
- **Integration with popular tools**

## 🏗️ Architecture

Phase Platform is built as a monorepo using modern web technologies:

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **React Query** - Server state management

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **NextAuth.js** - Authentication

### DevOps & Infrastructure

- **Docker** - Containerization
- **Turbo** - Monorepo build system
- **GitHub Actions** - CI/CD pipelines
- **AWS/Vercel** - Deployment platforms

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.17.0
- **pnpm** >= 8.6.0
- **PostgreSQL** >= 14
- **Redis** >= 6 (optional, for caching/sessions)
- **Docker** (for containerized development/production)

### 1. Clone the Repository

```bash
git clone https://github.com/phase-platform/phase-platform.git
cd phase-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

- Copy the example file and edit as needed:

```bash
cp .env.example .env
# Edit .env with your configuration
```

- See `.env.example` for all required variables (DB, Redis, Auth, etc).

### 4. Database Setup

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:migrate    # Run database migrations
pnpm db:seed       # (Optional) Seed the database
```

### 5. Start the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Using Docker (Alternative)

```bash
# Start all services with Docker Compose (recommended)
pnpm docker:start

# This will:
# - Check and create .env.local if needed
# - Verify Docker is running
# - Stop any existing containers
# - Start all development services
# - Show available service URLs

# Other Docker commands
pnpm docker:build            # Build Docker image
pnpm docker:run             # Start with Docker Compose
pnpm docker:dev             # Start development environment
pnpm docker:stop            # Stop all containers

# View logs
docker-compose logs -f
```

### Available Services (Docker)

When running with Docker, the following services are available:

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Mailhog**:
  - SMTP: localhost:1025
  - Web UI: localhost:8025
- **MinIO**:
  - API: localhost:9000
  - Console: localhost:9001
- **Adminer**: localhost:8080
- **Redis Commander**: localhost:8081

## 📁 Project Structure

```
phase-platform/
├── apps/
│   └── web/                    # Main Next.js application
├── packages/
│   ├── database/              # Prisma schema and utilities
│   ├── api/                   # API utilities and types
│   ├── ui/                    # Shared UI components
│   ├── config/               # Shared configuration
│   └── types/                # Shared TypeScript types
├── scripts/                   # Development and deployment scripts
├── docker/                   # Docker configuration files
└── docs/                     # Documentation
```

## 🔧 Scripts & Tooling

- **Development:**
  - `pnpm dev` — Start dev server
  - `pnpm build` — Build for production
  - `pnpm start` — Start production server
- **Code Quality:**
  - `pnpm lint` — Run ESLint
  - `pnpm type-check` — TypeScript check
  - `pnpm format` — Prettier formatting
  - `pnpm test` — Run tests
- **Database:**
  - `pnpm db:generate` — Generate Prisma client
  - `pnpm db:migrate` — Run migrations
  - `pnpm db:seed` — Seed database
  - `pnpm db:reset` — Reset database
  - `pnpm db:studio` — Prisma Studio
- **Docker:**
  - `pnpm docker:build`, `pnpm docker:run`, `pnpm docker:dev`, `pnpm docker:start`, `pnpm docker:stop`
- **UI Components:**
  - `pnpm shadcn <component>` — Add shadcn/ui components
- **Dependency Consistency:**
  - `pnpm check:versions` — Check for mismatched dependency versions
  - `pnpm fix:versions` — Fix mismatched dependency versions

---

## 📜 Root Scripts Explained

| Script                    | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                | Start the development server for all apps/packages         |
| `pnpm build`              | Build all apps and packages for production                 |
| `pnpm start`              | Start the production server                                |
| `pnpm lint`               | Run ESLint on all workspaces                               |
| `pnpm lint:fix`           | Run ESLint and auto-fix issues                             |
| `pnpm type-check`         | Run TypeScript type checks across the monorepo             |
| `pnpm format`             | Format codebase using Prettier                             |
| `pnpm test`               | Run all tests                                              |
| `pnpm test:watch`         | Run tests in watch mode                                    |
| `pnpm test:coverage`      | Generate test coverage report                              |
| `pnpm db:generate`        | Generate Prisma client                                     |
| `pnpm db:migrate`         | Run database migrations                                    |
| `pnpm db:migrate:deploy`  | Deploy database migrations                                 |
| `pnpm db:push`            | Push schema changes to the database                        |
| `pnpm db:studio`          | Open Prisma Studio                                         |
| `pnpm db:seed`            | Seed the database with sample data                         |
| `pnpm db:reset`           | Reset the database                                         |
| `pnpm docker:build`       | Build the Docker image                                     |
| `pnpm docker:run`         | Start all services with Docker Compose                     |
| `pnpm docker:dev`         | Start development environment with Docker                  |
| `pnpm docker:start`       | Start all Docker containers and services                   |
| `pnpm docker:stop`        | Stop all Docker containers and services                    |
| `pnpm clean`              | Clean build artifacts and caches                           |
| `pnpm setup`              | Run project setup scripts                                  |
| `pnpm reset:dev`          | Reset development environment                              |
| `pnpm backup:db`          | Backup the database                                        |
| `pnpm health-check`       | Run health check scripts                                   |
| `pnpm shadcn`             | Add shadcn/ui components to the UI package                 |
| `pnpm update:deps`        | Update all dependencies to their latest versions           |
| `pnpm update:interactive` | Interactively update dependencies                          |
| `pnpm update:check`       | Check for outdated dependencies                            |
| `pnpm check:versions`     | Check for mismatched dependency versions across workspaces |
| `pnpm fix:versions`       | Fix mismatched dependency versions across workspaces       |

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev                      # Start development server
pnpm build                    # Build for production
pnpm start                    # Start production server

# Code Quality
pnpm lint                     # Run ESLint
pnpm type-check              # Run TypeScript compiler
pnpm format                  # Format code with Prettier
pnpm test                    # Run tests

# Database
pnpm db:generate             # Generate Prisma client
pnpm db:push                 # Push schema changes to database
pnpm db:migrate              # Run database migrations
pnpm db:studio               # Open Prisma Studio
pnpm db:seed                 # Seed database with sample data
pnpm db:reset                # Reset database

# Docker
pnpm docker:build            # Build Docker image
pnpm docker:run              # Start with Docker Compose
pnpm docker:dev              # Start development environment

# UI Components
pnpm shadcn                  # Add shadcn-ui components (e.g., pnpm shadcn button)
```

### UI Components

Phase Platform uses [shadcn/ui](https://ui.shadcn.com/) for its component library. To add new components:

```bash
# Add a new component
pnpm shadcn <component-name>

# Examples
pnpm shadcn button          # Add button component
pnpm shadcn card           # Add card component
pnpm shadcn dialog         # Add dialog component
```

Components are added to `packages/ui/src/shadcn/` directory and can be imported from there.

### Database Management

Phase Platform uses Prisma as the ORM with PostgreSQL:

```bash
# Create and apply a new migration
pnpm db:migrate

# Reset the database (⚠️ This will delete all data)
pnpm db:reset

# Open Prisma Studio for database inspection
pnpm db:studio
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🔐 Authentication

Phase Platform supports multiple authentication providers:

- **Email/Password** - Traditional email authentication
- **GitHub OAuth** - Login with GitHub
- **Google OAuth** - Login with Google
- **SAML/SSO** - Enterprise single sign-on (coming soon)

Configure authentication providers in your `.env` file.

## 🔌 Integrations

### Currently Supported

- **GitHub** - Repository and issue integration
- **Slack** - Team notifications and updates
- **Email** - SMTP-based notifications

### Planned Integrations

- **JIRA** - Issue synchronization
- **Azure DevOps** - Repository integration
- **Microsoft Teams** - Team collaboration
- **Jenkins** - CI/CD pipeline integration

## 📊 Monitoring & Analytics

- **Application Monitoring** - Built-in health checks and metrics
- **Error Tracking** - Sentry integration for error monitoring
- **Performance Monitoring** - Real-time performance metrics
- **Usage Analytics** - User behavior and feature adoption

## 🛡️ Security

Phase Platform implements multiple security measures:

- **Authentication** - JWT-based session management
- **Authorization** - Role-based access control (RBAC)
- **Data Encryption** - Encryption at rest and in transit
- **Input Validation** - Comprehensive input sanitization
- **Audit Logging** - Complete activity audit trail
- **Rate Limiting** - API rate limiting and DDoS protection

## 🚀 Deployment

### Production Deployment

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Set up production environment**

   - Configure production database
   - Set up Redis for caching
   - Configure email service
   - Set up monitoring

3. **Deploy using Docker**
   ```bash
   docker-compose up -d
   ```

### Environment Variables

See `.env.example` for all required environment variables.

## 📈 Roadmap

### Phase 1: Core Features ✅

- [x] User authentication and authorization
- [x] Project and organization management
- [x] Basic feature and bug tracking
- [x] Sprint management
- [x] Test case management

### Phase 2: Advanced Features 🚧

- [ ] Advanced reporting and analytics
- [ ] API integrations (GitHub, JIRA)
- [ ] Real-time collaboration features
- [ ] Mobile responsive design
- [ ] Advanced notification system

### Phase 3: Enterprise Features 📋

- [ ] SAML/SSO authentication
- [ ] Advanced role management
- [ ] Custom fields and workflows
- [ ] White-label customization
- [ ] On-premise deployment options

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Commit your changes**: `git commit -m 'Add your feature'`
4. **Push to your fork**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Contributor Guidelines

- Follow the code style (ESLint, Prettier, TypeScript)
- Write clear commit messages
- Add tests for new features
- Document your code and update the README/docs as needed
- Run all checks before submitting (`pnpm lint`, `pnpm type-check`, `pnpm test`)

If you have questions, open an issue or start a discussion!

## 📝 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **Issues:** [GitHub Issues](https://github.com/phase-platform/phase-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/phase-platform/phase-platform/discussions)
- **Email:** support@phaseplatform.com

## 🏆 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://www.prisma.io/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)

---

<div align="center">
  <p>Made with ❤️ for developers, by developers</p>
</div>
