# TabList Component Implementation

The TabList component is a reusable UI element that provides a consistent tab interface across the application.

## How to Use TabList Versions

To view the TabList versions of various pages, you can:

1. Navigate to `/banking/tablist-showcase` to see all available implementations
2. Use the URL parameter approach: add `?version=tablist` to any page URL that supports it

For example:

- `/banking/profile?version=tablist`
- `/banking/transactions?version=tablist`
- `/banking/cards?version=tablist`
- `/banking/expense-management?version=tablist`

## Implemented Pages

The TabList component has been implemented in the following sections:

- **Profile Page**: Personal info, security, notifications, and activity tabs
- **Transactions**: Transaction history with analytics, scheduled payments, and categories
- **Cards Management**: Credit and debit cards with physical cards, recent activity, and security tabs
- **Expense Management**: Comprehensive expense tracking with budgets, analytics, and planning

## TabList Features

- Multiple visual variants (default, pills, underline, boxed)
- Different sizes (sm, md, lg)
- Horizontal and vertical orientations
- Icon support for tab labels
- Full width capability for tabs that span the container
- Custom styling through className props

## Demo

A comprehensive demo of all TabList variants is available at `/banking/tabs-demo`.
