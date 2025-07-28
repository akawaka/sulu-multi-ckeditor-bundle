// @flow
import React from 'react';
import log from 'loglevel';
import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import StrikethroughPlugin from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import SubscriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import SuperscriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code';
import TablePlugin from '@ckeditor/ckeditor5-table/src/table';
import TableToolbarPlugin from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import FontPlugin from '@ckeditor/ckeditor5-font/src/font';
import {translate} from 'sulu-admin-bundle/utils/Translator';
import configRegistry from 'sulu-admin-bundle/containers/CKEditor5/registries/configRegistry';
import pluginRegistry from 'sulu-admin-bundle/containers/CKEditor5/registries/pluginRegistry';
import type {IObservableValue} from 'mobx/lib/mobx';
import type {ElementRef} from 'react';

type Props = {|
    disabled: boolean,
    formats: Array<string>,
    locale?: ?IObservableValue<string>,
    onBlur?: () => void,
    onChange: (value: ?string) => void,
    onFocus?: (event: { target: EventTarget }) => void,
    value: ?string,
    configType?: string,
|};

/**
 * Composant CKEditor5 personnalisé avec support des configurations multiples
 * 
 * Gère trois types de configuration :
 * - minimal : bold, italic, listes
 * - simple : + headings, underline, font color  
 * - default : configuration complète avec alignment, table, code, etc.
 */
export default class CKEditor5Configurable extends React.Component<Props> {
    containerRef: ?ElementRef<'div'>;
    editorInstance: any;

    static defaultProps = {
        disabled: false,
        formats: ['h2', 'h3', 'h4', 'h5', 'h6'],
        value: '',
        configType: 'default',
    };

    constructor(props: Props) {
        super(props);
        this.editorInstance = null;
    }

    setContainerRef = (containerRef: ?ElementRef<'div'>) => {
        this.containerRef = containerRef;
    };

