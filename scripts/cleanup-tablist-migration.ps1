# Tablist Migration Cleanup Script
# This script helps identify files that might be redundant after migrating to the new version switcher

$redundantFiles = @()

# Check for any remaining page_wrapper.tsx files
$wrapperFiles = Get-ChildItem -Path "app" -Recurse -Filter "*page_wrapper.tsx"
if ($wrapperFiles.Count -gt 0) {
    Write-Host "Found page_wrapper.tsx files that can be removed:" -ForegroundColor Yellow
    foreach ($file in $wrapperFiles) {
        Write-Host "  - $($file.FullName)" -ForegroundColor Cyan
        $redundantFiles += $file.FullName
    }
}

# Look for any references to the old _new pattern in .tsx files
$oldPatternFiles = Get-ChildItem -Path "app" -Recurse -Include "*.tsx","*.ts" | 
    Where-Object { 
        $_.FullName -notmatch "\[.*\]" -and # Skip files with square brackets in path
        (Get-Content $_.FullName -ErrorAction SilentlyContinue -Raw) -match "page_new" -and 
        $_.Name -notlike "page_new.tsx" 
    }

if ($oldPatternFiles.Count -gt 0) {
    Write-Host "`nFound files with references to the old 'page_new' pattern:" -ForegroundColor Yellow
    foreach ($file in $oldPatternFiles) {
        Write-Host "  - $($file.FullName)" -ForegroundColor Cyan
    }
}

# Output a summary
Write-Host "`nSummary:" -ForegroundColor Green
Write-Host "  - Found $($redundantFiles.Count) redundant files" -ForegroundColor White
Write-Host "  - Found $($oldPatternFiles.Count) files with references to the old pattern" -ForegroundColor White

# Provide a command to remove redundant files if any were found
if ($redundantFiles.Count -gt 0) {
    Write-Host "`nTo remove all redundant files, run:" -ForegroundColor Green
    $removeCommand = "Remove-Item -Path `"" + ($redundantFiles -join "`", `"") + "`" -Force"
    Write-Host $removeCommand -ForegroundColor Cyan
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
