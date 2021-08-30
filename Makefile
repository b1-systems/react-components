.DEFAULT_GOAL:=help

.PHONY: help
help: ## Display this help message
	@echo 'Usage: make <command>'
	@cat $(MAKEFILE_LIST) | grep '^[a-zA-Z]'  | \
	    sort | \
	    awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

.PHONY: format
format: ## Run formatters in write mode: prettier
	./node_modules/.bin/prettier --write src

.PHONY: check
check: format-check ts-check lint ## Run all checks/linters

.PHONY: format-check
format-check: ## Run formatters in check mode: prettier
	./node_modules/.bin/prettier --check src

.PHONY: lint
lint: ## Run linters: eslint
	./node_modules/.bin/eslint src --cache --ext .js,.tsx,.ts,.json

.PHONY: ts-check
ts-check: ## Check Typescript correctness
	./node_modules/.bin/tsc --noEmit

.PHONY: setup
setup: ## Setup development environment
	@echo 'Requires pre-commit from https://pre-commit.com/'
	pre-commit install
