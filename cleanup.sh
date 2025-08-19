#!/bin/bash

# Script to clean up unnecessary example files and redundant documentation

# Create backup directory
mkdir -p .backup_examples

# Backup and remove example files
echo "Backing up and removing example files..."

# Avatar examples
if [ -d "app/avatar-examples" ]; then
  cp -r app/avatar-examples .backup_examples/
  rm -rf app/avatar-examples
  echo "✓ Removed app/avatar-examples"
fi

# Component examples
if [ -d "components/examples" ]; then
  cp -r components/examples .backup_examples/
  rm -rf components/examples
  echo "✓ Removed components/examples"
fi

# Backup redundant documentation
echo "Backing up redundant documentation..."

# Make backup of old docs
cp README.md .backup_examples/README.md.bak
cp DOCUMENTATION.md .backup_examples/DOCUMENTATION.md.bak
cp docs/IMPLEMENTATION_SUMMARY.md .backup_examples/IMPLEMENTATION_SUMMARY.md.bak
cp docs/IMPLEMENTATION_GUIDE.md .backup_examples/IMPLEMENTATION_GUIDE.md.bak
cp docs/DATA_RENDERING.md .backup_examples/DATA_RENDERING.md.bak

# Replace README with new version
cp README_NEW.md README.md
rm README_NEW.md
echo "✓ Updated README.md"

# Remove redundant documentation files
rm DOCUMENTATION.md
rm docs/IMPLEMENTATION_SUMMARY.md
rm docs/IMPLEMENTATION_GUIDE.md
rm docs/DATA_RENDERING.md
echo "✓ Removed redundant documentation files"

echo "Done! All unnecessary files have been backed up to .backup_examples and removed."
echo "The documentation has been consolidated to:"
echo "- README.md (Overview)"
echo "- docs/ARCHITECTURE.md"
echo "- docs/COMPONENTS.md"
echo "- docs/AUTHENTICATION.md"
