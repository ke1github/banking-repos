# Investment Card CTA Buttons Enhancement

## Overview

Enhanced the PortfolioCard (InvestmentCard) component with relevant Call-to-Action (CTA) buttons similar to the BalanceCard structure, providing users with quick access to key investment actions.

## Changes Made

### 1. Enhanced PortfolioCard Component

**File**: `components/cards/PortfolioCard.tsx`

#### New CTA Actions Added:

- **Buy Stocks**: Direct link to stocks section for equity investments
- **Mutual Funds**: Access to SIP and lumpsum investments
- **Screener**: Find and analyze investment opportunities

#### Mobile CTA Buttons

- **Layout**: Grid of 3 buttons at the bottom (similar to BalanceCard)
- **Style**: Blue gradient footer with icon + label layout
- **Icons**: Using investment-specific icons with proper styling
- **Actions**:
  - Buy Stocks → `/investment/stocks`
  - Mutual Funds → `/investment/mutual-funds`
  - Screener → `/investment/screener`

#### Desktop CTA Footer

- **Layout**: Horizontal footer bar similar to BalanceCard
- **Style**: Translucent footer with hover effects
- **Responsive**: Only visible on desktop (hidden on mobile)
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Quick Actions Panel (Desktop)

- **Enhanced Descriptions**: More descriptive text for each action
- **Updated Icons**: Investment-focused icons (Plus, ArrowRightLeft, Search)
- **Proper Routes**: Using centralized ROUTES constants

### 2. Updated Routes Integration

- **Import**: Added `ROUTES` from `@/constants/route`
- **Consistency**: All links now use centralized route constants
- **Navigation**: Proper linking to investment sections

### 3. Visual Design

#### Mobile Design:

- **Color Scheme**: Blue gradient matching investment theme
- **Icons**: White icons with proper brightness and invert filters
- **Typography**: Consistent 12px font size for labels
- **Spacing**: Proper padding and border divisions

#### Desktop Design:

- **Footer Bar**: Semi-transparent with backdrop blur
- **Hover Effects**: Smooth transitions on hover
- **Icon Containers**: Rounded containers with hover state changes
- **Border Styling**: Subtle borders using white/10 opacity

## User Experience Improvements

### Quick Access to Key Actions:

1. **Investment**: Direct access to stock purchases
2. **Diversification**: Easy access to mutual funds
3. **Research**: Quick link to investment screener

### Consistent UX:

- **Similar to BalanceCard**: Familiar interaction patterns
- **Mobile-First**: Optimized for mobile usage
- **Desktop Enhanced**: Additional features on larger screens

### Accessibility:

- **ARIA Labels**: Proper accessibility labeling
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Descriptive text for assistive technology

## Code Structure

### Component Props:

```typescript
interface PortfolioCardProps {
  totalValue?: number;
  ytdReturn?: number;
  monthlyReturn?: number;
  totalGain?: number;
  assets?: Asset[];
  variant?: "full" | "compact";
  riskScore?: string;
}
```

### CTA Actions Configuration:

```typescript
const ctaActions = [
  {
    icon: "/icons/deposit.svg",
    label: "Buy Stocks",
    href: ROUTES.STOCKS,
    description: "Invest in stocks",
  },
  // ... more actions
];
```

### Mobile vs Desktop Rendering:

- **Mobile**: Full-width card with bottom CTA bar
- **Desktop**: Two-panel layout with side actions + footer CTAs

## Integration with Existing Features

### Routes Used:

- `ROUTES.STOCKS` - Stock investment section
- `ROUTES.MUTUAL_FUNDS` - Mutual fund investments
- `ROUTES.INVESTMENT_SCREENER` - Investment screening tools
- `ROUTES.PORTFOLIO` - Portfolio management

### Icon Assets:

- `deposit.svg` - For investment/buy actions
- `money-send.svg` - For mutual fund investments
- `payment-transfer.svg` - For screener/analysis tools

## Build Status

✅ **Build Successful**: All changes compile without errors
✅ **TypeScript**: Full type safety maintained
✅ **Responsive**: Works across all device sizes
✅ **Accessible**: ARIA compliance maintained

## Usage Example

```tsx
<PortfolioCard
  totalValue={portfolioData.totalValue}
  ytdReturn={portfolioData.ytdReturn}
  monthlyReturn={portfolioData.monthlyReturn}
  totalGain={portfolioData.totalGain}
  assets={portfolioData.assets}
  riskScore="Moderate"
  variant="full"
/>
```

## Benefits

### For Users:

- **Faster Navigation**: Quick access to key investment actions
- **Better UX**: Consistent experience across banking and investment cards
- **Mobile Optimized**: Easy access to actions on mobile devices

### For Developers:

- **Reusable Pattern**: Consistent CTA structure across cards
- **Maintainable**: Centralized route management
- **Scalable**: Easy to add more CTA actions in the future

The PortfolioCard now provides a comprehensive and consistent CTA experience that matches the BalanceCard while being specifically tailored for investment actions! 🚀
