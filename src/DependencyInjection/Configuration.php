<?php

declare(strict_types=1);

namespace Akawaka\SuluMultiCKEditorBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('akawaka_sulu_multi_text_editor');

        $treeBuilder->getRootNode()
            ->children()
                ->arrayNode('configs')
                    ->useAttributeAsKey('name')
                    ->arrayPrototype()
                        ->children()
                            ->enumNode('editor')
                                ->values(['ckeditor', 'tiptap'])
                                ->defaultValue('ckeditor')
                            ->end()
                            ->arrayNode('tags')
                                ->children()
                                    ->booleanNode('p')->defaultTrue()->end()
                                    ->booleanNode('a')->defaultTrue()->end()
                                    ->booleanNode('sulu_link')->defaultTrue()->end()
                                    ->booleanNode('ul')->defaultTrue()->end()
                                    ->booleanNode('ol')->defaultTrue()->end()
                                    ->booleanNode('h1')->defaultFalse()->end()
                                    ->booleanNode('h2')->defaultTrue()->end()
                                    ->booleanNode('h3')->defaultTrue()->end()
                                    ->booleanNode('h4')->defaultTrue()->end()
                                    ->booleanNode('h5')->defaultTrue()->end()
                                    ->booleanNode('h6')->defaultTrue()->end()
                                    ->booleanNode('table')->defaultTrue()->end()
                                    ->booleanNode('code')->defaultTrue()->end()
                                    ->booleanNode('blockquote')->defaultTrue()->end()
                                    ->booleanNode('strong')->defaultTrue()->end()
                                    ->booleanNode('em')->defaultTrue()->end()
                                    ->booleanNode('u')->defaultFalse()->end()
                                    ->booleanNode('s')->defaultFalse()->end()
                                    ->booleanNode('sub')->defaultFalse()->end()
                                    ->booleanNode('sup')->defaultFalse()->end()
                                    ->booleanNode('br')->defaultTrue()->end()
                                    ->booleanNode('hr')->defaultFalse()->end()
                                ->end()
                            ->end()
                            ->arrayNode('toolbar')
                                ->scalarPrototype()->end()
                                ->defaultValue([
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
                                ])
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}