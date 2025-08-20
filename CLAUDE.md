# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MedusaJS 2.0 monorepo for Railway deployment consisting of:
- **Backend** (`/backend/`) - MedusaJS 2.0 e-commerce backend with admin dashboard
- **Storefront** (`/storefront/`) - Next.js 14 frontend application
- **Custom BBQ Business** - Yank Downunder BBQ with catering features

## Development Commands

### Backend Development
```bash
cd backend/
npm run ib          # Initialize backend (migrations + seed data)
npm run dev         # Start development server with admin dashboard
npm run build       # Build for production
npm run start       # Run production build
npm run seed        # Seed database with sample data
npm run email:dev   # Start email template development server
```

### Storefront Development
```bash
cd storefront/
npm run dev         # Start development server (waits for backend)
npm run build       # Build for production (waits for backend)
npm run start       # Start production server
npm run lint        # Run Next.js linting
npm run test-e2e    # Run Playwright end-to-end tests
```

## Architecture

### Backend Stack
- **MedusaJS 2.0** framework with TypeScript
- **PostgreSQL** database with MikroORM
- **Redis** for workflow engine and event bus
- **MinIO** for file storage (fallback to local storage)
- **MeiliSearch** for product search
- **Stripe** payment processing
- **Resend** email notifications with React Email templates

### Storefront Stack
- **Next.js 14** with React 18
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Playwright** for E2E testing
- **MeiliSearch** integration for product search

### Custom Modules
- **Email Notifications** (`backend/src/modules/email-notifications/`) - Resend integration with React Email templates
- **MinIO File Storage** (`backend/src/modules/minio-file/`) - Cloud file storage provider

### Key Configuration Files
- `backend/medusa-config.js` - Main Medusa configuration with conditional module loading
- `storefront/next.config.js` - Next.js configuration with image domains
- `backend/src/lib/constants.ts` - Environment variable definitions


## Database & Seeding

Use `npm run ib` in backend to initialize the database with migrations and required system data. The project includes custom seeding scripts for BBQ-specific data.

## Deployment Notes

Designed for Railway deployment with automatic service provisioning for PostgreSQL, Redis, MinIO, and MeiliSearch. Environment variables are conditionally loaded to support both local development and cloud deployment.