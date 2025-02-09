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
```
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
- Styling
  - TailwindCSS
  - PostCSS plugins

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

### Light Mode Colors
- Primary background: `bg-gray-50`
- Secondary background: `bg-gray-100`
- Text: `text-gray-900`
- Border: `ring-gray-300`

### Dark Mode Colors
- Primary background: `bg-gray-900`
- Secondary background: `bg-gray-800`
- Text: `text-white`
- Border: `ring-gray-700`

### Accent Colors
- Primary: `blue-600`
- Secondary: `purple-600`
- Error: `red-500`

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
