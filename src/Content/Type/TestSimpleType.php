<?php

declare(strict_types=1);

namespace App\Bundle\MultiEditorBundle\Content\Type;

use PHPCR\NodeInterface;
use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\SimpleContentType;

class TestSimpleType extends SimpleContentType
{
    public function __construct()
    {
        parent::__construct('test_simple_type');
    }

    public function write(
        NodeInterface $node,
        PropertyInterface $property,
        $userId,
        $webspaceKey,
        $languageCode,
        $segmentKey
    ): void {
        $value = $property->getValue();
        if ($value === null) {
            $this->remove($node, $property, $webspaceKey, $languageCode, $segmentKey);
            return;
        }
        $node->setProperty($property->getName(), (string) $value);
    }

    public function read(NodeInterface $node, PropertyInterface $property, $webspaceKey, $languageCode, $segmentKey): void
    {
        $value = '';
        if ($node->hasProperty($property->getName())) {
            $value = $node->getPropertyValue($property->getName());
        }
        $property->setValue($value);
    }

    public function remove(NodeInterface $node, PropertyInterface $property, $webspaceKey, $languageCode, $segmentKey): void
    {
        if ($node->hasProperty($property->getName())) {
            $node->getProperty($property->getName())->remove();
        }
    }

    public function getViewData(PropertyInterface $property): mixed
    {
        return $property->getValue() ?? '';
    }

    public function getContentData(PropertyInterface $property): mixed
    {
        return $this->getViewData($property);
    }

    public function getTemplate(): string
    {
        return 'admin/content-types/test-simple.html.twig';
    }
}