# Akawaka Sulu Multi CKEditor Bundle - Configuration System

## Overview

This bundle implements a flexible configuration system that allows you to define multiple CKEditor configurations in YAML without rebuilding JavaScript assets. The configuration is passed from PHP to JavaScript via Sulu's initializer system.

## Configuration Structure

### YAML Configuration

Add to your `config/packages/akawaka_sulu_multi_text_editor.yaml`:

```yaml
akawaka_sulu_multi_text_editor:
    configs:
        config_name:
            editor: ckeditor|tiptap  # Editor type (currently only ckeditor supported)
            tags:                    # HTML tags allowed in content
                p: true             # Paragraph tags
                a: true             # Links
                sulu_link: true     # Sulu internal links
                ul: true            # Unordered lists
                ol: true            # Ordered lists
                h1: false           # Heading 1 (usually disabled)
                h2: true            # Heading 2
                h3: true            # Heading 3
                h4: true            # Heading 4  
                h5: true            # Heading 5
                h6: true            # Heading 6
                table: true         # Tables
                code: true          # Code blocks
                blockquote: true    # Block quotes
                strong: true        # Bold text
                em: true            # Italic text
                u: false            # Underline
                s: false            # Strikethrough
                sub: false          # Subscript
                sup: false          # Superscript
                br: true            # Line breaks
                hr: false           # Horizontal rules
            toolbar:                # CKEditor toolbar configuration
                - 'heading'
                - '|'
                - 'bold'
                - 'italic'
                - 'link'
                # ... more toolbar items
```

## Predefined Configurations

The bundle comes with these predefined configs:

### Default Configuration
- **Purpose**: Standard editing with common features
- **Tags**: p, a, sulu_link, ul, ol, h2-h6, table, code, blockquote, strong, em, br
- **Toolbar**: heading, bold, italic, link, lists, table, blockquote

### Minimal Configuration  
- **Purpose**: Simple text editing
- **Tags**: p, a, strong, em, br
- **Toolbar**: bold, italic, link

### Rich Configuration
- **Purpose**: Full-featured editing
- **Tags**: All tags enabled
- **Toolbar**: All available tools including formatting, colors, advanced features

## Usage in Templates

### Basic Usage

```xml
<property name="content" type="multi_text_editor">
    <meta>
        <title lang="en">Content</title>
    </meta>
    <params>
        <param name="config" value="default"/>
    </params>
</property>
```

### With Stripped Paragraph Tags

```xml
<property name="summary" type="multi_text_editor">
    <meta>
        <title lang="en">Summary</title>
    </meta>
    <params>
        <param name="config" value="minimal"/>
        <param name="strip_p_tags" value="true"/>
    </params>
</property>
```

## Technical Implementation

### PHP to JavaScript Flow

1. **YAML Config** → Bundle Extension processes configuration
2. **Bundle Extension** → Stores config in container parameters  
3. **MultiEditorAdmin** → Exposes config via `getConfig()` method
4. **JavaScript Initializer** → Receives config via `addUpdateConfigHook`
5. **MultiTextEditor Component** → Uses config to configure CKEditor

### Key Files

- `src/DependencyInjection/Configuration.php` - YAML schema definition
- `src/DependencyInjection/MultiEditorExtension.php` - Config processing
- `src/Admin/MultiEditorAdmin.php` - Config exposure to JS
- `src/Resources/js/index.js` - JavaScript initializer
- `src/Resources/js/containers/MultiTextEditor/MultiTextEditor.js` - Editor component

## Custom Configurations

### Creating Custom Configs

```yaml
akawaka_sulu_multi_text_editor:
    configs:
        my_custom_config:
            editor: ckeditor
            tags:
                p: true
                strong: true
                em: true
                a: true
                ul: true
                ol: true
            toolbar:
                - 'bold'
                - 'italic'
                - '|'
                - 'bulletedList'
                - 'numberedList'
                - '|'
                - 'link'
```

### Using Custom Configs

```xml
<property name="content" type="multi_text_editor">
    <params>
        <param name="config" value="my_custom_config"/>
    </params>
</property>
```

## Future Extensions

### TipTap Editor Support

The configuration system is designed to support multiple editors:

```yaml
akawaka_sulu_multi_text_editor:
    configs:
        tiptap_config:
            editor: tiptap  # Future support
            tags:
                # Same tag structure
```

### Plugin System

Future versions may support custom plugins:

```yaml
akawaka_sulu_multi_text_editor:
    configs:
        with_plugins:
            editor: ckeditor
            plugins:
                - 'CustomPlugin'
                - 'AnotherPlugin'
```

## Benefits

1. **No Rebuild Required** - Change configurations without recompiling JavaScript
2. **Multiple Configs** - Different editors for different content types
3. **Tag-Based Control** - Fine-grained control over allowed HTML
4. **Editor Agnostic** - Designed to support multiple editor types
5. **Sulu Integration** - Follows Sulu's configuration patterns

## Troubleshooting

### Config Not Applied

1. Clear Sulu cache: `bin/console cache:clear`
2. Rebuild admin assets: `bin/console sulu:build dev`
3. Check YAML syntax in configuration file

### JavaScript Errors

1. Check browser console for errors
2. Verify config name matches YAML configuration
3. Ensure all required toolbar items are valid for CKEditor

### Content Filtering Issues

1. Check `tags` configuration for allowed HTML elements
2. Verify CKEditor's `allowedContent` is properly built
3. Test with minimal configuration first