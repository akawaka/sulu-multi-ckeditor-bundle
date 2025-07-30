# Frontend Assets for Sulu Multi CKEditor Bundle

This directory contains the JavaScript components that you need to copy to your Sulu project.

## Installation

1. **Copy these files to your project:**
   ```bash
   cp -r assets/admin/* YOUR_PROJECT/assets/admin/
   ```

2. **Add the integration code to your `assets/admin/app.js`:**
   ```javascript
   import {textEditorRegistry, fieldRegistry} from 'sulu-admin-bundle/containers';
   import {initializer} from 'sulu-admin-bundle/services';
   
   // Import the copied components
   import CKEditor5ConfigurableAdapter from './adapters/CKEditor5Configurable';
   import ConfigurableTextEditor from './fields/ConfigurableTextEditor';
   
   // Config management
   let editorConfigs = {};
   
   export const setEditorConfigs = (configs) => {
       editorConfigs = configs;
   };
   
   export const getEditorConfig = (configType = 'default') => {
       return editorConfigs[configType] || editorConfigs['default'] || {};
   };
   
   // Initialize the bundle
   initializer.addUpdateConfigHook('akawaka_sulu_multi_text_editor', (config, initialized) => {
       if (config && config.configs) {
           setEditorConfigs(config.configs);
       }
       
       if (initialized) {
           return;
       }
   });
   
   // Register components
   textEditorRegistry.add('ckeditor5_configurable', CKEditor5ConfigurableAdapter);
   fieldRegistry.add('configurable_text_editor', ConfigurableTextEditor);
   ```

3. **Update the import in `components/CKEditor5Configurable.js`:**
   ```javascript
   // Change the comment line to:
   import {getEditorConfig} from '../app';
   ```

4. **Build your assets:**
   ```bash
   npm run build
   php bin/console sulu:build --env=prod
   ```

## Files Description

- **`adapters/CKEditor5Configurable.js`** - Extracts configuration parameters from Sulu templates
- **`components/CKEditor5Configurable.js`** - Main CKEditor5 component with multi-configuration support
- **`fields/ConfigurableTextEditor.js`** - Sulu field type registration
- **`app.example.js`** - Complete integration example

## Dependencies

These components require:
- CKEditor 5 packages (already included in Sulu)
- React and MobX (provided by Sulu)
- Sulu Admin Bundle components

All dependencies are already available in a standard Sulu installation.