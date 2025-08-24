# TabList Component

The `TabList` component is a flexible, reusable tab interface that supports various styles, orientations, and configurations.

## Features

- Multiple style variants: default, pills, underline, boxed
- Horizontal or vertical orientation
- Customizable sizes
- Support for icons in tab labels
- Full width option
- Custom content rendering
- Accessibility built-in via Radix UI

## Usage Examples

### Basic Usage

```tsx
import TabList from "@/components/ui/TabList";

const BasicTabs = () => {
  const tabs = [
    {
      value: "tab1",
      label: "Account Summary",
      content: <div>Account summary content here</div>,
    },
    {
      value: "tab2",
      label: "Transactions",
      content: <div>Transactions content here</div>,
    },
    {
      value: "tab3",
      label: "Statements",
      content: <div>Statements content here</div>,
    },
  ];

  return <TabList items={tabs} />;
};
```

### Pill Style Tabs

```tsx
import TabList from "@/components/ui/TabList";

const PillTabs = () => {
  const tabs = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <TabList
      items={tabs}
      variant="pills"
      showContent={false}
      onValueChange={(value) => {
        // Handle tab change, e.g., fetch data for the selected period
        console.log(`Selected period: ${value}`);
      }}
    />
  );
};
```

### Tabs with Icons

```tsx
import TabList from "@/components/ui/TabList";
import { Home, CreditCard, PieChart, Settings } from "lucide-react";

const IconTabs = () => {
  const tabs = [
    {
      value: "dashboard",
      label: "Dashboard",
      icon: <Home size={16} />,
      content: <div>Dashboard content</div>,
    },
    {
      value: "accounts",
      label: "Accounts",
      icon: <CreditCard size={16} />,
      content: <div>Accounts content</div>,
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: <PieChart size={16} />,
      content: <div>Analytics content</div>,
    },
    {
      value: "settings",
      label: "Settings",
      icon: <Settings size={16} />,
      content: <div>Settings content</div>,
    },
  ];

  return <TabList items={tabs} variant="boxed" fullWidth={true} />;
};
```

### Custom Content Rendering

```tsx
import TabList from "@/components/ui/TabList";

const CustomContentTabs = () => {
  const [activeData, setActiveData] = useState(null);

  const tabs = [
    { value: "deposits", label: "Deposits" },
    { value: "withdrawals", label: "Withdrawals" },
    { value: "transfers", label: "Transfers" },
  ];

  // Custom render function that can do data fetching or other logic
  const renderTabContent = (item) => {
    // You could fetch data based on the selected tab
    return (
      <div>
        <h3>Custom content for {item.label}</h3>
        {activeData && <DataTable data={activeData} />}
      </div>
    );
  };

  return (
    <TabList
      items={tabs}
      renderTabContent={renderTabContent}
      onValueChange={(value) => {
        // Fetch data when tab changes
        fetchDataForTab(value).then((data) => setActiveData(data));
      }}
    />
  );
};
```

### Vertical Tabs

```tsx
import TabList from "@/components/ui/TabList";

const VerticalTabs = () => {
  const tabs = [
    {
      value: "personal",
      label: "Personal Info",
      content: <PersonalInfoForm />,
    },
    { value: "address", label: "Address", content: <AddressForm /> },
    {
      value: "payment",
      label: "Payment Methods",
      content: <PaymentMethodsForm />,
    },
    {
      value: "notifications",
      label: "Notifications",
      content: <NotificationSettings />,
    },
  ];

  return (
    <TabList
      items={tabs}
      orientation="vertical"
      variant="underline"
      className="gap-8"
      tabsListClassName="w-1/4 min-w-[200px]"
      contentClassName="flex-1"
    />
  );
};
```

## Props

| Prop                   | Type                                             | Default         | Description                                    |
| ---------------------- | ------------------------------------------------ | --------------- | ---------------------------------------------- |
| `items`                | `TabItem[]`                                      | Required        | Array of tab items to display                  |
| `defaultValue`         | `string`                                         | First tab value | The default selected tab                       |
| `value`                | `string`                                         | -               | Controlled value for the selected tab          |
| `onValueChange`        | `(value: string) => void`                        | -               | Called when the selected tab changes           |
| `orientation`          | `"horizontal" \| "vertical"`                     | `"horizontal"`  | The orientation of the tabs                    |
| `variant`              | `"default" \| "pills" \| "underline" \| "boxed"` | `"default"`     | The visual style of the tabs                   |
| `size`                 | `"sm" \| "md" \| "lg"`                           | `"md"`          | The size of the tabs                           |
| `fullWidth`            | `boolean`                                        | `false`         | Whether the tabs should take up the full width |
| `className`            | `string`                                         | `""`            | Additional classes for the tabs container      |
| `tabsListClassName`    | `string`                                         | `""`            | Additional classes for the tabs list           |
| `tabsTriggerClassName` | `string`                                         | `""`            | Additional classes for all tab triggers        |
| `tabsContentClassName` | `string`                                         | `""`            | Additional classes for all tab content         |
| `contentClassName`     | `string`                                         | `""`            | Additional classes for the content container   |
| `showContent`          | `boolean`                                        | `true`          | Whether to show the tab content                |
| `renderTabContent`     | `(item: TabItem) => React.ReactNode`             | -               | Custom function to render tab content          |

## TabItem Interface

```typescript
interface TabItem {
  value: string; // Unique identifier for the tab
  label: string; // Display text for the tab
  content?: React.ReactNode; // Content to show when tab is selected
  icon?: React.ReactNode; // Optional icon to show in the tab
  disabled?: boolean; // Whether the tab is disabled
}
```
