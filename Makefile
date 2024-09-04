.DEFAULT_GOAL:=help

export PATH:=./node_modules/.bin/:$(PATH)

.PHONY: help
help: ## Display this help message
	@echo 'Usage: make <command>'
	@cat $(MAKEFILE_LIST) | grep '^[a-zA-Z]'  | \
	    sort | \
	    awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

.PHONY: clean
clean: ## Remove all build and dist folders
	rm -rf library/dist react-components-example/build

SRC_DIRS=library/src react-components-example/src

.PHONY: format
format: ## Run formatters in write mode: biome
	biome format --write ${SRC_DIRS}

.PHONY: check
check: format-check ts-check lint ## Run all checks/linters

.PHONY: format-check
format-check: ## Run formatters in check mode: biome
	biome format ${SRC_DIRS}

.PHONY: lint
lint: ## Run linters: biome
	biome lint

.PHONY: ts-check
ts-check: ## Run tsc in check mode
	tsc --project library
	tsc --project react-components-example --noEmit

node_modules/.package-lock.json: package.json react-components-example/package.json library/package.json
	npm install

.PHONY: install
install: node_modules/.package-lock.json ## Runs `npm i` if any package.json files has changed


.PHONY: libbuild
libbuild: libbuild-esm libbuild-cjs ## Build all modules

.PHONY: libbuild-cjs
libbuild-cjs: install ## Build CommonJS modules
	tsc --project library --module commonjs --outDir library/dist/cjs

.PHONY: libbuild-esm
libbuild-esm: install ## Build ES modules
	tsc --project library

.PHONY: run-demo
run-demo: libbuild-esm ## Start the demo application
	npm -w react-components-example run start

.PHONY: libbuild-dev
libbuild-dev: ## Run tsc in watcher mode
	tsc --project library --watch

.PHONY: test
test: ## Run tests
	npm -w library run test -- --passWithNoTests

.PHONY: publish
publish: libbuild ## Publish library to registry
	npm -w library publish --access public

.PHONY: setup
setup: ## Setup development environment
	@echo 'Requires pre-commit from https://pre-commit.com/'
	pre-commit install
