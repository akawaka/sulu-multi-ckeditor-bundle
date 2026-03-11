// @flow
import {textEditorRegistry, fieldRegistry} from 'sulu-admin-bundle/containers';
import {initializer} from 'sulu-admin-bundle/services';
import {setEditorConfigs} from './config';
import CKEditor5ConfigurableAdapter from './adapters/CKEditor5Configurable';
import ConfigurableTextEditor from './fields/ConfigurableTextEditor';

initializer.addUpdateConfigHook('akawaka_sulu_multi_text_editor', (config, initialized) => {
    setEditorConfigs(config.configs || {});
    if (initialized) {
        return;
    }
});

textEditorRegistry.add('ckeditor5_configurable', CKEditor5ConfigurableAdapter);
fieldRegistry.add('configurable_text_editor', ConfigurableTextEditor);
