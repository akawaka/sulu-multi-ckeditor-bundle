<?php

declare(strict_types=1);

namespace Akawaka\SuluMultiCKEditorBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\Admin;
use Sulu\Bundle\AdminBundle\Admin\Navigation\NavigationItemCollection;
use Sulu\Bundle\AdminBundle\Admin\View\ViewCollection;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class MultiEditorAdmin extends Admin
{
    public function __construct(
        private ParameterBagInterface $parameterBag
    ) {
    }

    public function configureNavigationItems(NavigationItemCollection $navigationItemCollection): void
    {
        // No navigation items needed for this bundle
    }

    public function configureViews(ViewCollection $viewCollection): void
    {
        // No views needed for this bundle
    }

    public function getConfigKey(): ?string
    {
        return 'akawaka_sulu_multi_text_editor';
    }

    public function getConfig(): ?array
    {
        $configs = $this->parameterBag->get('akawaka_sulu_multi_text_editor.configs');

        // Add default configuration if none provided
        if (empty($configs)) {
            $configs = [
                'default' => [
                    'editor' => 'ckeditor',
                    'tags' => [
                        'p' => true,
                        'a' => true,
                        'sulu_link' => true,
                        'ul' => true,
                        'ol' => true,
                        'h1' => false,
                        'h2' => true,
                        'h3' => true,
                        'h4' => true,
                        'h5' => true,
                        'h6' => true,
                        'table' => true,
                        'code' => true,
                        'blockquote' => true,
                        'strong' => true,
                        'em' => true,
                        'u' => false,
                        's' => false,
                        'sub' => false,
                        'sup' => false,
                        'br' => true,
                        'hr' => false,
                    ],
                    'toolbar' => [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'insertTable',
                        'blockQuote',
                        'undo',
                        'redo'
                    ]
                ]
            ];
        }

        return [
            'configs' => $configs,
        ];
    }
}