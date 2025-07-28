<?php

declare(strict_types=1);

namespace Akawaka\SuluMultiCKEditorBundle;

use Akawaka\SuluMultiCKEditorBundle\DependencyInjection\MultiEditorExtension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class MultiEditorBundle extends Bundle
{
    public function getContainerExtension(): ?ExtensionInterface
    {
        return new MultiEditorExtension();
    }
}