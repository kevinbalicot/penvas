DIST_DIR = ./dist
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/penvas.js

build: $(DIST_DIR) node_modules
	$(BIN_DIR)/browserify src/index.js -o $(BIN_FILE) -t [ babelify ]

clean:
	rm -rf ./node_modules

doc: node_modules
	${BIN_DIR}/esdoc

test: node_modules
	$(BIN_DIR)/mocha ./test

.PHONY: build clean doc test

node_modules: package.json
	npm install --ignore-scripts

$(DIST_DIR):
	mkdir -p $@
