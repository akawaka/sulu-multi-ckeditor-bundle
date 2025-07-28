<?php

declare(strict_types=1);

namespace App\Bundle\MultiEditorBundle\Content\Type;

use PHPCR\NodeInterface;
use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\Compat\PropertyParameter;
use Sulu\Component\Content\SimpleContentType;

class MultiTextEditorType extends SimpleContentType
{
    public function __construct()
    {
        parent::__construct('multi_text_editor');
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

        // Ensure value is a string before storing
        $stringValue = is_string($value) ? $value : (string) $value;
        
        // Store the content as string in PHPCR
        $node->setProperty($property->getName(), $stringValue);
    }

    public function read(NodeInterface $node, PropertyInterface $property, $webspaceKey, $languageCode, $segmentKey): void
    {
        $value = '';
        if ($node->hasProperty($property->getName())) {
            $propertyValue = $node->getPropertyValue($property->getName());
            $value = is_string($propertyValue) ? $propertyValue : '';
        }

        $property->setValue($value);
    }

    public function remove(NodeInterface $node, PropertyInterface $property, $webspaceKey, $languageCode, $segmentKey): void
    {
        if ($node->hasProperty($property->getName())) {
            $node->getProperty($property->getName())->remove();
        }
    }

    /**
     * @return array<string, PropertyParameter>
     */
    public function getDefaultParams(?PropertyInterface $property = null): array
    {
        return [
            'config' => new PropertyParameter('config', 'default'),
            'strip_p_tags' => new PropertyParameter('strip_p_tags', false),
        ];
    }

    public function getViewData(PropertyInterface $property): mixed
    {
        $value = $property->getValue();
        
        // Ensure we always return a string
        if (!is_string($value)) {
            return '';
        }
        
        // Get parameters safely
        try {
            $params = $property->getParams();
            $config = 'default';
            $stripPTags = false;
            
            if (is_array($params)) {
                // Access parameter values correctly - they are PropertyParameter objects
                if (isset($params['config'])) {
                    $config = $params['config']->getValue();
                }
                
                if (isset($params['strip_p_tags'])) {
                    $stripPTagsValue = $params['strip_p_tags']->getValue();
                    // Convert to boolean if it's a string
                    if (is_string($stripPTagsValue)) {
                        $stripPTags = in_array(strtolower($stripPTagsValue), ['true', '1', 'yes', 'on'], true);
                    } else {
                        $stripPTags = (bool) $stripPTagsValue;
                    }
                }
            }
            
            // If strip_p_tags is enabled, remove paragraph tags
            if ($stripPTags) {
                $value = preg_replace('/<\/?p[^>]*>/', '', $value);
                $value = trim($value ?? '');
            }
            
        } catch (\Exception $e) {
            // If anything goes wrong with parameter access, just return the value as-is
            // This prevents the "Array to string conversion" error
        }

        return $value;
    }

    public function getContentData(PropertyInterface $property): mixed
    {
        return $this->getViewData($property);
    }
}