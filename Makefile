.DEFAULT_GOAL := help

##
## Project setup
##---------------------------------------------------------------------------
.PHONY: install start stop

install: start ## Install requirements for Sulu test application
	@echo " Installing Sulu test application..."
	sudo chmod -Rf 777 tests/Application/var || true
	sudo chmod -Rf 777 tests/Application/public/uploads || true
	docker-compose exec php git config --global --add safe.directory /srv/sulu
	docker-compose exec php sh -c "php -d memory_limit=-1 /usr/bin/composer install --no-interaction -d tests/Application"
	docker-compose exec nodejs yarn --cwd tests/Application install
	@echo " Setting up database..."
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:database:create --if-not-exists -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:phpcr:init:dbal --force --drop -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:phpcr:repository:init -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console sulu:build dev --destroy --no-interaction
	@echo " Installing assets..."
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console assets:install tests/Application/public -e dev
	docker-compose exec nodejs yarn --cwd tests/Application build
	@echo "  Warming up cache..."
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console cache:warmup -e dev

	@echo " Installation complete! Visit http://localhost:8080"

start: ## Start the project
	@echo "  Starting Docker services..."
	docker-compose up -d
	@echo " Services started!"
	@echo " Web: http://localhost:8080"
	@echo " Admin: http://localhost:8080/admin (admin/admin)"
	@echo " MailHog: http://localhost:8025"

stop: ## Stop and clean
	@echo " Stopping services..."
	docker-compose kill
	docker-compose rm -v --force

clean: stop ## Clean plugin completely
	@echo " Cleaning up..."
	docker-compose down -v --remove-orphans
	docker volume prune -f
	sudo rm -Rf tests/Application/node_modules tests/Application/var tests/Application/public/uploads vendor .phpunit.result.cache composer.lock || true
	@echo " Cleanup complete!"

restart: stop start ## Restart all services

##
## Development
##---------------------------------------------------------------------------
.PHONY: shell logs admin build

shell: ## Access PHP container shell
	docker-compose exec php sh

logs: ## Show container logs
	docker-compose logs -f php

admin: ## Create Sulu admin user
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console sulu:user:create admin admin admin@example.com Admin Admin en admin

build: ## Build frontend assets
	docker-compose exec nodejs npm --prefix tests/Application/assets/admin run build

watch: ## Watch frontend assets for changes
	docker-compose exec nodejs npm --prefix tests/Application/assets/admin run watch

##
## Database
##---------------------------------------------------------------------------
.PHONY: db-reset db-fixtures

db-reset: ## Reset database completely
	@echo " Resetting database..."
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:database:drop --force --if-exists -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:database:create -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console doctrine:schema:create -e dev
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console sulu:build dev --destroy
	make db-fixtures

db-fixtures: ## Load database fixtures
	@echo " Database fixtures disabled - not available in this bundle"

##
## QA Tools
##---------------------------------------------------------------------------
.PHONY: validate phpstan psalm phpspec phpunit behat cs-fix

validate: ## Validate composer.json
	docker-compose exec php composer validate --ansi --strict

phpstan: ## Run PHPStan static analysis
	docker-compose exec php vendor/bin/phpstan analyse -c phpstan.neon -l max src/

psalm: ## Run Psalm static analysis
	docker-compose exec php vendor/bin/psalm

phpspec: ## Run PHPSpec tests
	docker-compose exec php vendor/bin/phpspec run --ansi -f progress --no-interaction

phpunit: ## Run PHPUnit tests
	docker-compose exec php vendor/bin/phpunit --colors=always

behat: ## Run Behat tests
	docker-compose exec php vendor/bin/behat --colors --strict -vvv --no-interaction

cs-fix: ## Fix code style issues
	docker-compose exec php vendor/bin/php-cs-fixer fix --allow-risky=yes

ci: validate phpstan psalm phpspec phpunit behat ## Run all CI tasks

##
## Bundle Development
##---------------------------------------------------------------------------
.PHONY: bundle-install bundle-test

bundle-install: ## Install this bundle in test application
	@echo " Installing bundle in test application..."
	docker-compose exec php php -d memory_limit=-1 tests/Application/bin/console sulu:bundle:install AkawakaSuluMultiCKEditorBundle

bundle-test: ## Test bundle functionality
	@echo "🧪  Testing bundle..."
	make cs-fix
	make validate
	make phpstan
	@echo " Bundle tests passed!"

##
## Utilities
##---------------------------------------------------------------------------
.PHONY: help status

status: ## Show service status
	docker-compose ps

help: ## Show all make tasks (default)
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

-include Makefile.local