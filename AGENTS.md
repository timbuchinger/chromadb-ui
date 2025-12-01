# ChromaDB Admin Interface - Agent Guide

This document provides comprehensive context for AI agents working on the ChromaDB Admin Interface project.

## Project Overview

ChromaDB Admin Interface is a modern web-based user interface for managing ChromaDB collections, documents, and
metadata. It provides an intuitive, accessible alternative to command-line and API-based interactions with ChromaDB.

### Purpose

The project addresses the need for a graphical interface that makes ChromaDB more accessible to:

- Non-technical users who prefer visual interfaces
- Users requiring quick data exploration capabilities
- Teams managing collections and documents efficiently

### Core Features

- **Collections Management**: Create, view, and delete collections with validation
- **Document Management**: Add, view, and delete documents with metadata support
- **Type-Safe Metadata**: Support for string, integer, float, and boolean metadata types with validation
- **Theming**: Full dark/light mode support
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first approach with consistent layouts

## Technical Stack

### Frontend Framework

- **Vue.js 3**: Modern reactive framework using Composition API
- **Vue Router**: Client-side routing with protected routes
- **Pinia**: State management for auth, data, loading, and notifications
- **TypeScript**: Full type safety throughout the application

### Build Tools

- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Strict type checking
- **PostCSS**: CSS processing pipeline

### Styling

- **TailwindCSS**: Utility-first CSS framework
- **Custom Theme System**: Comprehensive light/dark mode support
- **ChromaDB Color Palette**:
  - Primary (blue-600): Main CTAs and focus states
  - Secondary (orange-500): Hover states and interactive elements
  - Tertiary (yellow-500): Highlights and indicators
  - Error (red-500): Destructive actions and error states

### Testing

- **Cypress**: E2E testing with multiple authentication scenarios
- **Vitest**: Unit testing framework
- **Vue Test Utils**: Component testing utilities

### Infrastructure

- **Docker**: Multi-stage builds with nginx for production
- **GitHub Actions**: CI/CD with automated builds and releases
- **Docker Hub**: Automated image publishing

## Project Structure

```plaintext
chromadb-ui/
├── src/
│   ├── components/          # Vue components organized by feature
│   │   ├── screens/         # Top-level screen components (*Screen.vue)
│   │   ├── modals/          # Modal dialog components (*Modal.vue)
│   │   ├── lists/           # List view components (*List.vue)
│   │   └── ui/              # Reusable UI components
│   ├── composables/         # Vue composable functions
│   │   └── useKeyboardShortcuts.ts
│   │   └── useDocumentValidation.ts
│   ├── router/              # Vue Router configuration
│   │   └── index.ts
│   ├── stores/              # Pinia state stores
│   │   ├── auth.ts          # Authentication state
│   │   ├── chroma.ts        # ChromaDB data operations
│   │   ├── loading.ts       # Centralized loading states
│   │   └── notifications.ts # Toast notifications
│   ├── types/               # TypeScript type definitions
│   │   └── documentTypes.ts # Metadata type definitions
│   ├── utils/               # Utility functions
│   └── assets/              # Static assets
├── cypress/                 # E2E tests
│   ├── e2e/                 # Test specs
│   └── support/             # Test utilities
├── docker/                  # Docker configurations
├── .github/                 # GitHub Actions workflows
│   └── workflows/
│       ├── build.yml        # Build pipeline
│       └── release.yml      # Release pipeline
└── public/                  # Static public assets
```

## Architecture Patterns

### Component Hierarchy

1. **Screen Components** (`*Screen.vue`)
   - High-level view components
   - Handle layout composition
   - Orchestrate feature components
   - Examples: CollectionsScreen, CollectionScreen, LoginScreen

2. **Feature Components**
   - Specific functionality focus
   - Reusable across screens
   - Business logic integration
   - Examples: DocumentsList, AddCollectionModal, MetadataEditor

3. **UI Components**
   - Pure presentation components
   - Theme-aware styling
   - Highly reusable
   - Examples: ThemeToggle, NavBar, LoadingSpinner, LoadingSkeleton

### State Management Pattern

All state is managed through Pinia stores:

1. **Auth Store** (`auth.ts`)
   - Session management with localStorage persistence
   - Token storage and validation
   - Login/logout flows
   - Automatic session recovery on page refresh

2. **Chroma Store** (`chroma.ts`)
   - Collection CRUD operations
   - Document management
   - Pagination state
   - API interaction layer

3. **Loading Store** (`loading.ts`)
   - Centralized loading state by operation type
   - Support for concurrent operations
   - `withLoading` utility wrapper
   - Integration with UI components

4. **Notifications Store** (`notifications.ts`)
   - Success/Error/Warning/Info types
   - Auto-dismiss after 10 seconds
   - Manual dismiss capability
   - Theme-aware styling

### Modal Pattern

All modals follow consistent patterns:

- Focus trap implementation using custom directive
- ARIA roles and labels for accessibility
- Keyboard navigation (Tab, Shift+Tab, Escape)
- Focus restoration on close
- Screen reader announcements
- Confirmation dialogs for destructive actions

### Loading State Pattern

Ensures stable layouts during async operations:

1. **Loading Skeleton**
   - Matches final content dimensions
   - Preserves layout during loading
   - Theme-aware styling
   - Used for initial data loads

2. **Loading Spinner**
   - Active operation indicators
   - Size variants (sm, md, lg)
   - Used for button states
   - Used for in-progress operations

3. **Layout Stability**
   - Fixed height containers
   - Consistent dimensions between states
   - Fixed column widths in tables
   - Content placement preservation

### Metadata Management

Type-safe metadata system with comprehensive validation:

1. **Supported Types**
   - String: UTF-8 text values
   - Integer: Whole numbers (no decimals)
   - Float: Decimal numbers with scientific notation support
   - Boolean: Strict "true" or "false" (case-sensitive)

2. **Validation Rules**
   - Real-time type validation with immediate feedback
   - Type-specific error messages
   - Optional values support (empty allowed)
   - Duplicate key detection
   - Value trimming before validation

3. **Component Architecture**
   - `MetadataEditor/index.vue`: Main metadata management
   - `MetadataEditor/MetadataField.vue`: Individual field component
   - `useDocumentValidation`: Validation composable
   - `documentTypes.ts`: Centralized type utilities

### Accessibility Pattern

WCAG 2.1 compliant implementation:

1. **Focus Management**
   - Clear visible focus indicators
   - High contrast focus styles
   - Logical tab order
   - Focus trap for modals
   - Focus restoration

2. **Keyboard Navigation**
   - Full keyboard accessibility
   - Arrow key support where appropriate
   - Shortcut system with help dialog
   - Escape key handling
   - Skip navigation links

3. **Screen Reader Support**
   - Descriptive ARIA labels and roles
   - Live regions for dynamic updates
   - Status announcements
   - Clear content hierarchy
   - Hidden descriptive text where needed

4. **Keyboard Shortcuts**
   - `?`: Show shortcuts help
   - `h`: Go to collections list
   - `m`: Toggle theme
   - `Esc`: Close dialogs/cancel

## Development Guidelines

### Component Naming Conventions

- Screen components: `*Screen.vue` (e.g., `CollectionsScreen.vue`)
- Modal components: `*Modal.vue` (e.g., `AddCollectionModal.vue`)
- List components: `*List.vue` (e.g., `DocumentsList.vue`)
- Use PascalCase for component names

### Component Structure Template

```vue
<script setup lang="ts">
// Types
interface Props {
  // Define props
}

// Props
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'update'): void
}>()

// Composables
const { someFunction } = useSomeComposable()

// State
const localState = ref('')

// Computed properties
const computed = computed(() => {
  // Implementation
})

// Methods
const handleEvent = () => {
  // Implementation
}

// Lifecycle
onMounted(() => {
  // Implementation
})
</script>

<template>
  <div>
    <!-- Template content -->
  </div>
</template>
```

### Styling Guidelines

1. **TailwindCSS Classes**
   - Use utility classes for all styling
   - Follow mobile-first responsive design
   - Support both light and dark themes

2. **Theme-Aware Styling**

   ```css
   bg-surface-primary-light dark:bg-surface-primary-dark
   text-content-primary-light dark:text-content-primary-dark
   border-border-primary-light dark:border-border-primary-dark
   ```

3. **Common Patterns**
   - Input fields: `relative block w-full rounded-md border-0 py-1.5 px-3 focus:ring-2 focus:ring-accent-primary`
   - Primary buttons: `rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white hover:bg-accent-secondary`
   - Skeleton loading: `animate-pulse bg-surface-secondary-light dark:bg-surface-secondary-dark rounded`

### TypeScript Guidelines

- Use strict typing (avoid `any`)
- Define interfaces for complex types
- Use type inference where appropriate
- Document complex type definitions
- Use generics for reusable patterns

### Testing Guidelines

1. **E2E Tests (Cypress)**
   - Test user workflows end-to-end
   - Test different authentication modes
   - Test responsive behavior
   - Test accessibility features

2. **Unit Tests (Vitest)**
   - Test component logic
   - Test store actions and getters
   - Test utility functions
   - Test validation logic

3. **Test Organization**
   - Page Object Model for E2E tests
   - Fixture-based test data
   - Clean state between tests
   - Consistent selector patterns

## ChromaDB Integration

### API Patterns

1. **Collection Operations**
   - Collections identified by name (not ID)
   - Endpoint pattern (v2): `/api/v2/tenants/{tenant}/databases/{database}/collections` (list / create)
   - Collection-specific operations (v2):
      - Get documents: `/api/v2/tenants/{tenant}/databases/{database}/collections/{collection_id}/get` (POST)
      - Upsert documents: `/api/v2/tenants/{tenant}/databases/{database}/collections/{collection_id}/upsert` (POST)
      - Delete documents: `/api/v2/tenants/{tenant}/databases/{database}/collections/{collection_id}/delete` (POST)
      - Query / search endpoints follow the same tenant/database scoped path shape
   - Name validation: lowercase letters, numbers, dashes, underscores only
   - No duplicate names allowed

