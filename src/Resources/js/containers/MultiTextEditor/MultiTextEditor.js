import React from 'react';
import {observer} from 'mobx-react';
import {CKEditor} from 'sulu-admin-bundle/containers';
import {fieldTypeDefaultProps} from 'sulu-admin-bundle/types';

@observer
class MultiTextEditor extends React.Component {
    static defaultProps = {
        ...fieldTypeDefaultProps,
        disabled: false,
        value: null,
        onFinish: () => {},
        onChange: () => {},
    };

    handleChange = (value) => {
        const {onChange, onFinish} = this.props;
        
        onChange(value);
        onFinish();
    };

    getCKEditorConfig = () => {
        const {schemaOptions} = this.props;
        const config = schemaOptions?.config || 'default';
        
        // Return specific configuration based on the config parameter
        return {
            config: config,
            minimal: config === 'mini_editor'
        };
    };

    render() {
        const {disabled, value} = this.props;
        const editorConfig = this.getCKEditorConfig();

        return (
            <CKEditor
                disabled={disabled}
                locale="en"
                onChange={this.handleChange}
                options={editorConfig}
                value={value || ''}
            />
        );
    }
}

export default MultiTextEditor;