DIST_DIR = ./dist
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/penvas.js
BIN_FILE_MIN = $(DIST_DIR)/penvas.min.js

.PHONY: build-dev
build-dev: $(DIST_DIR) node_modules
	$(BIN_DIR)/browserify src/index.js -d -o $(BIN_FILE) -t [ babelify ]

.PHONY: build
build: build-dev
	$(BIN_DIR)/browserify src/index.js -t [ babelify ] | $(BIN_DIR)/uglifyjs --keep-fnames -c -o $(BIN_FILE_MIN)

.PHONY: watch
watch: $(DIST_DIR) node_modules
	$(BIN_DIR)/watchify src2/index.js -v -d -o $(BIN_FILE) -t [ babelify ]

.PHONY: clean
clean:
	rm -rf ./node_modules && rm -rf $(DIST_DIR)

node_modules: package.json
	npm install --ignore-scripts

$(DIST_DIR):
	mkdir -p $@
