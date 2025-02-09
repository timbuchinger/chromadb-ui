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

### Accent Colors

- Primary accent: `blue-600`
  - Used for: 
    - Focus states (`focus:ring-blue-600`)
    - Form controls (radio buttons, checkboxes)
    - Primary buttons (`bg-blue-600`)
    - Interactive elements

- Secondary accent: `purple-600`
  - Used for:
    - Hover states on buttons (`hover:text-purple-600`, `hover:bg-purple-600`)
    - Secondary interactive elements

### State Colors

- Error/Danger: `text-red-500`

## Input Fields

All input fields should use consistent styling:

```css
relative block w-full rounded-md border-0 py-1.5 px-3 
text-gray-900 dark:text-white 
dark:bg-gray-800 
ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
placeholder:text-gray-400 
focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 
sm:text-sm sm:leading-6
```

## Buttons

Primary action buttons should use:

```css
rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white 
hover:bg-purple-600 
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
disabled:opacity-50
```
