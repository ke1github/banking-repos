# Sidebar Component System

This document provides an overview of the refactored sidebar component system.

## Overview

The sidebar system has been refactored to eliminate code duplication and improve maintainability. The system now consists of:

1. **BaseSidebar**: A reusable, generic sidebar component that handles the common structure and behavior
2. **RightSidebar**: Banking-specific sidebar implementation
3. **InvestmentRightSidebar**: Investment-specific sidebar implementation

## Component Architecture

### BaseSidebar

The `BaseSidebar` component (`components/ui/sidebar/BaseSidebar.tsx`) provides:

- Common sidebar structure with consistent styling
- Profile section at the top
- Tab navigation with configurable tabs
- Content area for domain-specific content
- Optional bottom actions section

```tsx
interface BaseSidebarProps {
  user: BaseUserProps;
  title: string;
  tabs?: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
  bottomActions?: ReactNode;
}
```

### Domain-Specific Sidebars

Both `RightSidebar` (banking) and `InvestmentRightSidebar` components have been refactored to:

1. Use the `BaseSidebar` component for common structure
2. Focus only on domain-specific content and behavior
3. Maintain the same functionality and UI as before

## Usage

### Using BaseSidebar Directly

```tsx
<BaseSidebar
  user={user}
  title="Dashboard Title"
  tabs={[
    { id: "tab1", label: "Tab 1", icon: Icon1 },
    { id: "tab2", label: "Tab 2", icon: Icon2 },
  ]}
  activeTab="tab1"
  onTabChange={(tabId) => setActiveTab(tabId)}
  bottomActions={<div>Action buttons here</div>}
>
  <div>Your content here</div>
</BaseSidebar>
```

### Using Domain-Specific Sidebars

```tsx
// Banking sidebar
<RightSidebar user={userDisplayData} />

// Investment sidebar
<InvestmentRightSidebar user={userDisplayData} />
```

## Benefits of the Refactoring

1. **Reduced Code Duplication**: Common sidebar structure is now defined in one place
2. **Improved Maintainability**: Changes to sidebar structure can be made in the BaseSidebar component
3. **Consistent UI**: Ensures consistent styling and behavior across different sidebars
4. **Easier to Extend**: New sidebar types can be created by composing with BaseSidebar
5. **Focused Components**: Each component now has a more specific responsibility

## Future Improvements

Potential future improvements could include:

- Adding animation options for sidebar transitions
- Theme customization through props
- Responsive behavior configuration
- Additional layout options
