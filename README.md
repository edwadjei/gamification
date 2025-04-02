# Gamification Backend System

A backend system for a gamification platform where users answer questions and earn scores based on correct answers.

## Overview

This project implements a gamification backend system that allows users to submit answers to questions, calculates scores when correct answers are provided, and displays a leaderboard of user scores. The system uses a simple username-based user management approach with no authentication required.

## Features

- Simple username-based user management (no authentication)
- Submit answers to gamification elements
- Create new elements and set correct answers
- Calculate scores asynchronously
- Display leaderboards with filtering and pagination
- Redis caching for performance
- Containerized with Docker for easy setup

## Tech Stack

- **Backend**: Node.js, Koa.js, TypeScript
- **Database**: MySQL
- **Caching**: Redis
- **Frontend**: React
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 16+ (for local development)
- npm or yarn

### Running with Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd gamification-backend
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

3. Access the application:
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3001

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd gamification-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=gamification
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_URL=redis://localhost:6379
   PORT=3000
   ```

4. Start a local MySQL and Redis instance:

   ```bash
   docker-compose up mysql redis
   ```

5. Run the server in development mode:

   ```bash
   npm run dev
   ```

6. For the frontend (in a separate terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Documentation

### User Management

#### Get or Create User

- **Endpoint**: `POST /api/v1/users/login`
- **Request Body**:
  ```json
  {
    "username": "exampleUser"
  }
  ```
- **Response**:
  ```json
  {
    "userId": "uuid",
    "username": "exampleuser",
    "displayName": "exampleUser"
  }
  ```

#### Get All Users

- **Endpoint**: `GET /api/v1/users`
- **Response**:
  ```json
  {
    "users": [
      {
        "userId": "uuid",
        "username": "user1",
        "displayName": "User 1"
      },
      {
        "userId": "uuid",
        "username": "user2",
        "displayName": "User 2"
      }
    ]
  }
  ```

### Elements

#### Create Element

- **Endpoint**: `POST /api/v1/elements`
- **Request Body**:
  ```json
  {
    "eventId": "uuid",
    "projectId": "uuid",
    "scores": 10
  }
  ```
- **Response**:
  ```json
  {
    "elementId": "uuid",
    "message": "Element created successfully."
  }
  ```

#### Set Correct Answer

- **Endpoint**: `PUT /api/v1/elements/:elementId/right-answer`
- **Request Body**:
  ```json
  {
    "rightAnswer": 5
  }
  ```
- **Response**:
  ```json
  {
    "message": "Correct answer updated and score calculation triggered."
  }
  ```

### User Answers

#### Submit Answer

- **Endpoint**: `POST /api/v1/user-answers`
- **Request Body**:
  ```json
  {
    "userId": "uuid",
    "elementId": "uuid",
    "userAnswer": 5
  }
  ```
- **Response**:
  ```json
  {
    "message": "Answer submitted successfully."
  }
  ```

### Leaderboard

#### Get Leaderboard

- **Endpoint**: `GET /api/v1/leaderboard`
- **Query Parameters**:
  - `projectId` (UUID, optional) - Filter by project
  - `eventId` (UUID, optional) - Filter by event
  - `limit` (Number, optional) - Number of results (default: 10)
  - `offset` (Number, optional) - Pagination offset (default: 0)
- **Response**:
