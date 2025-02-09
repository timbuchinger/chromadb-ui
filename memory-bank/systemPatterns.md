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
  - loading.ts: Centralized loading states
  - notifications.ts: Notification management

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
   - Examples: ThemeToggle, NavBar, LoadingSpinner

### State Management Patterns

1. Authentication Flow
   - Centralized auth state
   - Login/logout handling
   - Session management

2. Data Management
   - Collection state handling
   - Document management
   - API interaction patterns

3. Loading State Pattern
   - **Store Integration:**
     - Centralized loading state in Pinia store (loading.ts)
     - Loading states tracked by operation type
     - Helper methods for managing loading states
     - Support for concurrent loading states
     - withLoading utility for async operations
   
   - **Component Integration:**
     - LoadingSpinner for active operations
       - Size variants: sm, md, lg
       - Theme-aware styling
       - Button loading states
     - LoadingSkeleton for content placeholders
       - Matches final content dimensions
       - Preserves layout during loading
       - Theme-aware styling
     - Layout Stability
       - Fixed height containers
       - Consistent dimensions between states
       - Fixed column widths in tables
       - Content placement preservation
     - Error State Handling
       - Clear loading on error
       - Error notifications
       - Graceful state transitions
       - Layout stability maintained

### Authentication Persistence

1. **Storage Implementation:**
   - Utilizes `localStorage` for secure token storage
   - Encrypted token format for enhanced security
   - Automatic token cleanup on session expiry

2. **Token Management:**
   - Authentication tokens stored upon successful login
   - Token validation on each page load
   - Automatic token refresh mechanism
   - Complete token removal on logout
   - Error handling for invalid/expired tokens

3. **Session Recovery:**
   - Automatic authentication state restoration
   - Last visited page remembered and restored
   - Smart redirect handling after refresh
   - Graceful handling of expired sessions
   - Protected route management integration

4. **Security Considerations:**
   - Token encryption in localStorage
   - Session timeout handling
   - CSRF protection implementation
   - Secure token transmission
   - XSS prevention measures

### UI Patterns

1. Modal Pattern
   - Used for collection creation
   - Confirmation dialogs
   - Document viewing/editing

2. Notification Pattern
   - Success/Error/Warning/Info types
   - Auto-dismiss after 10 seconds
   - Manual dismiss option

3. ChromaDB Theme Pattern
   - Light/Dark mode support with consistent surface colors
   - ChromaDB-inspired accent color palette:
     - accent-primary (blue-600): Main CTAs, focus states
     - accent-secondary (orange-500): Hover states, interactive elements
     - accent-tertiary (yellow-500): Highlights, indicators
     - accent-error (red-500): Error states, destructive actions
   - Consistent interaction patterns:
     - Primary buttons transition to secondary on hover
     - Delete buttons use error state with opacity hover
     - Form elements use primary accent for focus
   - Color accessibility considerations:
     - High contrast text colors in both modes
     - Clear visual hierarchy using accent colors
     - Consistent interactive element styling

### Metadata Management

1. **Type Selection:**
   - Dropdown menu for type selection
   - Supported types:
     * String: Text values
     * Integer: Whole numbers
     * Float: Decimal numbers
     * Boolean: True/false values
   - Default type: String
   - Type persistence across sessions

2. **Validation System:**
   - Real-time type validation
   - Type-specific error messages
   - Format requirements by type:
     * String: Any text value
     * Integer: Whole numbers only
     * Float: Valid decimal numbers
     * Boolean: true/false (case-sensitive)
   - Custom validation error display
   - Immediate feedback on type mismatch

3. **UI/UX Implementation:**
   - Add Field button with type selection
   - Type indicator per field
   - Clear All with type reset
   - Remove button per field
   - Type-based input constraints
   - Visual feedback on type validation
   - Keyboard navigation support
   - Accessibility considerations:
     * ARIA labels for type selection
     * Screen reader support
     * Keyboard focus management

