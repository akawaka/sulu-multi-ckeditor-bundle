// @flow

// Simple config storage without external dependencies
let editorConfigs = {};

// Set configs (called by initializer)
export const setEditorConfigs = (configs: Object) => {
    editorConfigs = configs;
};

// Export function to get editor config by type
export const getEditorConfig = (configType: string = 'default') => {
    return editorConfigs[configType] || editorConfigs['default'] || {};
};