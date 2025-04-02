# Gamification System Architecture

## Overview

This document outlines the architecture of the gamification system, explaining key components, data flows, and design decisions made during implementation.

## System Components

The gamification system consists of the following key components:

1. **Backend API (Node.js, Koa, TypeScript)**

   - RESTful API endpoints for user management, element creation, answer submission, and leaderboard retrieval
   - SOLID principles applied through separation of concerns and dependency inversion

2. **Database Layer (MySQL)**

   - Persistent storage for all gamification data
   - Normalized schema design for data integrity and efficient querying

3. **Caching Layer (Redis)**

   - Performance optimization through caching of frequently-accessed data
   - Reduced database load for read-heavy operations

4. **Asynchronous Processing (Job Queue)**

   - Decoupled score calculation from the main request flow
   - Improved system responsiveness and scalability

5. **Frontend Component (React)**
   - Simple user interface for leaderboard display
   - User authentication through username-based login

## Database Schema

The database consists of four main entities:

1. **Users**

   - `userId` (UUID): Primary key
   - `username` (String): Unique username
   - `displayName` (String): User's display name
   - Timestamps for creation and updates

2. **Elements**

   - `elementId` (UUID): Primary key
   - `eventId` (UUID): Associated event
   - `projectId` (UUID): Associated project
   - `rightAnswer` (Number, nullable): The correct answer
   - `scores` (Number): Points awarded for correct answer
   - Timestamps for creation and updates

3. **UserAnswers**

   - `id` (UUID): Primary key
   - `userId` (UUID): User who submitted the answer
   - `elementId` (UUID): Associated element
   - `userAnswer` (Number): User's submitted answer
   - Timestamps for creation and updates

4. **Scores**
   - `scoreId` (UUID): Primary key
   - `userId` (UUID): User who earned the score
   - `projectId` (UUID): Associated project
   - `eventId` (UUID): Associated event
   - `elementId` (UUID): Associated element
   - `totalScore` (Number): Total score earned
   - Timestamps for creation and updates

## Caching Strategy

The system implements a strategic caching approach to optimize performance:

1. **Leaderboard Caching**

   - Cached in Redis with composite keys based on filters (project, event, pagination)
   - TTL of 1 hour to balance freshness with performance
   - Invalidated when scores are updated

2. **User Score Caching**

   - Individual user scores cached for quick retrieval
   - Cache keys structured as `user:<userId>:scores`
   - Updated asynchronously when scores change

3. **Cache Invalidation**
   - Pattern-based invalidation for related cache entries
   - Handled automatically during score calculation

## Asynchronous Processing

Score calculation is handled asynchronously to improve system responsiveness:

1. **Score Calculation Flow**

   - Triggered when a correct answer is set for an element
   - Retrieves all user answers for the element
   - Compares each answer with the correct answer
   - Updates user scores accordingly
   - Invalidates affected cache entries

2. **Benefits**
   - Non-blocking API responses
   - Ability to handle high volumes of calculations
   - Improved fault tolerance through retries

## API Design

The API follows REST principles with clear endpoint design:

1. **User Management**

   - `POST /api/v1/users/login`: Get or create user by username
   - `GET /api/v1/users`: Get all users
   - `GET /api/v1/users/:userId`: Get specific user

2. **Element Management**

   - `POST /api/v1/elements`: Create new element
   - `PUT /api/v1/elements/:elementId/right-answer`: Set correct answer

3. **Answer Submission**

   - `POST /api/v1/user-answers`: Submit user answer

4. **Leaderboard**
   - `GET /api/v1/leaderboard`: Get leaderboard with filtering options

## Validation and Error Handling

A comprehensive validation strategy is implemented:

1. **Request Validation**

   - Schema-based validation for all incoming requests
   - Type checking and constraint validation

2. **Custom Error Types**

   - `ValidationError` for handling validation failures
   - Consistent error handling across the application

3. **Global Error Handler**
   - Centralized error processing in Koa middleware
   - Appropriate status codes and error messages

## Containerization

The application is fully containerized for consistent deployment:

1. **Docker Containers**

   - Backend API
   - React Frontend
   - MySQL Database
   - Redis Cache

2. **Docker Compose**
   - Orchestration of all services
   - Environment-specific configuration
   - Volume mapping for persistent data

## Performance Considerations

Several strategies improve system performance:

1. **Indexed Queries**

   - Strategic database indexes on frequently queried fields

2. **Connection Pooling**

   - Reuse of database connections for reduced overhead

3. **Pagination**

   - Leaderboard pagination to handle large datasets

4. **Caching**
   - Multi-level caching strategy as described above

## Security Considerations

Basic security measures are implemented:

1. **Input Validation**

   - Strict validation of all user inputs
   - Prevention of SQL injection through parameterized queries

2. **CORS Configuration**
   - Proper cross-origin resource sharing setup

## Future Improvements

Potential enhancements for future iterations:

1. **Authentication & Authorization**

   - Implement proper authentication with JWT
   - Role-based access control

2. **Real-time Updates**

   - WebSocket integration for live leaderboard updates

3. **Enhanced Monitoring**

   - Application performance monitoring
   - Centralized logging solution

4. **Horizontal Scaling**
   - Load balancing for API servers
   - Database sharding for high-volume installations
