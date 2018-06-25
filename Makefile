all:
	mkdir -p build
	cargo run
	cp build/out.js client/src/bundle.js
	#rm build/out.cpp
