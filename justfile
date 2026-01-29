image := "dive-in:dev"
extension_image := "prakhar1989/dive-in"
tag := "dev"

ui-dev:
  npm --prefix ui run dev

ui-build:
  npm --prefix ui run build

ui-test:
  npm --prefix ui run test

ui-lint:
  npm --prefix ui run lint

vm-test:
  cd vm && go test ./...

vm-vet:
  cd vm && go vet ./...

docker-build:
  docker build -t {{image}} .

extension-validate:
  docker extension validate .

install-extension:
  docker extension install {{extension_image}}:{{tag}}

update-extension:
  docker extension update {{extension_image}}:{{tag}} --force

reinstall-development-extension:
  docker build -t {{image}} . ; docker extension update {{image}} --force
