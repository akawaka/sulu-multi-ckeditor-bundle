<?php

declare(strict_types=1);

namespace Akawaka\SuluMultiCKEditorBundle\DependencyInjection;

use Sulu\Component\Content\Types\TextEditor;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class MultiEditorExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // Store configuration in container parameters
        $container->setParameter('akawaka_sulu_multi_text_editor.configs', $config['configs'] ?? []);

        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));

        // Common services (Admin class providing config to JS frontend)
        $loader->load('services.yaml');

        // Sulu 2.x only: load PHPCR-based content type if TextEditor class exists
        if (class_exists(TextEditor::class)) {
            $loader->load('services_legacy.yaml');
        }
    }

    public function getAlias(): string
    {
        return 'akawaka_sulu_multi_text_editor';
    }
}