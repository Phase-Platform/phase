# Contributing to Phase Platform

Thank you for your interest in contributing to Phase Platform! We welcome all kinds of contributions, including bug reports, feature requests, documentation improvements, and code changes.

---

## 🛠️ Local Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/<your-username>/phase-platform.git
   cd phase-platform
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```
5. **Set up the database**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed # optional
   ```
6. **Start the development server**
   ```bash
   pnpm dev
   ```

---

## 🧑‍💻 How to Contribute

- **Bug Reports & Feature Requests:**

  - Use [GitHub Issues](https://github.com/phase-platform/phase-platform/issues) to report bugs or request features.
  - Please provide as much detail as possible, including steps to reproduce, screenshots, and your environment.

- **Pull Requests:**
  1. Fork the repository and create your branch from `main`:
     ```bash
     git checkout -b feature/your-feature
     ```
  2. Make your changes, following the code style guidelines below.
  3. Add or update tests as appropriate.
  4. Run all checks before submitting:
     ```bash
     pnpm lint
     pnpm type-check
     pnpm test
     ```
  5. Commit your changes with a clear, descriptive message.
  6. Push to your fork and open a Pull Request (PR) against the `main` branch.
  7. Fill out the PR template and describe your changes.

---

## 📝 Code Style & Standards

- **TypeScript**: Use strict typing and avoid `any` where possible.
- **Linting**: Run `pnpm lint` and fix all issues before submitting.
- **Formatting**: Use Prettier (`pnpm format`) to auto-format code.
- **Commits**: Write clear, concise commit messages (e.g., `fix: correct typo in README`).
- **Tests**: Add or update tests for new features and bug fixes.
- **Documentation**: Update the README or docs for any user-facing changes.

---

## 🌳 Branching & Workflow

- Base your branch on `main`.
- Use descriptive branch names: `feature/`, `fix/`, `chore/`, etc.
- Keep PRs focused and small; large PRs are harder to review.
- Reference related issues in your PR description (e.g., `Closes #123`).

---

## 🔍 Code Review Process

- All PRs require at least one approval before merging.
- Address all review comments and suggestions.
- Be responsive to feedback and willing to iterate.

---

## 🛡️ Security

- If you discover a security vulnerability, please report it privately to [support@phaseplatform.com](mailto:support@phaseplatform.com).
- Do **not** open public issues for security vulnerabilities.

---

## 🙏 Thank You

Your contributions make Phase Platform better for everyone! If you have any questions, feel free to open an issue or join the discussions.
