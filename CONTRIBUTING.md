# Contributing to CodemiZe 2.0

Thank you for your interest in contributing to CodemiZe 2.0! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Exercise empathy and kindness
- Give and receive constructive feedback
- Accept responsibility and apologize for mistakes
- Focus on what's best for the community

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB
- Git
- npm or yarn

### Setup

1. Fork the repository on GitHub
1. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/codemiZe.git
cd codemiZe
```

1. Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/Nipuna-Lakruwan/codemiZe.git
```

1. Install dependencies:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend/codemiZe
npm install
```

## Development Workflow

1. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bugfix-name
```

1. Make your changes and commit them with clear, descriptive messages:

```bash
git add .
git commit -m "Description of changes"
```

1. Keep your branch updated with upstream changes:

```bash
git fetch upstream
git rebase upstream/main
```

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

## Pull Request Process

1. Ensure your code meets the [Coding Standards](#coding-standards)
1. Update documentation as needed
1. Include tests for new features
1. Submit your pull request with a clear title and description:
   - What changes were made
   - Why the changes are needed
   - Any notes on implementation choices
   - Reference any relevant issues using keywords (Fixes #123, Closes #456)
1. Respond to feedback and make requested changes

## Coding Standards

### General Guidelines

- Follow consistent code style throughout the project
- Write self-documenting code with clear variable/function names
- Keep functions small and focused on a single responsibility
- Comment complex logic but avoid obvious comments

### Frontend Standards

- Follow React best practices and hooks patterns
- Use functional components and React hooks
- Organize CSS with a component-focused approach
- Follow accessibility best practices (ARIA attributes, semantic HTML)
- Use DaisyUI and Tailwind CSS utility classes

### Backend Standards

- Follow RESTful API design principles
- Properly validate input data
- Handle errors with appropriate status codes
- Document API endpoints
- Write efficient database queries
- Implement proper authentication and authorization

## Testing

- Write unit tests for new features
- Test your changes thoroughly before submitting a PR
- Ensure tests pass before submitting

## Documentation

- Update documentation for any code, features, or API changes
- Document code that isn't self-explanatory
- Keep README.md updated with new features or changes to setup instructions

## Community

- Join discussions on GitHub Issues
- Help answer questions from other contributors
- Provide feedback on pull requests
- Report bugs and suggest features

Thank you for contributing to CodemiZe 2.0!
