DIST_DIR = ./dist
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/penvas.js
DEMO_DIR = ./demo

build: $(BIN_FILE)

clean:
	rm -rf ./node_modules $(DIST_DIR)

demo: build
	cp $(BIN_FILE) $(DEMO_DIR) && $(BIN_DIR)/http-server $(DEMO_DIR)

test: node_modules
	$(BIN_DIR)/mocha ./test

.PHONY: build clean demo

node_modules: package.json
	npm install --ignore-scripts

$(DIST_DIR):
	mkdir -p $@

$(BIN_FILE): $(DIST_DIR) node_modules
	$(BIN_DIR)/browserify src/index.js -o $(BIN_FILE) -t [ babelify ]
