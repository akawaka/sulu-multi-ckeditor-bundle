#!/bin/bash

echo "🚀 Starting Docker services..."
docker-compose up -d

echo "🏗️ Installing Sulu test application..."

# Set permissions without sudo
chmod -Rf 777 tests/Application/var 2>/dev/null || true  
chmod -Rf 777 tests/Application/public/uploads 2>/dev/null || true

echo "🗄️ Setting up Git and Composer..."
docker-compose exec php git config --global --add safe.directory /srv/sulu

echo "📦 Installing dependencies..."
docker-compose exec php composer install --no-interaction -d tests/Application --prefer-dist --no-dev

echo "🗄️ Setting up database..."
docker-compose exec php tests/Application/bin/console doctrine:database:create --if-not-exists -e dev
docker-compose exec php tests/Application/bin/console doctrine:phpcr:init:dbal -e dev
docker-compose exec php tests/Application/bin/console doctrine:phpcr:repository:init -e dev
docker-compose exec php tests/Application/bin/console sulu:build dev --destroy

echo "📦 Installing assets..."  
docker-compose exec php tests/Application/bin/console assets:install tests/Application/public -e dev

echo "🔥 Warming up cache..."
docker-compose exec php tests/Application/bin/console cache:warmup -e dev

echo "📊 Loading fixtures..."
docker-compose exec php tests/Application/bin/console sulu:fixtures:load --no-interaction -e dev

echo "✅ Installation complete!"
echo "📱 Web: http://localhost:8080"
echo "👨‍💼 Admin: http://localhost:8080/admin (admin/admin)"
echo "📧 MailHog: http://localhost:8025"