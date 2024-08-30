# isla-task
Isla Technical Pre-Interview Test

This is a Node.js application designed to process structured plain-text messages containing patient information. It includes a backend server built with Express.js, unit and API tests, and a PM2 configuration for production deployment.

## Features

- Parses and extracts patient information from structured messages.
- Provides an API endpoint to process messages and retrieve patient data.
- Includes unit and API tests using Mocha, Chai, and Axios.
- Supports automatic restarts during development with `nodemon`.
- Configured for production deployment using PM2.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Development

To run the application in development mode with automatic restarts on file changes:

```bash
npm run dev
```

## Testing

The application includes both unit and API tests. To run all tests:

```bash
npm test
```

To run only unit tests:

```bash
npm run test:unit
```

To run only API tests:

```bash
npm run test:api
```

## Production

To deploy the application in a production environment using PM2:

1. Ensure PM2 is installed globally:

   ```bash
   npm install -g pm2
   ```

2. Start the application with PM2:

   ```bash
   pm2 start ecosystem.config.js --env production
   ```

3. Manage the application with PM2 commands:

   - List running applications: `pm2 list`
   - Stop the application: `pm2 stop patient-info-api`
   - Restart the application: `pm2 restart patient-info-api`
   - View logs: `pm2 logs patient-info-api`
   - Delete the application: `pm2 delete patient-info-api`

## Configuration

### Environment Variables

The application uses environment variables for configuration. You can set these variables in a `.env` file for development or directly on the server for production.

### PM2 Configuration

The `ecosystem.config.js` file contains the PM2 configuration for running the application in production. Adjust the settings as needed for your environment.

## Logging

Logs are stored in the `./logs` directory. The PM2 configuration specifies separate files for error and output logs.

