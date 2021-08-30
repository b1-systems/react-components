.DEFAULT_GOAL:=help

export PATH:=./node_modules/.bin/:$(PATH)

.PHONY: help
help: ## Display this help message
	@echo 'Usage: make <command>'
	@cat $(MAKEFILE_LIST) | grep '^[a-zA-Z]'  | \
	    sort | \
	    awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

SRC_DIRS=library/src react-components-example/src

.PHONY: format
format: ## Run formatters in write mode: prettier
	prettier --write ${SRC_DIRS}

.PHONY: check
check: format-check ts-check lint ## Run all checks/linters

.PHONY: format-check
format-check: ## Run formatters in check mode: prettier
	prettier --check ${SRC_DIRS}

.PHONY: lint
lint: ## Run linters: eslint
	eslint ${SRC_DIRS} --cache --ext .js,.tsx,.ts,.json

.PHONY: ts-check
ts-check: ## Run tsc in check mode
	tsc --project library --noEmit
	tsc --project react-components-example --noEmit

.PHONY: libbuild
libbuild: libbuild-esm libbuild-cjs ## Build all modules

.PHONY: libbuild-cjs
libbuild-cjs: ## Build CommonJS modules
	tsc --project library --module commonjs --outDir dist/cjs

.PHONY: libbuild-esm
libbuild-esm: ## Build ES modules
	tsc --project library

.PHONY: run-demo
run-demo: ## Start the demo application
	npm -w react-components-example run start

.PHONY: libbuild-dev
libbuild-dev: ## Run tsc in watcher mode
	tsc --project library --watch

.PHONY: publish
publish: libbuild ## Publish library to registry
	npm -w library publish

.PHONY: setup
setup: ## Setup development environment
	@echo 'Requires pre-commit from https://pre-commit.com/'
	pre-commit install
