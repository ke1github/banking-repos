# TabList Version Switcher Setup Guide

This guide explains how to use the version switcher pattern in your application, allowing users to toggle between original and TabList implementations of your pages.

## Step 1: Create Both Versions of Your Page

First, you need both versions of your page:

1. Regular version in `page.tsx`
2. TabList version in `page_new.tsx`

## Step 2: Create an Index File

Create an `index.tsx` file in the same directory with the following structure:

```tsx
"use client";

import { Suspense } from "react";
import createVersionSwitcher from "@/components/createVersionSwitcher";
import OriginalPage from "./page";
import TabListPage from "./page_new";
import { LoadingState } from "@/components/ui/data-states";

// Create a version switcher component for your page
const PageVersionSwitcher = createVersionSwitcher(OriginalPage, TabListPage);

export default function Page() {
  return (
    <Suspense fallback={<LoadingState height="h-96" />}>
      <PageVersionSwitcher />
    </Suspense>
  );
}
```

## Step 3: Update the Showcase Page

Add your new page to the implementations array in `app/banking/tablist-showcase/page.tsx`:

```tsx
const implementations = [
  // ... existing implementations
  {
    title: "Your New Page",
    description: "Description of your page with TabList",
    path: "/path/to/your/page",
    icon: <YourIcon className="h-6 w-6 text-blue-500" />,
  },
];
```

## Step 4: Update Documentation

Add your page to the list in `docs/TABLIST_USAGE.md`.

## How It Works

The version switcher uses URL parameters to toggle between versions:

- Regular version: `/your/page`
- TabList version: `/your/page?version=tablist`

Users can switch between versions using the toggle button at the top of the page.

## Navigation Helper

You can use the `useVersionNavigation` hook to programmatically navigate between versions:

```tsx
import useVersionNavigation from "@/lib/hooks/useVersionNavigation";

export function YourComponent() {
  const { navigateToTabListVersion, navigateToOriginalVersion } =
    useVersionNavigation();

  return (
    <button onClick={() => navigateToTabListVersion("/your/page")}>
      View TabList Version
    </button>
  );
}
```
