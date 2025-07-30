# Docker Development Environment for Sulu Multi CKEditor Bundle

This Docker configuration provides a complete development environment for testing the Sulu Multi CKEditor Bundle without manually integrating it into an existing project.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Make installed (optional, but recommended)

### Installation and Setup

1. **Start the development environment:**
   ```bash
   make install
   ```
   
   This command will:
   - Start all Docker services (PHP, MySQL, Elasticsearch, Node.js, MailHog)
   - Install PHP and Node.js dependencies
   - Create and setup the database
   - Build Sulu admin interface
   - Install assets and load fixtures
   - Create the default admin user

2. **Access the application:**
   - **Frontend**: http://localhost:8080
   - **Sulu Admin**: http://localhost:8080/admin
     - Username: `admin`
     - Password: `admin`
   - **MailHog**: http://localhost:8025 (for testing emails)

##  Available Commands

### Project Management
```bash
make start          # Start all Docker services
make stop           # Stop all services
make restart        # Restart all services
make clean          # Complete cleanup (removes containers, volumes, files)
make status         # Show service status
```

### Development
```bash
make shell          # Access PHP container shell
make logs           # Show PHP container logs
make build          # Build frontend assets
make watch          # Watch frontend assets for changes
```

### Database
```bash
make db-reset       # Reset database completely
make db-fixtures    # Load database fixtures
make admin          # Create Sulu admin user (admin/admin)
```

### Quality Assurance
```bash
make validate       # Validate composer.json
make phpstan        # Run PHPStan static analysis
make psalm          # Run Psalm static analysis
make phpspec        # Run PHPSpec tests
make phpunit        # Run PHPUnit tests
make behat          # Run Behat tests
make cs-fix         # Fix code style issues
make ci             # Run all CI tasks
```

### Bundle Development
```bash
make bundle-install # Install this bundle in test application
make bundle-test    # Test bundle functionality
```

##  Architecture

### Services
- **PHP 8.1**: Application container with Symfony CLI
- **MySQL 8.0**: Database with health checks
- **Elasticsearch 7.17**: Search engine for Sulu
- **Node.js 18**: Frontend asset building
- **MailHog**: Email testing tool

### Directory Structure
```
tests/Application/
├── bin/console                 # Symfony console
├── config/
│   ├── packages/sulu.yaml     # Sulu configuration
│   ├── services.yaml          # Service configuration
│   ├── routes.yaml            # Route configuration
│   ├── templates/pages/       # Page templates
│   └── webspaces/            # Webspace configuration
├── public/index.php           # Application entry point
├── src/Kernel.php             # Application kernel
├── templates/pages/           # Twig templates
├── .env                       # Environment variables
├── composer.json              # PHP dependencies
├── package.json               # Node.js dependencies
└── webpack.config.js          # Asset building
```

### Bundle Integration
The bundle is automatically registered in the test application and provides:
- **Multi Text Editor Type**: `multi_text_editor` content type
- **Test Simple Type**: `test_simple` content type for testing
- **Admin Interface**: JavaScript components for Sulu admin
- **Templates**: Example templates using the bundle

## Testing the Bundle

1. **Access the Sulu Admin**: http://localhost:8080/admin
2. **Create a new page** using the "Default" template
3. **Test the content types**:
   - Use the "Multi CKEditor" field to test multiple editor configurations
   - Use the "Simple Test" field to test the basic functionality
4. **View the result** on the frontend: http://localhost:8080

## Debugging

### View Logs
```bash
make logs                    # PHP application logs
docker-compose logs mysql    # MySQL logs
docker-compose logs nodejs   # Node.js logs
```

### Access Containers
```bash
make shell                          # PHP container
docker-compose exec mysql bash     # MySQL container
docker-compose exec nodejs sh      # Node.js container
```

### Database Access
```bash
# Access MySQL directly
docker-compose exec mysql mysql -u sulu -psulu sulu_test
```

## Customization

### Environment Variables
Edit `tests/Application/.env` to customize:
- Database connection
- Sulu admin email
- Application environment

### Adding Content Types
1. Create templates in `tests/Application/config/templates/pages/`
2. Add the new content types from the bundle
3. Create corresponding Twig templates in `tests/Application/templates/pages/`

### Bundle Development
The bundle source code is mounted as a volume, so changes are immediately reflected:
1. Modify bundle files in `src/`
2. Clear cache: `docker-compose exec php tests/Application/bin/console cache:clear`
3. Rebuild admin assets if needed: `docker-compose exec php tests/Application/bin/console sulu:build dev`

## Troubleshooting

### Common Issues

**Permissions Error:**
```bash
sudo chmod -Rf 777 tests/Application/var tests/Application/public/uploads
```

**Database Connection Error:**
```bash
make db-reset
```

**Assets Not Loading:**
```bash
make build
```

**Services Not Starting:**
```bash
make clean
make install
```

### Reset Everything
If you encounter any issues, you can completely reset the environment:
```bash
make clean
make install
```

This will remove all containers, volumes, and generated files, then reinstall everything from scratch.

## Development Workflow

1. **Make changes** to the bundle source code in `src/`
2. **Test changes** by accessing http://localhost:8080/admin
3. **Run quality checks**: `make bundle-test`
4. **View logs** if needed: `make logs`
5. **Reset if needed**: `make db-reset`

The Docker environment provides a complete, isolated development setup that mirrors a real Sulu installation, making it easy to develop and test the bundle without affecting your main development environment.
