# Remove Unnecessary Icons
# This script removes icons from the public/icons directory that are duplicated with Lucide React icons

$duplicateIcons = @(
    "activity.svg",
    "arrow-down.svg",
    "arrow-left.svg",
    "arrow-right.svg",
    "arrow-up.svg",
    "bank.svg",
    "bar-chart-2.svg",
    "briefcase.svg",
    "calculator.svg",
    "chart-line.svg",
    "chart.svg",
    "check-square.svg",
    "chevron-down.svg",
    "chevron-left.svg",
    "chevron-right.svg",
    "chevron-up.svg",
    "clock.svg",
    "code.svg",
    "credit-card.svg",
    "edit.svg",
    "file-text.svg",
    "filter-lines.svg",
    "home.svg",
    "menu.svg",
    "monitor.svg",
    "pie-chart.svg",
    "plus.svg",
    "search.svg",
    "settings.svg",
    "shield.svg",
    "shopping-bag.svg",
    "trending-up.svg",
    "user.svg"
)

# Create backup directory
$backupDir = "D:\SP_banking\banking_app\public\icons-backup"
if (-not (Test-Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory
}

foreach ($icon in $duplicateIcons) {
    $iconPath = "D:\SP_banking\banking_app\public\icons\$icon"
    if (Test-Path $iconPath) {
        # Backup the icon
        Copy-Item $iconPath $backupDir
        # Remove the icon
        Remove-Item $iconPath -Force
        Write-Output "Removed and backed up: $icon"
    } else {
        Write-Output "Icon not found: $icon"
    }
}

Write-Output "Cleanup complete. Backup created at $backupDir"
