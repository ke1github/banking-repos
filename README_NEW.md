# SP Banking App

A modern banking application built with Next.js and Appwrite.

## Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Transaction history
- Fund transfers between accounts
- Responsive dashboard interface
- Error handling and data state management

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your Appwrite credentials (see below)
4. Run the development server: `npm run dev`

## Environment Setup

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
```

## Documentation

For detailed documentation, see:

- [Architecture](./docs/ARCHITECTURE.md) - System design and patterns
- [Components](./docs/COMPONENTS.md) - Reusable UI components
- [Authentication](./docs/AUTHENTICATION.md) - Auth system documentation

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License.
