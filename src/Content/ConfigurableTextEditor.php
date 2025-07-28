<?php

declare(strict_types=1);

namespace Akawaka\SuluMultiCKEditorBundle\Content;

use AllowDynamicProperties;
use Sulu\Component\Content\Types\TextEditor;

/**
 * Configurable TextEditor content type that extends the standard TextEditor
 */
#[AllowDynamicProperties]
class ConfigurableTextEditor extends TextEditor
{
    public function __construct(\Sulu\Bundle\MarkupBundle\Markup\MarkupParserInterface $markupParser, string $markupNamespace = 'sulu')
    {
        parent::__construct($markupParser, $markupNamespace);
        $this->name = 'ConfigurableTextEditor';
    }
}
