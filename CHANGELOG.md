# Changelog

All notable changes to the Editor Bundle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-28

### Added
- Initial release of Editor Bundle
- Multiple CKEditor configurations support for Sulu CMS
- `multi_text_editor` content type with configurable parameters
- Mini editor configuration for inline editing
- Full editor configuration with complete toolbar
- Paragraph tag stripping functionality
- React-based admin interface component
- Comprehensive unit test suite
- TypeScript definitions for React components
- Example templates and documentation

### Features
- **Multi-Configuration Support**: Different editor toolbars per field
- **Parameter-Based Configuration**: XML template parameter support
- **PHPCR Integration**: Seamless content storage and retrieval
- **Backward Compatibility**: Works with existing Sulu installations
- **Developer-Friendly**: Well-documented API and examples

### Supported Configurations
- `mini_editor`: Simplified toolbar for headlines and short content
- `full`: Complete editing capabilities with all formatting options
- `default`: Standard Sulu CKEditor configuration

### Technical Details
- Compatible with Sulu CMS 2.5+
- Supports Symfony 5.4, 6.x, and 7.x
- PHP 8.1+ requirement
- React 17+ for admin interface
- Comprehensive PHPStan level 8 compliance
- 100% test coverage

### Documentation
- Complete installation and usage guide
- API reference documentation
- Example templates and configurations
- Troubleshooting guide
- Community contribution guidelines

## [Unreleased]

### Planned Features
- Additional editor configurations (code editor, table editor)
- Visual configuration builder interface
- WordPress-style block editor integration
- Enhanced headless CMS API support
- Plugin system for custom editor extensions