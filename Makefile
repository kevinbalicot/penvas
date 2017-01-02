DIST_DIR = ./dist
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/penvas.js

build: $(BIN_FILE)

clean:
	rm -rf ./node_modules $(DIST_DIR)

doc: node_modules
	${BIN_DIR}/esdoc

test: node_modules
	$(BIN_DIR)/mocha ./test

.PHONY: build clean doc

node_modules: package.json
	npm install --ignore-scripts

$(DIST_DIR):
	mkdir -p $@

$(BIN_FILE): $(DIST_DIR) node_modules
	$(BIN_DIR)/browserify src/index.js -o $(BIN_FILE) -t [ babelify ]
