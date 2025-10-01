# Light API Example App

This is a Next.js + React demo application showcasing integration with the Light API from docs.light.dev. The site presents as a mock customer portal - it's an intentionally generic example company designed to demonstrate Light API integration patterns and capabilities.

Built with Next.js, React, TypeScript, and Tailwind CSS.

## Theme: Example Services Portal

**Design Decisions**:

- **Color Scheme**: Professional blue/gray palette with electric blue accents
  - Primary: Blue tones (#3b82f6, #2563eb, #1d4ed8)
  - Accent: Electric blue (#10b981) for highlights
  - Neutral: Gray tones for backgrounds and text
- **Target Features**:
  - Light API flow integration for user onboarding
  - Account token management
  - Service dashboard with energy insights
  - Professional customer portal interface
- **User Flow**: Customer portal demonstrating Light API integration workflows
- **Purpose**: Showcase Light API integration patterns for developers

## API Reference

The Light API schema documentation is available at: https://api.light.dev/v1/openapi.json

Key sandbox endpoints used in this demo:

- `/v1/account/sandbox/delete-enrollment` - Delete enrollment (sandbox only)
- `/v1/account/sandbox/seed-demo-data` - Seed demo data (sandbox only)

## Development Guidelines

When making changes to the codebase:

1. **Code Formatting**: Always run `npm run format` before committing changes to ensure consistent code formatting across the project.

2. **Build Verification**: Ensure `npm run build` passes without errors after making any changes. This includes:
   - TypeScript compilation checks
   - ESLint validation
   - Next.js build process

3. **Testing**: Before submitting changes, verify that all linting and type-checking passes successfully.
