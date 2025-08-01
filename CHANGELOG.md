# Changelog

All notable changes to the Editor Bundle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-07-28

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

## [0.2.0] - 2025-08-01

### 🚨 **MAJOR ARCHITECTURE CHANGE** 🚨

This release introduces a **fundamental architecture change** from JavaScript-based configuration to YAML/PHP-based configuration system.

### ⚠️ **BREAKING CHANGES**
- **Configuration Method**: Complete migration from JavaScript to YAML configuration
- **Backend Integration**: New PHP backend configuration system replaces direct JS configuration
- **Content Type Name**: Changed from `multi_text_editor` to `configurable_text_editor`

### 🆕 **New Architecture Components**

#### Backend Configuration System
- **`MultiEditorAdmin.php`**: Exposes YAML configurations to JavaScript frontend
- **`Configuration.php`**: Defines YAML schema and validation rules  
- **`MultiEditorExtension.php`**: Processes and validates YAML configurations
- **Tags System**: Comprehensive HTML tag control and filtering

#### YAML Configuration System
- **Centralized Configuration**: All editor configs defined in `config/packages/akawaka_sulu_multi_text_editor.yaml`
- **Schema Validation**: Structured configuration with validation
- **Multiple Editor Support**: Unlimited custom editor configurations
- **Tag-Based Control**: Fine-grained HTML element filtering

#### Enhanced JavaScript Integration
- **Configuration Reception**: Automatic config loading via Sulu's `addUpdateConfigHook`
- **Dynamic Loading**: Configurations loaded from backend without JS rebuilds
- **Fallback Support**: Graceful degradation for missing configurations

### 🔧 **Technical Improvements**

#### Configuration Management
- **YAML-First Approach**: All configurations defined in YAML files
- **Backend Processing**: Server-side configuration validation and processing
- **Runtime Loading**: Dynamic configuration loading without asset rebuilds
- **Type Safety**: Structured configuration with schema validation

#### JavaScript Enhancements  
- **Error Handling**: Improved error handling for missing configurations
- **Fallback Mechanisms**: Graceful degradation for configuration loading failures
- **Console Logging**: Better debugging information and status messages
- **Import Resolution**: Enhanced module import resolution with fallbacks

#### Developer Experience
- **Comprehensive Documentation**: Complete installation and troubleshooting guides
- **Template Files**: Ready-to-use configuration templates
- **Validation Steps**: Built-in validation during installation process

### 🐛 **Fixes**
- **JavaScript Errors**: Resolved configuration loading issues
- **Asset Compilation**: Improved asset building process
- **Configuration Loading**: Better handling of missing or invalid configurations

### 📚 **Documentation**
- **Migration Guide**: Complete guide for upgrading from 0.1.1
- **Installation Guide**: Streamlined Composer-based installation
- **Configuration Examples**: Comprehensive YAML configuration examples
- **Troubleshooting**: Dedicated troubleshooting section with common issues

### 🔄 **Migration from 0.1.1**

Users upgrading from 0.1.1 must:
1. Remove old JavaScript-based configurations
2. Create YAML configuration files
3. Update content type references from `multi_text_editor` to `configurable_text_editor`
4. Reinstall and reconfigure the bundle following new instructions

### **Benefits of New Architecture**
- **No JS Rebuilds**: Change configurations without recompiling assets
- **Centralized Management**: All configurations in one place
- **Better Validation**: Schema-based configuration validation
- **Scalability**: Support for unlimited editor configurations
- **Security**: Server-side HTML tag filtering and validation

## [Unreleased]

### Planned Features
- Migration tools for 0.1.1 → 0.2.0 upgrades
- Visual configuration builder interface
- WordPress-style block editor integration
- Enhanced headless CMS API support
- Plugin system for custom editor extensions