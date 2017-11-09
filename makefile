# Makefile autogenerated by Dyi on August 31, 2017
#
# Main target: all
# Sources:  src/index.js  src/postJson.js  src/test.js 

.DEFAULT_GOAL := all


.PHONY: docs
docs: k-54flbexi k-k2ks2fvi k-ioq15b7b k-u1tl9lfj k-lfy221yl k-d22r6b8i


.PHONY: debug
debug: k-8b9n4cps


.PHONY: c-xmv0jn19
c-xmv0jn19: lib/index.js lib/postJson.js lib/test.js


.PHONY: build
build: c-xmv0jn19


.PHONY: test
test: k-w5o7abvw k-uxye9rwa


.PHONY: update
update: k-wois6lwu


.PHONY: major
major: k-xht3phgx k-maqle27q k-xk76u5ji


.PHONY: minor
minor: k-7fvxc768 k-p56i8lwp k-waao8fim


.PHONY: patch
patch: k-muh35efb k-avcua3pi k-bmusvhai


.PHONY: prepare
prepare: lib




.PHONY: k-54flbexi
k-54flbexi:  
	./node_modules/.bin/git-hist history.md


.PHONY: k-k2ks2fvi
k-k2ks2fvi:  
	./node_modules/.bin/mustache package.json docs/readme.md | ./node_modules/.bin/stupid-replace '~USAGE~' -f docs/usage.md > readme.md


.PHONY: k-ioq15b7b
k-ioq15b7b:  
	cat history.md >> readme.md


.PHONY: k-u1tl9lfj
k-u1tl9lfj:  
	mkdir -p ./man/man1


.PHONY: k-lfy221yl
k-lfy221yl:  
	pandoc -s -f markdown -t man readme.md > ./man/man1/vz-biblio2json.1


.PHONY: k-d22r6b8i
k-d22r6b8i:  
	hub cm 'update docs and history.md'


.PHONY: k-8b9n4cps
k-8b9n4cps:  
	make && node ./index.js convert ./test/biblio.bib


.PHONY: k-mk01ea5x
k-mk01ea5x:  
	((echo '#!/usr/bin/env node') && cat ./lib/index.js) > index.js


.PHONY: k-6futd0ui
k-6futd0ui:  
	chmod +x ./index.js


.PHONY: all
all: 
	make build 
	make k-mk01ea5x 
	make k-6futd0ui  


.PHONY: k-w5o7abvw
k-w5o7abvw:  
	make all


.PHONY: k-uxye9rwa
k-uxye9rwa:  
	./node_modules/.bin/mocha ./lib/test.js


.PHONY: k-wois6lwu
k-wois6lwu:  
	make clean && ./node_modules/.bin/babel configure.js | node


.PHONY: k-xht3phgx
k-xht3phgx:  
	make all


.PHONY: k-maqle27q
k-maqle27q:  
	make docs


.PHONY: k-xk76u5ji
k-xk76u5ji:  
	./node_modules/.bin/xyz -i major


.PHONY: k-7fvxc768
k-7fvxc768:  
	make all


.PHONY: k-p56i8lwp
k-p56i8lwp:  
	make docs


.PHONY: k-waao8fim
k-waao8fim:  
	./node_modules/.bin/xyz -i minor


.PHONY: k-muh35efb
k-muh35efb:  
	make all


.PHONY: k-avcua3pi
k-avcua3pi:  
	make docs


.PHONY: k-bmusvhai
k-bmusvhai:  
	./node_modules/.bin/xyz -i patch


.PHONY: clean
clean:  
	rm -f lib/index.js
	rm -f lib/postJson.js
	rm -f lib/test.js




lib/index.js: src/index.js 
	./node_modules/.bin/babel src/index.js -o ./lib/index.js

lib/postJson.js: src/postJson.js 
	./node_modules/.bin/babel src/postJson.js -o ./lib/postJson.js

lib/test.js: src/test.js 
	./node_modules/.bin/babel src/test.js -o ./lib/test.js

lib: 
	mkdir -p lib