    getConfigForType(configType: string, formats: Array<string>, locale: ?IObservableValue<string>) {
        const baseConfig = {
            sulu: {
                locale: locale && locale.get(),
            },
            ui: {
                poweredBy: {
                    position: 'inside',
                    side: 'right',
                    label: '',
                    verticalOffset: 2,
                    horizontalOffset: 3,
                },
            },
        };

        if (configType === 'minimal') {
            return {
                ...baseConfig,
                toolbar: [
                    'bold',
                    'italic',
                    'bulletedlist',
                    'numberedlist',
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: translate('sulu_admin.paragraph'),
                            class: 'ck-heading_paragraph',
                        },
                    ],
                },
            };
        }

        if (configType === 'simple') {
            return {
                ...baseConfig,
                toolbar: [
                    'heading',
                    'bold',
                    'italic',
                    'underline',
                    'bulletedlist',
                    'numberedlist',
                    'fontcolor',
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: translate('sulu_admin.paragraph'),
                            class: 'ck-heading_paragraph',
                        },
                        formats.includes('h2') ? {
                            model: 'heading2',
                            view: 'h2',
                            title: translate('sulu_admin.heading2'),
                            class: 'ck-heading_heading2',
                        } : undefined,
                        formats.includes('h3') ? {
                            model: 'heading3',
                            view: 'h3',
                            title: translate('sulu_admin.heading3'),
                            class: 'ck-heading_heading3',
                        } : undefined,
                    ].filter((entry) => entry !== undefined),
                },
                fontColor: {
                    colors: [
                        {color: 'hsl(0, 0%, 0%)', label: 'Black'},
                        {color: 'hsl(0, 0%, 30%)', label: 'Dim grey'},
                        {color: 'hsl(0, 0%, 60%)', label: 'Grey'},
                        {color: 'hsl(0, 0%, 90%)', label: 'Light grey'},
                        {color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true},
                        {color: 'hsl(0, 75%, 60%)', label: 'Red'},
                        {color: 'hsl(30, 75%, 60%)', label: 'Orange'},
                        {color: 'hsl(60, 75%, 60%)', label: 'Yellow'},
                        {color: 'hsl(90, 75%, 60%)', label: 'Light green'},
                    ],
                    columns: 9,
                    documentColors: 0,
                    colorPicker: false,
                },
            };
        }

        // Configuration complète par défaut
        return {
            ...baseConfig,
            toolbar: [
                'heading',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'bulletedlist',
                'numberedlist',
                'alignment',
                'fontcolor',
                'insertTable',
                'code',
            ],
            heading: {
                options: [
                    {
                        model: 'paragraph',
                        title: translate('sulu_admin.paragraph'),
                        class: 'ck-heading_paragraph',
                    },
                    formats.includes('h1') ? {
                        model: 'heading1',
                        view: 'h1',
                        title: translate('sulu_admin.heading1'),
                        class: 'ck-heading_heading1',
                    } : undefined,
                    formats.includes('h2') ? {
                        model: 'heading2',
                        view: 'h2',
                        title: translate('sulu_admin.heading2'),
                        class: 'ck-heading_heading2',
                    } : undefined,
                    formats.includes('h3') ? {
                        model: 'heading3',
                        view: 'h3',
                        title: translate('sulu_admin.heading3'),
                        class: 'ck-heading_heading3',
                    } : undefined,
                    formats.includes('h4') ? {
                        model: 'heading4',
                        view: 'h4',
                        title: translate('sulu_admin.heading4'),
                        class: 'ck-heading_heading4',
                    } : undefined,
                    formats.includes('h5') ? {
                        model: 'heading5',
                        view: 'h5',
                        title: translate('sulu_admin.heading5'),
                        class: 'ck-heading_heading5',
                    } : undefined,
                    formats.includes('h6') ? {
                        model: 'heading6',
                        view: 'h6',
                        title: translate('sulu_admin.heading6'),
                        class: 'ck-heading_heading6',
                    } : undefined,
                ].filter((entry) => entry !== undefined),
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                ],
            },
            fontColor: {
                colors: [
                    {color: 'hsl(0, 0%, 0%)', label: 'Black'},
                    {color: 'hsl(0, 0%, 30%)', label: 'Dim grey'},
                    {color: 'hsl(0, 0%, 60%)', label: 'Grey'},
                    {color: 'hsl(0, 0%, 90%)', label: 'Light grey'},
                    {color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true},
                    {color: 'hsl(0, 75%, 60%)', label: 'Red'},
                    {color: 'hsl(30, 75%, 60%)', label: 'Orange'},
                    {color: 'hsl(60, 75%, 60%)', label: 'Yellow'},
                    {color: 'hsl(90, 75%, 60%)', label: 'Light green'},
                    {color: 'hsl(120, 75%, 60%)', label: 'Green'},
                    {color: 'hsl(150, 75%, 60%)', label: 'Aquamarine'},
                    {color: 'hsl(180, 75%, 60%)', label: 'Turquoise'},
                    {color: 'hsl(210, 75%, 60%)', label: 'Light blue'},
                    {color: 'hsl(240, 75%, 60%)', label: 'Blue'},
                    {color: 'hsl(270, 75%, 60%)', label: 'Purple'},
                ],
                columns: 9,
                documentColors: 0,
                colorPicker: false,
            },
        };
    }

    componentDidUpdate() {
        if (this.editorInstance) {
            const {value, disabled} = this.props;

            if (disabled) {
                this.editorInstance.ui.element.classList.add('disabled');
                this.editorInstance.enableReadOnlyMode('disabled');
            } else {
                this.editorInstance.ui.element.classList.remove('disabled');
                this.editorInstance.disableReadOnlyMode('disabled');
            }

            const editorData = this.getEditorData();
            if (editorData !== value && !(value === '' && editorData === undefined)) {
                this.editorInstance.setData(value);
            }
        }
    }

    componentDidMount() {
        const {formats, locale, configType} = this.props;

        const customConfig = this.getConfigForType(configType || 'default', formats, locale);

        ClassicEditor
            .create(this.containerRef, {
                plugins: [
                    AlignmentPlugin,
                    BoldPlugin,
                    EssentialsPlugin,
                    HeadingPlugin,
                    ItalicPlugin,
                    ListPlugin,
                    ParagraphPlugin,
                    StrikethroughPlugin,
                    UnderlinePlugin,
                    SubscriptPlugin,
                    SuperscriptPlugin,
                    CodePlugin,
                    TablePlugin,
                    TableToolbarPlugin,
                    FontPlugin,
                    ...pluginRegistry.plugins,
                ],
                ...configRegistry.configs.reduce((previousConfig, config) => {
                    return {...previousConfig, ...config(previousConfig)};
                }, customConfig),
            })
            .then((editor) => {
                this.editorInstance = editor;
                this.editorInstance.setData(this.props.value);

                const {disabled, onBlur, onChange, onFocus} = this.props;
                const {
                    model: {
                        document: modelDocument,
                    },
                    editing: {
                        view: {
                            document: viewDocument,
                        },
                    },
                } = this.editorInstance;

                if (disabled) {
                    this.editorInstance.enableReadOnlyMode('disabled');
                    this.editorInstance.ui.element.classList.add('disabled');
                }

                if (onBlur) {
                    viewDocument.on('blur', () => {
                        onBlur();
                    });
                }

                if (onFocus) {
                    viewDocument.on('focus', () => {
                        onFocus({
                            target: this.editorInstance.ui.element.querySelector('div[contenteditable="true"]'),
                        });
                    });
                }

                if (onChange) {
                    modelDocument.on('change', () => {
                        if (modelDocument.differ.getChanges().length > 0) {
                            onChange(this.getEditorData());
                        }
                    });
                }
            })
            .catch((error) => {
                log.error(error);
            });
    }

    componentWillUnmount() {
        if (this.editorInstance) {
            this.editorInstance.destroy().then(() => this.editorInstance = null);
        }
    }

    getEditorData() {
        const editorData = this.editorInstance.getData();
        return editorData === '' ? undefined : editorData;
    }

    render() {
        return <div ref={this.setContainerRef}></div>;
    }
}