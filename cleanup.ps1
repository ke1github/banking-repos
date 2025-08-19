# Script to clean up unnecessary example files and redundant documentation

# Create backup directory
$BackupDir = ".backup_examples"
if (-not (Test-Path $BackupDir)) {
    New-Item -Path $BackupDir -ItemType Directory
}

# Backup and remove example files
Write-Host "Backing up and removing example files..."

# Avatar examples
if (Test-Path "app/avatar-examples") {
    Copy-Item -Path "app/avatar-examples" -Destination "$BackupDir/" -Recurse
    Remove-Item -Path "app/avatar-examples" -Recurse -Force
    Write-Host "✓ Removed app/avatar-examples"
}

# Component examples
if (Test-Path "components/examples") {
    Copy-Item -Path "components/examples" -Destination "$BackupDir/" -Recurse
    Remove-Item -Path "components/examples" -Recurse -Force
    Write-Host "✓ Removed components/examples"
}

# Backup redundant documentation
Write-Host "Backing up redundant documentation..."

# Make backup of old docs
Copy-Item -Path "README.md" -Destination "$BackupDir/README.md.bak"
Copy-Item -Path "DOCUMENTATION.md" -Destination "$BackupDir/DOCUMENTATION.md.bak"
Copy-Item -Path "docs/IMPLEMENTATION_SUMMARY.md" -Destination "$BackupDir/IMPLEMENTATION_SUMMARY.md.bak"
Copy-Item -Path "docs/IMPLEMENTATION_GUIDE.md" -Destination "$BackupDir/IMPLEMENTATION_GUIDE.md.bak"
Copy-Item -Path "docs/DATA_RENDERING.md" -Destination "$BackupDir/DATA_RENDERING.md.bak"

# Replace README with new version
Copy-Item -Path "README_NEW.md" -Destination "README.md" -Force
Remove-Item -Path "README_NEW.md" -Force
Write-Host "✓ Updated README.md"

# Remove redundant documentation files
Remove-Item -Path "DOCUMENTATION.md" -Force
Remove-Item -Path "docs/IMPLEMENTATION_SUMMARY.md" -Force
Remove-Item -Path "docs/IMPLEMENTATION_GUIDE.md" -Force
Remove-Item -Path "docs/DATA_RENDERING.md" -Force
Write-Host "✓ Removed redundant documentation files"

Write-Host "Done! All unnecessary files have been backed up to $BackupDir and removed."
Write-Host "The documentation has been consolidated to:"
Write-Host "- README.md (Overview)"
Write-Host "- docs/ARCHITECTURE.md"
Write-Host "- docs/COMPONENTS.md"
Write-Host "- docs/AUTHENTICATION.md"