## Common Implementation Patterns

### Common UI Patterns

#### Input Fields

```css
relative block w-full rounded-md border-0 py-1.5 px-3 
text-content-primary-light dark:text-content-primary-dark 
dark:bg-surface-secondary-dark 
ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark 
placeholder:text-gray-400 
focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary 
sm:text-sm sm:leading-6
```

#### Primary Button

```css
rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white 
hover:bg-accent-secondary 
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary 
disabled:opacity-50
```

#### Loading Components

```css
/* Spinner Base */
animate-spin rounded-full border-4 border-surface-secondary-light dark:border-surface-secondary-dark
border-t-accent-primary

/* Spinner Sizes */
sm: h-4 w-4
md: h-8 w-8
lg: h-12 w-12

/* Skeleton */
animate-pulse bg-surface-secondary-light dark:bg-surface-secondary-dark rounded
```

#### Status Indicators

```css
/* Success */
bg-status-success-bg-light dark:bg-status-success-bg-dark 
text-status-success-text-light dark:text-status-success-text-dark

/* Error */
bg-status-error-bg-light dark:bg-status-error-bg-dark 
text-status-error-text-light dark:text-status-error-text-dark

/* Warning */
bg-status-warning-bg-light dark:bg-status-warning-bg-dark 
text-status-warning-text-light dark:text-status-warning-text-dark

/* Info */
bg-status-info-bg-light dark:bg-status-info-bg-dark 
text-status-info-text-light dark:text-status-info-text-dark
```

### Collection Name Validation

- Lowercase letters
- Numbers
- Dashes
- Underscores
- No duplicates allowed

## Testing Patterns

### E2E Test Structure

- Page Object Model for test organization
- Custom commands for common operations
- Viewport configurations for responsive testing
- Consistent selector patterns
- Reusable test utilities

### Test Data Management

- Fixture-based test data
- Dynamic data generation
- Clean state between tests
- Mocked API responses when needed

### Common Test Patterns

1. Navigation Testing
   - Route transitions
   - Protected route handling
   - Browser history management

2. Form Testing
   - Input validation
   - Error message verification
   - Submit behavior
   - Success/failure states

3. Responsive Testing
   - Mobile viewport checks
   - Tablet viewport checks
   - Desktop viewport checks
   - Element visibility/positioning

4. Component Testing
   - Rendering verification
   - Props validation
   - Event handling
   - State changes

### CI/CD Integration Patterns

1. Build Pipeline
   - Triggers on every commit
   - Docker image build automation
   - Version control integration
   - Build status notifications
   - Artifact management

2. Release Pipeline
   - On-demand execution
   - Main branch deployments
   - Semantic versioning
   - Docker Hub integration
   - Release tagging automation
   - Version tracking

3. Docker Implementation
   - Multi-stage build process
   - Production-optimized image
   - Environment configuration
   - Build caching strategy
   - Security best practices

4. Testing Integration
   - PR validation workflow
   - Test report generation
   - Screenshot comparisons
   - Performance metrics tracking
   - Test failure notifications

## Documentation Patterns

### Markdown Standards

1. Header Structure
   - Use ATX-style headers (`#` instead of `===`)
   - Headers must increment by one level only
   - Headers must be surrounded by blank lines
   - First heading should be level 1

2. Code Block Standards
   - All code blocks must specify a language
   - Code blocks must be surrounded by blank lines
   - Use triple backticks for fenced code blocks

3. Content Guidelines
   - Maximum line length of 120 characters
   - No trailing spaces allowed
   - Single blank line between sections
   - No HTML tags in markdown (except where required)

4. File Organization
   - Each file must start with a level 1 heading
   - Logical section progression
   - Clear hierarchy in headings

### Documentation Tools

- markdownlint for style enforcement
- Configuration in `.markdownlint.json`
- Integrated with development workflow
