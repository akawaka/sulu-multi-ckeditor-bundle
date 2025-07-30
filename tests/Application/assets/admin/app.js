// Add project specific javascript code and import of additional bundles here:
import '../../../../src/Resources/js/index.js';

// Import required Sulu admin components
import {textEditorRegistry, fieldRegistry} from 'sulu-admin-bundle/containers';
import {initializer} from 'sulu-admin-bundle/services';
import {setEditorConfigs} from '../../../../src/Resources/js/index';
import CKEditor5ConfigurableAdapter from './adapters/CKEditor5Configurable';
import ConfigurableTextEditor from './fields/ConfigurableTextEditor';

// Initialize the bundle when config is received from backend
initializer.addUpdateConfigHook('akawaka_sulu_multi_text_editor', (config, initialized) => {
    // Store configs for use in components
    setEditorConfigs(config.configs || {});
    
    if (initialized) {
        return;
    }
});

// Register the adapter and field type for configurable text editor
textEditorRegistry.add('ckeditor5_configurable', CKEditor5ConfigurableAdapter);
fieldRegistry.add('configurable_text_editor', ConfigurableTextEditor);
