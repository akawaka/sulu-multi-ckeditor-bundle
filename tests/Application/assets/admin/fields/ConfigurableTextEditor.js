// @flow
import React from 'react';
import {observable} from 'mobx';
import TextEditorContainer from 'sulu-admin-bundle/containers/TextEditor';
import userStore from 'sulu-admin-bundle/stores/userStore';
import type {FieldTypeProps} from 'sulu-admin-bundle/containers/Form/types';

/**
 * Champ TextEditor personnalisé qui supporte les configurations multiples
 * 
 * Utilise l'adaptateur ckeditor5_configurable pour permettre différentes
 * configurations d'éditeur selon les paramètres définis dans le template.
 */
export default class ConfigurableTextEditor extends React.Component<FieldTypeProps<?string>> {
    handleFocus = (event: { target: EventTarget }) => {
        const {
            onFocus,
        } = this.props;

        if (onFocus) {
            onFocus(event.target);
        }
    };

    render() {
        const {disabled, formInspector, onChange, onFinish, schemaOptions, value} = this.props;

        const locale = formInspector.locale ? formInspector.locale : observable.box(userStore.contentLocale);

        return (
            <TextEditorContainer
                adapter="ckeditor5_configurable"
                disabled={!!disabled}
                locale={locale}
                onBlur={onFinish}
                onChange={onChange}
                onFocus={this.handleFocus}
                options={schemaOptions}
                value={value}
            />
        );
    }
}