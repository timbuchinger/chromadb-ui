# Theme

The application uses a consistent color scheme across all components:

## Colors

### Light Mode

- Primary background: `bg-gray-50`
- Secondary/Container background: `bg-gray-100`
- Text: `text-gray-900`
- Border: `ring-gray-300`

### Dark Mode

- Primary background: `bg-gray-900`
- Secondary/Container background: `bg-gray-800`
- Text: `text-white`
- Border: `ring-gray-700`

### ChromaDB Color Scheme

- Primary accent: `accent-primary` (blue-600, #2563eb)
  - Used for: 
    - Primary action buttons (`bg-accent-primary`)
    - Navigation elements
    - Focus states (`focus:ring-accent-primary`)
    - Form controls (radio buttons, checkboxes)
    - Interactive elements

- Secondary accent: `accent-secondary` (orange-500, #f97316)
  - Used for:
    - Hover states on primary buttons (`hover:bg-accent-secondary`)
    - Secondary interactive elements
    - Active states

- Tertiary accent: `accent-tertiary` (yellow-500, #eab308)
  - Used for:
    - Highlights
    - Badges
    - Additional indicators

- Error/Danger: `accent-error` (red-500)
  - Used for:
    - Error states
    - Destructive actions (e.g., delete buttons)
    - Error messages
    - Invalid form states

### Usage Patterns

1. Buttons
   - Primary actions: `bg-accent-primary hover:bg-accent-secondary`
   - Destructive actions: `bg-accent-error hover:bg-accent-error/80`
   - Pagination: `bg-accent-primary hover:bg-accent-secondary`

2. Interactive Elements
   - Hover states: Use `accent-secondary`
   - Focus states: Use `accent-primary`
   - Active/Selected: Use `accent-primary`

3. Status Indicators
   - Error messages: Use `accent-error`
   - Success states: Use status success colors
   - Warning states: Use status warning colors
   - Info states: Use status info colors

## Input Fields

All input fields should use consistent styling:

```css
relative block w-full rounded-md border-0 py-1.5 px-3 
text-gray-900 dark:text-white 
dark:bg-gray-800 
ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
placeholder:text-gray-400 
focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary 
sm:text-sm sm:leading-6
```

## Buttons

Primary action buttons should use:

```css
rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white 
hover:bg-accent-secondary 
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary 
disabled:opacity-50
```

### Destructive Buttons

Delete and other destructive action buttons should use:

```css
rounded-md bg-accent-error px-3 py-2 text-sm font-semibold text-white 
hover:bg-accent-error/80 
disabled:opacity-50
```
