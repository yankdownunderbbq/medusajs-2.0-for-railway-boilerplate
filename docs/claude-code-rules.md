# Claude Code Development Rules

## Architecture & Decision Authority
- All architectural decisions must be approved by me first
- Explain reasoning for any architectural changes and wait for approval
- Always update docs/architecture.md when changes are made

## Documentation-First Approach  
- Reference docs/architecture.md and design/prototypes/ before building
- Ask for clarification rather than making assumptions
- Keep documentation current

## Design & UI Consistency
- Match design/prototypes/ styling exactly - no improvisation
- Follow established component patterns
- Ask before deviating from design system

## Monorepo Boundaries
- Never modify backend/ or storefront/ without permission
- These are working, deployed systems

## Database & Schema
- No database migrations without approval
- Discuss schema changes first - I handle Medusa side

## Development Process
- Build incrementally, get approval before next major component
- Complete one user flow at a time
- Focus on customer sales flow first, admin features second

## Tech Stack Boundaries
- Stick to Next.js 14, Tailwind, TypeScript
- Ask before adding major dependencies
- No build tool changes without discussion

## When in Doubt
- Ask rather than assume
- Better to discuss than redo work
- Feature is complete when it matches prototype AND integrates with Medusa

Last updated: [date]