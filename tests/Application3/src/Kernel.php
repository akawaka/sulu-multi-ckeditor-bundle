<?php

declare(strict_types=1);

namespace App;

use FOS\HttpCache\SymfonyCache\HttpCacheProvider;
use Sulu\Bundle\HttpCacheBundle\Cache\SuluHttpCache;
use Sulu\Component\HttpKernel\SuluKernel;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class Kernel extends SuluKernel implements HttpCacheProvider
{
    private ?HttpKernelInterface $httpCache = null;

    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $container->setParameter('container.dumper.inline_class_loader', true);

        parent::configureContainer($container, $loader);
    }

    public function getHttpCache(): HttpKernelInterface
    {
        if (!$this->httpCache instanceof HttpKernelInterface) {
            $this->httpCache = new SuluHttpCache($this);
        }

        return $this->httpCache;
    }
}
