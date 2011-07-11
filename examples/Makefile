ENGINE = engine/array.js engine/string.js engine/formatter.js engine/view.js
CSS = styles/dialer.css styles/dialpad.css styles/open-line.css

all:	js css

css:	Makefile $(CSS)
	cat $(CSS) > styles.css

js:	Makefile $(ENGINE)
	cat $(ENGINE) > engine.js

clean:
	rm engine.js styles.css
