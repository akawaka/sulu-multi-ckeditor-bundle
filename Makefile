.DEFAULT_GOAL := help

##
## Project setup
##---------------------------------------------------------------------------
.PHONY: install install-all start stop

install-all: ## Install both Sulu 2.x and 3.x test applications
	$(MAKE) install
	$(MAKE) install-v3

build-all: ## Build frontend assets for both Sulu 2.x and 3.x
	$(MAKE) build
	$(MAKE) build-v3

install: start ## Install requirements for Sulu 2.x test application
	@echo " Installing Sulu 2.x test application..."
	sudo chmod -Rf 777 tests/Application/var || true
	sudo chmod -Rf 777 tests/Application/public/uploads || true
	docker-compose exec php-v2 git config --global --add safe.directory /srv/sulu
	docker-compose exec php-v2 sh -c "php -d memory_limit=-1 /usr/bin/composer install --no-interaction -d tests/Application"
	docker-compose exec nodejs npm install --prefix tests/Application/assets/admin
	@echo " Setting up database..."
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:database:drop --force --if-exists -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:database:create -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:phpcr:init:dbal --force --drop -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:phpcr:repository:init -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console sulu:build dev --destroy --no-interaction
	@echo " Installing assets..."
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console assets:install tests/Application/public -e dev
	docker-compose exec nodejs npm run build --prefix tests/Application/assets/admin
	@echo "  Warming up cache..."
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console cache:warmup -e dev
	@echo " Installation complete! Visit http://v2.localhost"

start: ## Start the project
	@echo "  Starting Docker services..."
	docker-compose up -d
	@echo " Services started!"
	@echo " Sulu 2.x: http://v2.localhost  (admin: http://v2.localhost/admin)"
	@echo " Sulu 3.x: http://v3.localhost  (admin: http://v3.localhost/admin)"
	@echo " Traefik dashboard: http://localhost:8090"
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
.PHONY: shell-v2 shell-v3 logs admin build build-all watch

shell-v2: ## Access Sulu 2.x PHP container shell
	docker-compose exec php-v2 sh

shell-v3: ## Access Sulu 3.x PHP container shell
	docker-compose exec php-v3 sh

logs: ## Show container logs
	docker-compose logs -f php-v2 php-v3

admin: ## Create Sulu 2.x admin user
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console sulu:user:create admin admin admin@example.com Admin Admin en admin

build: ## Build Sulu 2.x frontend assets
	docker-compose exec nodejs npm install --prefix tests/Application/assets/admin
	docker-compose exec nodejs npm run build --prefix tests/Application/assets/admin

watch: ## Watch Sulu 2.x frontend assets for changes
	docker-compose exec nodejs npm run watch --prefix tests/Application/assets/admin

##
## Database
##---------------------------------------------------------------------------
.PHONY: db-reset db-fixtures

db-reset: ## Reset Sulu 2.x database completely
	@echo " Resetting database..."
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:database:drop --force --if-exists -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:database:create -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console doctrine:schema:create -e dev
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console sulu:build dev --destroy
	make db-fixtures

db-fixtures: ## Load database fixtures
	@echo " Database fixtures disabled - not available in this bundle"

##
## QA Tools
##---------------------------------------------------------------------------
.PHONY: validate phpstan psalm phpspec phpunit behat cs-fix

validate: ## Validate composer.json
	docker-compose exec php-v2 composer validate --ansi --strict

phpstan: ## Run PHPStan static analysis
	docker-compose exec php-v2 vendor/bin/phpstan analyse -c phpstan.neon -l max src/

psalm: ## Run Psalm static analysis
	docker-compose exec php-v2 vendor/bin/psalm

phpspec: ## Run PHPSpec tests
	docker-compose exec php-v2 vendor/bin/phpspec run --ansi -f progress --no-interaction

phpunit: ## Run PHPUnit tests
	docker-compose exec php-v2 vendor/bin/phpunit --colors=always

