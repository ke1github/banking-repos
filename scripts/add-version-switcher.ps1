# Add TabList Version Switcher Script
# This script helps to quickly add a version switcher to a new page

param(
    [Parameter(Mandatory=$true)]
    [string]$PagePath
)

# Check if the path exists
if (-not (Test-Path $PagePath)) {
    Write-Host "Error: The path $PagePath does not exist." -ForegroundColor Red
    exit 1
}

# Extract directory path
$directory = Split-Path -Parent $PagePath

# Check if page.tsx exists
if (-not (Test-Path "$directory\page.tsx")) {
    Write-Host "Error: $directory\page.tsx not found. You need an original page first." -ForegroundColor Red
    exit 1
}

# Check if page_new.tsx exists
if (-not (Test-Path "$directory\page_new.tsx")) {
    Write-Host "Error: $directory\page_new.tsx not found. You need a TabList version first." -ForegroundColor Red
    exit 1
}

# Generate the index.tsx content
$content = @"
"use client";

import { Suspense } from "react";
import createVersionSwitcher from "@/components/createVersionSwitcher";
import OriginalPage from "./page";
import TabListPage from "./page_new";
import { LoadingState } from "@/components/ui/data-states";

// Create a version switcher component for this page
const PageVersionSwitcher = createVersionSwitcher(
  OriginalPage,
  TabListPage
);

export default function Page() {
  return (
    <Suspense fallback={<LoadingState height="h-96" />}>
      <PageVersionSwitcher />
    </Suspense>
  );
}
"@

# Create the index.tsx file
$indexPath = "$directory\index.tsx"

# Check if index.tsx already exists
if (Test-Path $indexPath) {
    $confirm = Read-Host "File $indexPath already exists. Do you want to overwrite it? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Write the file
Set-Content -Path $indexPath -Value $content

# Output success message
Write-Host "`nSuccess! Version switcher created at: $indexPath" -ForegroundColor Green
Write-Host "`nAccess your page at:" -ForegroundColor Green
Write-Host "  - Original version: $($directory.Replace('\', '/').Replace('D:/SP_banking/banking_app', ''))" -ForegroundColor Cyan
Write-Host "  - TabList version: $($directory.Replace('\', '/').Replace('D:/SP_banking/banking_app', ''))?version=tablist" -ForegroundColor Cyan

Write-Host "`nDon't forget to add your page to the showcase in app/banking/tablist-showcase/page.tsx" -ForegroundColor Yellow
