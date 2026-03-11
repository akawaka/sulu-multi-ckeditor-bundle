// @flow
let editorConfigs = {};

export const setEditorConfigs = (configs: Object) => {
    editorConfigs = configs;
};

export const getEditorConfig = (configType: string = 'default') => {
    return editorConfigs[configType] || editorConfigs['default'] || {};
};