2. **Pagination**
   - 20 items per page for collection lists
   - 20 items per page for document lists
   - Offset-based pagination

3. **Document Operations**
   - Documents can have multiple metadata fields
   - Metadata values must match declared types
   - Document content stored separately from metadata

### Technical Constraints

1. **Collection Names**
   - Must be unique
   - Lowercase letters, numbers, dashes, underscores only
   - No spaces or special characters

2. **Notifications**
   - 10-second auto-dismiss
   - Manual dismiss option
   - Four types: Success, Info, Warning, Error

3. **Loading States**
   - Always show loading indicators for async operations
   - Preserve layout dimensions during loading
   - Use appropriate loading component (skeleton vs spinner)

## Common Development Tasks

### Adding a New Screen

1. Create component in `src/components/screens/NewScreen.vue`
2. Add route in `src/router/index.ts`
3. Add navigation link if needed
4. Implement loading states
5. Add accessibility features
6. Test keyboard navigation
7. Add E2E tests

### Adding a New Modal

1. Create component in `src/components/modals/NewModal.vue`
2. Implement focus trap
3. Add ARIA attributes
4. Handle Escape key
5. Add loading states
6. Test with keyboard only
7. Test with screen reader

### Adding a New Store Action

1. Define action in appropriate store
2. Add TypeScript types
3. Implement error handling
4. Use loading store wrapper
5. Trigger notifications
6. Write unit tests

### Modifying Styles

1. Use existing Tailwind classes
2. Ensure theme compatibility (test both light and dark)
3. Maintain responsive behavior
4. Verify accessibility (color contrast, focus indicators)
5. Test on multiple screen sizes

## Build and Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking
npm run lint

# Run unit tests
npm run test:unit

# Run E2E tests (requires Docker)
npm run test:e2e:dev
```

### Docker Development

```bash
# Build image
docker build -t chromadb-ui .

# Run container
docker run -p 8080:80 chromadb-ui
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### CI/CD Pipeline

1. **Build Pipeline** (on every commit)
   - TypeScript type checking
   - Docker image build
   - Artifact caching
   - Build status notifications

2. **Release Pipeline** (manual trigger)
   - Semantic versioning
   - Docker Hub publishing
   - GitHub release creation
   - Tag automation

## Current Status

### Completed Features

- ✅ Core infrastructure (Vue 3, Vite, TypeScript, Tailwind)
- ✅ Authentication with session persistence
- ✅ Collections management (CRUD operations)
- ✅ Document management with metadata
- ✅ Type-safe metadata system
- ✅ Dark/light theme support
- ✅ Notification system
- ✅ Loading state management
- ✅ Accessibility features (ARIA, keyboard nav, shortcuts)
- ✅ Docker support with multi-stage builds
- ✅ CI/CD with GitHub Actions
- ✅ E2E test infrastructure

### Known Issues

1. **Document Management**
   - Double notifications on document deletion
   - Validation display improvements needed

2. **Visual Hierarchy**
   - Documents screen header color matches active row
   - Scrollbar appearance in Collections/Documents screens
   - Navbar height calculation affecting layout

3. **UI Polish**
   - Navbar styling improvements needed
   - Navigation link hover states
   - Field validation message clarity

### In Progress

- Focus indicator improvements
- Documentation updates
- UI/UX refinements

### Planned Features

- Collections alphabetical sorting
- Search functionality
- Advanced filtering
- Batch operations
- Performance optimizations

## Important Notes for Agents

1. **Minimal Changes**: Make surgical, focused changes. Don't refactor working code unnecessarily.

2. **Theme Compatibility**: Always test changes in both light and dark themes.

3. **Accessibility**: Maintain and improve accessibility features. Never remove ARIA attributes or keyboard navigation.

4. **Loading States**: Always implement proper loading states for async operations.

5. **Type Safety**: Maintain strict TypeScript typing. Don't use `any` types.

6. **Testing**: Run existing tests and add tests for new features.

7. **Documentation**: Update this file when adding new patterns or architectural changes.

8. **Build Verification**: Always verify builds complete successfully after changes.

## Resources

- **Repository**: <https://github.com/timbuchinger/chromadb-ui>
- **Docker Hub**: <https://hub.docker.com/r/timbuchinger/chromadb-ui>
- **ChromaDB Docs**: <https://docs.trychroma.com/>
- **Vue.js Docs**: <https://vuejs.org/>
- **TailwindCSS Docs**: <https://tailwindcss.com/>

## Getting Help

- Review this document thoroughly before starting work
- Check existing component implementations for patterns
- Refer to systemPatterns.md for detailed pattern documentation
- Review test files for usage examples
- Check GitHub issues for known problems and discussions
