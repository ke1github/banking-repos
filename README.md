# SP Banking App

A modern banking application built with Next.js and Appwrite.

## Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Transaction history
- Fund transfers between accounts
- Responsive dashboard interface

## Getting Started

### Prerequisites

1. Create an Appwrite account and project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Set up Appwrite collections for users, bank accounts, and transactions
3. Configure your environment variables in `.env.local` file

### Environment Setup

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
```

### Installation

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication Components

This project includes a modular, multi-step authentication UI built with React Hook Form and Zod.

- Form fields: reusable `TextField`, `PasswordField`, and `CheckboxField` components with validation, icons, and accessibility states.
- Form scaffolding: `FormStep`, `StepIndicator`, and `FormNavigation` to power the multi-step sign-up flow.
- Hook: `useAuthForm` centralizes step logic, validation, and submission; integrates Zod schemas from `lib/validations.ts`.
- Main UI: `components/auth/AuthForm.tsx` renders sign-in and a 3-step sign-up (Personal, Address, Financial).

Validation

- Sign-in: email, password, remember-me.
- Sign-up: personal info, address, PAN/terms. PAN is normalized to uppercase and schema-validated.

Best practices in use

- Separation of concerns: presentational components vs. form logic vs. validation schemas.
- Accessibility: labeled inputs, focus styles, clear error states.
- Type safety: TypeScript throughout; Zod schemas generate types for form values.

Single README policy: all documentation is consolidated here to avoid drift. If you add new docs, integrate them into this file rather than creating additional READMEs.
