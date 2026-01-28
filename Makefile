JUST ?= just

build-extension: ## Deprecated: use `just docker-build`
	@$(JUST) docker-build

install-extension: ## Deprecated: use `just install-extension`
	@$(JUST) install-extension

update-extension: ## Deprecated: use `just update-extension`
	@$(JUST) update-extension

help: ## Show just targets
	@$(JUST) --list

.PHONY: build-extension install-extension update-extension help
