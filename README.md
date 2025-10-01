# Light API Demo

A React example application showcasing integration with the Light API from docs.light.dev. Features a mock professional customer portal interface as an example integration.

This app shows an example of how to easy it can be to integrate the Light API into your existing application. The app framework used here is Next.js + React. A minimal set of backend APIs are implemented with Next.js and the bulk of the integration is built using the [Light APIs](https://docs.light.dev) through the frontend as well as pre-built embedded flows.

View a deployed version of the app at https://example-app.light.dev

## Features

- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **API Integration**: Light API endpoints for energy management
- **User Flow**: Customer portal for energy service management

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/light-technology/example-app.git
cd example-app
npm install

# Copy environment variables
cp .env.example .env.local
```

Add your `API_SECRET` to `.env.local`.

### Development

```bash
npm run dev
```

Open http://localhost:3000
