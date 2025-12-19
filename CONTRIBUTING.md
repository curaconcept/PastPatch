# Contributing to PastPatch

Thank you for your interest in contributing to PastPatch! We're excited to have you on board.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Why it would be useful
- Any implementation ideas (if you have them)

### Adding Platform Support

One of our main goals is supporting as many platforms as possible. To add support for a new platform:

1. Create a new processor file in `src/processors/`
2. Follow the existing processor interface
3. Add tests for your processor
4. Update the catalog UI to include your new tool
5. Document the export format and any limitations

### Code Style

- Use ES6+ JavaScript
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and modular
- Write tests for new features

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

See the main README.md for installation instructions.

## Questions?

Feel free to open an issue for any questions or reach out to the maintainers.

Thank you for contributing! 🎉

