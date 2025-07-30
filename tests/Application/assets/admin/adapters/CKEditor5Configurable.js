// @flow
import React from 'react';
import {isArrayLike} from 'mobx';
import CKEditor5Configurable from '../components/CKEditor5Configurable';
import type {TextEditorProps} from 'sulu-admin-bundle/containers/TextEditor/types';
import type {IObservableArray} from 'mobx/lib/mobx';

/**
 * Adaptateur CKEditor5 personnalisé qui supporte les configurations multiples via paramètres
 * 
 * Permet de créer différentes configurations d'éditeur (minimal, simple, complet)
 * en fonction des paramètres définis dans les templates Sulu.
 */
export default class CKEditor5ConfigurableAdapter extends React.Component<TextEditorProps> {
    render() {
        const {
            disabled,
            locale,
            onBlur,
            onChange,
            onFocus,
            options,
            value,
        } = this.props;

        const unvalidatedFormatOptionValues = options && options.formats ? options.formats.value : [];

        if (!isArrayLike(unvalidatedFormatOptionValues)) {
            throw new Error('The passed "formats" must be an array of strings');
        }
        // $FlowFixMe: flow does not recognize that isArrayLike(value) means that value is an array
        const formatOptionValues: Array<any> | IObservableArray<any> = unvalidatedFormatOptionValues;

        const formats = formatOptionValues.length
            ? formatOptionValues.map((format) => {
                if (typeof format.name !== 'string') {
                    throw new Error('The name property of the passed "formats" must be strings!');
                }
                return format.name;
            })
            : undefined;

        // Récupérer le paramètre de configuration depuis les options du template
        const configType = options && options.config ? options.config.value : 'default';

        return (
            <CKEditor5Configurable
                disabled={disabled}
                formats={formats}
                locale={locale}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                value={value}
                configType={configType}
            />
        );
    }
}