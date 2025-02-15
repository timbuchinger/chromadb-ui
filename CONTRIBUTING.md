# Contributing to ChromaDB Admin Interface

Thank you for considering contributing to the ChromaDB Admin Interface!
This document provides guidelines and instructions for contributing.

## Development Process

### Setting Up the Development Environment

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start development server: `npm run dev`

### Code Standards

#### TypeScript

- Use strict TypeScript typing
- Avoid `any` types
- Use interfaces for complex types
- Document complex type definitions

#### Vue Components

- Use Composition API with `<script setup>`
- Implement proper prop validation
- Use TypeScript for component props and emits
- Follow single-responsibility principle
- Keep components focused and modular

#### Accessibility

- Follow WCAG 2.1 guidelines
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers
- Ensure sufficient color contrast

#### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Support dark/light themes
- Maintain consistent spacing
- Use design system variables

### Component Structure

```vue
<script setup lang="ts">
// Types
interface Props {
  // ...
}

// Props
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'update'): void
}>()

// Composables
const { someFunction } = useSomeComposable()

// Computed properties
const computed = computed(() => {
  // ...
})

// Methods
const handleEvent = () => {
  // ...
}
</script>

<template>
  <div>
    <!-- Template content -->
  </div>
</template>
```

### Testing

- Write unit tests for components
- Include integration tests for features
- Test accessibility features
- Test responsive behavior
- Test theme switching

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes in small, focused commits
3. Update documentation as needed
4. Add or update tests
5. Run all tests locally
6. Create a pull request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Test coverage information
   - Documentation updates

### PR Title Format

Use semantic commit messages for PR titles:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: Add collection sorting functionality`

## Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Include inline comments for complex logic
- Update systemPatterns.md for patterns
- Keep all documentation in sync

## Design System

Follow our established design system:

### Typography

- Use system font stack
- Follow established size scale
- Maintain consistent line heights

### Components

- Follow established component patterns
- Use existing UI components
- Maintain consistent spacing
- Support both themes

## Git Guidelines

### Commit Messages

Format:

```text
type(scope): Description in present tense

[optional body]

[optional footer]
```

Example:

```text
feat(collections): Add alphabetical sorting

- Implement sort function
- Update UI to reflect sorted list
- Add sort direction toggle

Closes #123
```

### Branch Names

Format: `type/description-in-kebab-case`

Examples:

- `feat/add-collection-sorting`
- `fix/metadata-validation`
- `docs/update-readme`

## Getting Help

- Join our Discord server
- Check existing issues
- Read the documentation
- Ask in PR discussions

## Code of Conduct

- Be respectful and inclusive
- Follow our code of conduct
- Maintain professional communication
- Help others learn and grow

## License

By contributing, you agree to license your work under the same MIT license as the project.
