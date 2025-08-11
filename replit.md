# Kirda Tournament Gaming Platform

## Overview
Kirda is a tournament gaming platform built as a full-stack web application that allows users to participate in gaming tournaments, manage their wallets, earn through referrals, and track their performance. The platform supports multiple games like Free Fire, BGMI, and COD Mobile.

## System Architecture
The application follows a modern full-stack architecture with clear separation of concerns:

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server
- **Tailwind CSS** with shadcn/ui component library for styling
- **TanStack Query** for state management and API caching
- **Wouter** for client-side routing
- **Mobile-first responsive design** with bottom navigation

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with comprehensive route handling
- **Database abstraction layer** through storage interface
- **Session-based authentication** with middleware
- **Error handling** and request logging middleware

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Neon Database** serverless PostgreSQL hosting
- **Schema-first approach** with shared type definitions

## Key Components

### User Management System
- Registration/login with username and password
- Recovery questions for account security
- Referral system with unique codes
- Multi-wallet system (deposit, withdrawal, referral)
- User statistics and performance tracking

### Tournament System
- Game-based tournament organization
- Entry fee management and prize pool distribution
- Tournament status tracking (upcoming, active, completed)
- Player entry management with capacity limits
- Tournament rules and map specifications

### Wallet & Transaction System
- Three-tier wallet system for different fund types
- Deposit and withdrawal functionality
- Transaction history and audit trail
- Referral commission tracking (7% direct, 2% team)
- Currency formatting for Indian Rupees

### Gaming Integration
- Support for multiple games (Free Fire, BGMI, COD Mobile)
- Game-specific icons and branding
- Tournament filtering by game type
- Game statistics and leaderboards

### Administrative Features
- Admin panel for tournament management
- User management and transaction oversight
- Help request system with admin responses
- Broadcast messaging system
- System analytics and reporting

## Data Flow

### Authentication Flow
1. User registers with username, password, and recovery details
2. System generates unique referral code
3. Optional referral validation during registration
4. Session creation and user context management
5. Protected route access based on authentication state

### Tournament Participation Flow
1. User browses available tournaments by game
2. Entry fee validation against wallet balance
3. Tournament capacity check before joining
4. Wallet deduction and entry confirmation
5. Tournament status updates and result tracking

### Referral Commission Flow
1. New user registers with referral code
2. System validates referrer existence
3. Commission calculation on referrer's deposits
4. Automatic wallet credit to referrer
5. Multi-level team commission tracking

## External Dependencies

### UI Components
- **Radix UI** primitives for accessible components
- **Lucide React** for consistent iconography
- **React Hook Form** with Zod validation
- **Embla Carousel** for content sliders

### Database & Backend
- **@neondatabase/serverless** for PostgreSQL connection
- **connect-pg-simple** for session storage
- **drizzle-kit** for database migrations
- **date-fns** for date manipulation

### Development Tools
- **ESBuild** for server-side bundling
- **PostCSS** with Autoprefixer
- **TypeScript** for type safety
- **Vite plugins** for development experience

## Deployment Strategy

### Development Environment
- **Replit** hosting with integrated development
- **Node.js 20** runtime environment
- **Hot reload** development server on port 5000
- **PostgreSQL 16** database instance

### Production Build
- **Vite build** for client-side optimization
- **ESBuild** for server bundling
- **Static asset serving** through Express
- **Environment variable configuration**

### Database Management
- **Drizzle migrations** for schema changes
- **Connection pooling** through Neon serverless
- **Automatic backup** and scaling

## Changelog
- June 15, 2025. Initial setup
- June 15, 2025. Implemented Cashfree payment gateway integration with secure API credentials for real money deposits
- August 11, 2025. Fixed all major issues: help request responses now display for users, referral code validation works properly, broadcast messages show in notification panel, and fully functional Earn section with real referral tracking
- August 11, 2025. Secured admin panel with proper authentication using username "govind" and password "govind@1234"
- August 11, 2025. Enhanced real-time polling for notifications and help request updates every 5 seconds

## Recent Changes (August 11, 2025)
✓ Fixed referral code validation in registration system
✓ Enhanced help request system with admin responses visible to users
✓ Fixed broadcast messaging to properly display admin messages
✓ Created fully functional Earn section with real referral tracking
✓ Added real-time notification polling system (5-second intervals)
✓ Secured admin panel authentication
✓ Fixed tournament datetime picker with proper validation

## User Preferences
Preferred communication style: Simple, everyday language.