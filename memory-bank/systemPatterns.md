# System Patterns

## Architecture Overview

### Component Structure
- Vue.js Single File Components (.vue)
- Organized by feature/screen
- Modal components for overlays
- Shared components for reusability

### State Management
- Pinia stores for state management
  - auth.ts: Authentication state
  - chroma.ts: ChromaDB data and operations

### Routing
- Vue Router based navigation
- Protected routes requiring authentication

## Design Patterns

### Component Patterns
1. Screen Components
   - High-level view components
   - Handle layout and composition
   - Examples: CollectionsScreen, CollectionScreen, LoginScreen

2. Feature Components
   - Focused on specific functionality
   - Reusable across screens
   - Examples: DocumentsList, AddCollectionModal

3. UI Components
   - Pure presentation components
   - Theme-aware styling
   - Examples: ThemeToggle, NavBar

### State Management Patterns
1. Authentication Flow
   - Centralized auth state
   - Login/logout handling
   - Session management

2. Data Management
   - Collection state handling
   - Document management
   - API interaction patterns

### UI Patterns
1. Modal Pattern
   - Used for collection creation
   - Confirmation dialogs
   - Document viewing/editing

2. Notification Pattern
   - Success/Error/Warning/Info types
   - Auto-dismiss after 10 seconds
   - Manual dismiss option

3. Theme Pattern
   - Light/Dark mode support
   - Consistent color schemes
   - TailwindCSS utility classes

## Common Implementation Patterns

### Input Styling
```css
relative block w-full rounded-md border-0 py-1.5 px-3 
text-gray-900 dark:text-white 
dark:bg-gray-800 
ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
placeholder:text-gray-400 
focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 
sm:text-sm sm:leading-6
```

### Button Styling
```css
rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white 
hover:bg-purple-600 
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
disabled:opacity-50
```

### Collection Name Validation
- Lowercase letters
- Numbers
- Dashes
- Underscores
- No duplicates allowed
