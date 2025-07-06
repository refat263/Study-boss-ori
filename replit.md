# Study Boss - Arabic Educational Platform

## Overview

Study Boss is a fully functional Arabic educational web platform designed specifically for Egyptian university students. The platform helps students organize their entire academic semester from day one to final exams by offering study plans, daily summaries, quizzes, and productivity tools like Pomodoro timers. The platform features a dark blue and gold color scheme (#0a1128 and #FFD700) with RTL (right-to-left) Arabic language support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Authentication**: Firebase Authentication for user management
- **Language**: Arabic (RTL layout) with Cairo font family

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **API**: RESTful API with TypeScript
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **File Storage**: Firebase Storage for file uploads

### Monorepo Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── attached_assets/ # Static assets and documentation
```

## Key Components

### Authentication System
- Firebase Authentication for email/password login
- User registration with Egyptian-specific data (governorate, college, academic year)
- Automatic student code generation (STB-YYYY-XXX format)
- Role-based access control (student/admin)

### Database Schema
- **Users**: Student profiles with subscription plans (free, premium, VIP)
- **Summaries**: Weekly and daily study materials
- **Quizzes**: Daily and weekly assessments with JSON-based questions
- **Tasks**: Personal and admin-assigned tasks
- **Quiz Results**: Performance tracking and analytics

### UI Components
- Responsive design with mobile-first approach
- Arabic RTL layout support
- Custom animations (fadeIn, fadeInUp effects)
- Dark blue (#0a1128) and gold (#FFD700) color scheme
- Accessibility features with proper ARIA labels

### Study Management Features
- 16-week semester organization
- Daily summaries and quizzes for 6 days per week (Saturday-Thursday)
- Progress tracking with visual indicators
- Task management with completion states
- Pomodoro timer for productivity

## Data Flow

1. **User Registration**: 
   - Firebase Authentication → Backend user creation → Database storage
   - Automatic student code generation and plan assignment

2. **Dashboard Access**:
   - Firebase auth token → Backend verification → User data retrieval
   - Real-time progress tracking and task management

3. **Study Content**:
   - Admin uploads summaries/quizzes → Database storage → Student access
   - File downloads and quiz interactions tracked

4. **Progress Tracking**:
   - Task completion → Database updates → Progress visualization
   - Quiz results → Analytics and performance insights

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: TypeScript ORM for database operations
- **firebase**: Authentication, storage, and real-time features
- **@tanstack/react-query**: Server state management
- **@radix-ui**: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and developer experience
- **drizzle-kit**: Database migration and schema management
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Local PostgreSQL or Neon development database
- Firebase development project
- Environment variables for configuration

### Production Deployment
1. **Frontend**: Static build deployed to CDN/hosting service
2. **Backend**: Express.js server deployed to cloud platform
3. **Database**: Neon serverless PostgreSQL
4. **File Storage**: Firebase Storage for user uploads
5. **Environment**: Production Firebase project with proper security rules

### Build Process
- `npm run build`: Builds both frontend (Vite) and backend (esbuild)
- Frontend outputs to `dist/public`
- Backend bundles to `dist/index.js`
- Database migrations managed via `drizzle-kit`

## Changelog
- July 06, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.