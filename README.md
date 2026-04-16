# GraphQL Mini Chat

A real-time chat application built with TypeScript, GraphQL Yoga, and `graphql-ws` for real-time subscriptions.

## Structure
- `/server`: GraphQL Yoga server with PubSub for subscriptions.
- `/client`: CLI-based chat client.

## Running the Project
1. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Start the server:
   ```bash
   cd server && npm run dev
   ```
3. Start the client(s):
   ```bash
   cd client && npm run dev
   ```
