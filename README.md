# ChromaDB Admin Interface

A modern web interface for managing ChromaDB collections, documents, and metadata.

## Features

- Collections Management
  - Create, view, and delete collections
  - Document management within collections
  - Metadata support for documents
  - Alphabetically sorted collections list

- User Interface
  - Dark/Light theme support
  - Responsive design
  - Accessible interface (WCAG 2.1 compliant)
  - Keyboard shortcuts support

- Advanced Features
  - Type-safe metadata management
  - Real-time validation
  - Loading state management
  - Error handling

## Quick Start

### Using Docker

```bash
# Pull the latest image
docker pull chromadb/admin:latest

# Run the container
docker run -p 8080:80 chromadb/admin:latest
```

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-org/chromadb-admin.git
cd chromadb-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
VITE_CHROMADB_HOST=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Visit `http://localhost:3000` in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Build

Build the image locally:

```bash
docker build -t chromadb-admin .
```

## Keyboard Shortcuts

- `?` - Show keyboard shortcuts help
- `h` - Go to collections list
- `m` - Toggle dark/light mode
- `Esc` - Close dialog or cancel action

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Update documentation
6. Submit a pull request

### Development Guidelines

- Follow the established component patterns
- Use TypeScript for type safety
- Write accessible components
- Include documentation updates
- Add tests for new features

### Code Style

- Use Vue 3 Composition API
- Follow Vue Style Guide recommendations
- Use TypeScript for type safety
- Use Tailwind CSS for styling

## License

MIT License - see LICENSE file for details

## Security

For security issues, please email security@your-org.com instead of using the issue tracker.

## Support

- GitHub Issues: For bug reports and feature requests
- Documentation: [Link to documentation]
- Email: support@your-org.com
