// @flow
import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import FontSizePlugin from '@ckeditor/ckeditor5-font/src/fontsize';
import HorizontalLinePlugin from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import CodeBlockPlugin from '@ckeditor/ckeditor5-code-block/src/codeblock';
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
import ExternalLinkPlugin from "sulu-admin-bundle/containers/CKEditor5/plugins/ExternalLinkPlugin";
import InternalLinkPlugin from "sulu-admin-bundle/containers/CKEditor5/plugins/InternalLinkPlugin";
import configRegistry from 'sulu-admin-bundle/containers/CKEditor5/registries/configRegistry';
import pluginRegistry from 'sulu-admin-bundle/containers/CKEditor5/registries/pluginRegistry';
import {getEditorConfig} from '../../../../../src/Resources/js/index';
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
 * Lit les configurations depuis le YAML via l'Admin backend
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

        // Get configuration from YAML via backend
        const yamlConfig = getEditorConfig(configType);
        
        if (yamlConfig && yamlConfig.toolbar) {
            // Convert YAML toolbar config to CKEditor format
            const toolbar = yamlConfig.toolbar; // Keep separators
            
            return {
                ...baseConfig,
                toolbar: toolbar,
                heading: this.buildHeadingConfig(formats, yamlConfig),
                fontColor: this.buildFontColorConfig(yamlConfig),
                table: yamlConfig.table || {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow', 
                        'mergeTableCells',
                    ],
                },
            };
        }

        // Fallback to hardcoded configs if YAML not available
        return this.getFallbackConfig(configType, formats, locale, baseConfig);
    }

    buildHeadingConfig(formats: Array<string>, yamlConfig: Object) {
        const options = [
            {
                model: 'paragraph',
                title: translate('sulu_admin.paragraph'),
                class: 'ck-heading_paragraph',
            }
        ];

        // Add headings based on formats and YAML tags
        if (yamlConfig.tags) {
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(heading => {
                const headingNum = heading.charAt(1);
                if (formats.includes(heading) && yamlConfig.tags[heading]) {
                    options.push({
                        model: `heading${headingNum}`,
                        view: heading,
                        title: translate(`sulu_admin.heading${headingNum}`),
                        class: `ck-heading_heading${headingNum}`,
                    });
                }
            });
        }

        return { options };
    }

    buildFontColorConfig(yamlConfig: Object) {
        // Default font colors - could be made configurable via YAML
        return {
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
        };
    }

    getFallbackConfig(configType: string, formats: Array<string>, locale: ?IObservableValue<string>, baseConfig: Object) {
        if (configType === 'minimal') {
            return {
                ...baseConfig,
                toolbar: [
                    'bold',
                    'italic',
                    'bulletedlist',
                    'numberedlist',
                    'internalLink',
                    'externalLink',
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
                    'fontColor',
                    'internalLink',
                    'externalLink',
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
                fontColor: this.buildFontColorConfig({}),
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
                'fontColor',
                'internalLink',
                'externalLink',
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
            fontColor: this.buildFontColorConfig({}),
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
                    ExternalLinkPlugin,
                    HeadingPlugin,
                    InternalLinkPlugin,
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
                    FontSizePlugin,
                    BlockQuotePlugin,
                    HorizontalLinePlugin,
                    CodeBlockPlugin,
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