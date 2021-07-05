migration:
	npm run migration-generate $(name)

migration-create:
	npm run migration-create $(name)

migration-run:
	npm run migration-run

migration-revert:
	npm run migration-revert

start:
	docker-compose up -d

stop:
	docker-compose down