behat: ## Run Behat tests
	docker-compose exec php-v2 vendor/bin/behat --colors --strict -vvv --no-interaction

cs-fix: ## Fix code style issues
	docker-compose exec php-v2 vendor/bin/php-cs-fixer fix --allow-risky=yes

ci: validate phpstan psalm phpspec phpunit behat ## Run all CI tasks

##
## Bundle Development
##---------------------------------------------------------------------------
.PHONY: bundle-install bundle-test

bundle-install: ## Install this bundle in test application
	@echo " Installing bundle in test application..."
	docker-compose exec php-v2 php -d memory_limit=-1 tests/Application/bin/console sulu:bundle:install AkawakaSuluMultiCKEditorBundle

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

##
## Sulu 3.x (Application3)
##---------------------------------------------------------------------------
APP3 = tests/Application3
EXEC_V3 = docker-compose exec php-v3
CONSOLE_V3 = $(EXEC_V3) php -d memory_limit=-1 $(APP3)/bin/adminconsole
WCONSOLE_V3 = $(EXEC_V3) php -d memory_limit=-1 $(APP3)/bin/websiteconsole

.PHONY: install-v3 admin-v3 build-v3 watch-v3 db-reset-v3 console-v3

install-v3: start ## Install Sulu 3.x test application
	@echo " Installing Sulu 3.x test application..."
	sudo chmod -Rf 777 $(APP3)/var || true
	sudo chmod -Rf 777 $(APP3)/public/uploads || true
	docker-compose exec php-v3 git config --global --add safe.directory /srv/sulu
	docker-compose exec php-v3 sh -c "php -d memory_limit=-1 /usr/bin/composer install --no-interaction -d $(APP3)"
	@echo " Setting up database..."
	$(CONSOLE_V3) doctrine:database:drop --force --if-exists -e dev
	$(CONSOLE_V3) doctrine:database:create -e dev
	$(CONSOLE_V3) doctrine:schema:create -e dev
	$(CONSOLE_V3) sulu:build dev --destroy --no-interaction
	@echo " Fixing Loupe index permissions..."
	sudo chmod -Rf 777 $(APP3)/var || true
	@echo " Installing assets..."
	$(CONSOLE_V3) assets:install $(APP3)/public -e dev
	@echo " Building admin JS assets..."
	docker-compose exec nodejs npm install --prefix $(APP3)/assets/admin
	$(CONSOLE_V3) sulu:admin:update-build --no-interaction -e dev
	@echo " Warming up cache..."
	$(CONSOLE_V3) cache:clear -e dev
	$(WCONSOLE_V3) cache:clear -e dev
	@echo " Installation complete! Visit http://v3.localhost"

admin-v3: ## Create Sulu 3.x admin user
	$(CONSOLE_V3) sulu:user:create admin admin admin@example.com Admin Admin en admin

build-v3: ## Build Sulu 3.x frontend assets
	docker-compose exec nodejs npm install --prefix $(APP3)/assets/admin
	docker-compose exec nodejs npm run build --prefix $(APP3)/assets/admin

watch-v3: ## Watch Sulu 3.x frontend assets
	docker-compose exec nodejs npm run watch --prefix $(APP3)/assets/admin

db-reset-v3: ## Reset Sulu 3.x database
	@echo " Resetting Sulu 3.x database..."
	$(CONSOLE_V3) doctrine:database:drop --force --if-exists -e dev
	$(CONSOLE_V3) doctrine:database:create -e dev
	$(CONSOLE_V3) doctrine:schema:create -e dev
	$(CONSOLE_V3) sulu:build dev --destroy --no-interaction
	@echo " Fixing Loupe index permissions..."
	sudo chmod -Rf 777 $(APP3)/var || true

console-v3: ## Run a Sulu 3.x admin console command (usage: make console-v3 CMD="cache:clear")
	$(CONSOLE_V3) $(CMD)

-include Makefile.local
