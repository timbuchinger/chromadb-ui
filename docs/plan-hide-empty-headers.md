# Plan: Hide Table Headers When No Documents

## Current Behavior
- Table headers (ID, DOCUMENT, METADATA) are always visible
- Empty state message shows when no documents exist
- This creates visual noise when viewing empty collections

## Proposed Changes
1. Restructure the DocumentsList.vue component to:
   - Keep the "Add Document" button visible at all times
   - Only show the table structure (including headers) when documents exist
   - Maintain the empty state message when no documents exist

## Implementation Details
- Move the table HTML structure inside the v-else block where we check for documents
- Keep the document count and add button outside of this conditional
- This ensures headers only appear when there's actual data to display

## Benefits
- Cleaner UI when viewing empty collections
- Reduced visual noise
- Maintains all existing functionality