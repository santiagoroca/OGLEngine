all:
	mkdir -p build
	cargo run
	g++ build/out.cpp -o build/main -lGL -lGLU -lglut
	#rm build/out.cpp
