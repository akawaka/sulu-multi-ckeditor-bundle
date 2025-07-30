// Example integration file for projects using the Multi CKEditor Bundle
// Copy this code to your assets/admin/app.js file

import {textEditorRegistry, fieldRegistry} from 'sulu-admin-bundle/containers';
import {initializer} from 'sulu-admin-bundle/services';

// Copy these files to your assets/admin/ directory:
import CKEditor5ConfigurableAdapter from './adapters/CKEditor5Configurable';
import ConfigurableTextEditor from './fields/ConfigurableTextEditor';

// Initialize the bundle when config is received from backend
initializer.addUpdateConfigHook('akawaka_sulu_multi_text_editor', (config, initialized) => {
    // Store configs for use in components - you need to implement setEditorConfigs
    // See the bundle's src/Resources/js/index.js for the implementation
    if (config && config.configs) {
        setEditorConfigs(config.configs);
    }
    
    if (initialized) {
        return;
    }
});

// Register the adapter and field type for configurable text editor
textEditorRegistry.add('ckeditor5_configurable', CKEditor5ConfigurableAdapter);
fieldRegistry.add('configurable_text_editor', ConfigurableTextEditor);

// You also need to implement the config management functions:
// See src/Resources/js/index.js in the bundle for the complete implementation
let editorConfigs = {};

export const setEditorConfigs = (configs) => {
    editorConfigs = configs;
};

export const getEditorConfig = (configType = 'default') => {
    return editorConfigs[configType] || editorConfigs['default'] || {};
};