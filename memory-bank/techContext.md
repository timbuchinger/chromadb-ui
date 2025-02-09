# Technical Context

## Development Stack

### Frontend Framework

- Vue.js 3
- Vue Router for navigation
- Pinia for state management

### Build Tools

- Vite
- TypeScript configuration
- PostCSS for CSS processing

### Styling

- TailwindCSS for utility-first styling
- Custom theme configuration
- Dark/Light mode support

## Project Structure

### Core Directories

```plaintext
src/
├── components/     # Vue components
├── composables/    # Vue composable functions
├── router/        # Vue Router setup
├── stores/        # Pinia state stores
└── assets/        # Static assets
```

### Key Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.cjs` - TailwindCSS configuration
- `package.json` - Project dependencies

## Dependencies

### Production Dependencies

- Vue.js ecosystem
  - Vue 3
  - Vue Router
  - Pinia

### Development Dependencies

- Build tools
  - Vite
  - TypeScript
  - PostCSS
- Testing
  - Cypress for E2E testing
  - Vitest for unit testing
  - Vue Test Utils
- Styling
  - TailwindCSS
  - PostCSS plugins
- Documentation
  - markdownlint for Markdown style enforcement

## Testing Infrastructure

### E2E Tests (Cypress)

- Test directory: /tests/e2e/
- Key test areas:
  - Navigation flows
  - Form validations
  - Responsive design
  - Collection operations

### Unit Tests (Vitest)

- Integration with Vue Test Utils
- Component-level testing
- Store testing

### Docker Configuration

- Multi-stage Dockerfile
  - Build stage with Node.js
  - Production stage with nginx
  - Optimized for size and security

- Environment Configuration
  - .env file support
  - Runtime environment variables
  - Secure secrets handling

### CI/CD Integration

1. Build Pipeline (On every commit)
   - GitHub Actions workflow
   - Docker image build automation
   - Version control integration
   - Build status notifications
   - Automated test runs on PRs
   - Test report generation

2. Release Pipeline (On-demand)
   - Manual trigger from main branch
   - Semantic version tagging
   - Docker Hub deployment
   - Release documentation
   - Version tracking

## Development Environment

### Requirements

- Node.js
- npm/yarn
- Docker (optional, for containerized development)

### Docker Support

- Dockerfile provided
- docker-compose configuration available
- Environment variables managed via .env file

## Theme Configuration

### Theme Colors

#### Surface Colors

- Primary:
  - Light: `bg-surface-primary-light` (gray-50)
  - Dark: `bg-surface-primary-dark` (gray-900)
- Secondary:
  - Light: `bg-surface-secondary-light` (gray-100)
  - Dark: `bg-surface-secondary-dark` (gray-800)

#### Content Colors

- Primary:
  - Light: `text-content-primary-light` (gray-900)
  - Dark: `text-content-primary-dark` (white)

#### Border Colors

- Primary:
  - Light: `border-border-primary-light` (gray-300)
  - Dark: `border-border-primary-dark` (gray-700)

#### Accent Colors

ChromaDB-inspired refined color scheme:
- Primary: `accent-primary` (blue-600, #2563eb) - Main actions and focus elements
- Secondary: `accent-secondary` (orange-500, #f97316) - Interactive elements and hover states
- Tertiary: `accent-tertiary` (yellow-500, #eab308) - Additional accents and indicators
- Error: `accent-error` (red-500) - Error states and destructive actions

Usage:
- Primary: Main CTAs, important actions
- Secondary: Hover states, interactive elements
- Tertiary: Highlights, badges, indicators
- Error: Delete buttons, error messages

#### Status Colors

- Success:
  - Background: `bg-status-success-bg-light/dark`
  - Text: `text-status-success-text-light/dark`
- Error:
  - Background: `bg-status-error-bg-light/dark`
  - Text: `text-status-error-text-light/dark`
- Warning:
  - Background: `bg-status-warning-bg-light/dark`
  - Text: `text-status-warning-text-light/dark`
- Info:
  - Background: `bg-status-info-bg-light/dark`
  - Text: `text-status-info-text-light/dark`

## Technical Constraints

1. Collection names:
   - Must be unique
   - Allow only lowercase letters, numbers, dashes, underscores
   - No special characters or spaces

2. Pagination:
   - 20 items per page for collections list

3. Notifications:
   - 10-second auto-dismiss
   - Manual dismiss option
   - Four notification types (Success, Info, Warning, Error)

### Metadata Validation

1. **Type Definitions:**
   - String: UTF-8 encoded text
   - Integer: Whole numbers (positive/negative)
   - Float: Decimal numbers with precision
   - Boolean: Strict "true" or "false"

2. **Validation Rules:**
   - String:
     * No length restrictions
     * Supports special characters
     * Trims whitespace
     * Required if key present
   - Integer:
     * Whole numbers only
     * No decimal points
     * Scientific notation not allowed
     * Supports negative values
   - Float:
     * Decimal numbers allowed
     * Scientific notation supported
     * Handles precision appropriately
     * Supports negative values
   - Boolean:
     * Case-sensitive "true" or "false"
     * No other values accepted
     * No type coercion

3. **Error Handling:**
   - Type-specific error messages
   - Real-time validation
   - Clear user feedback
   - Validation state tracking
