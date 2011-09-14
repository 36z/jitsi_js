SRC = core.js base.js util.js archive.js applet.js \
	mixins/registration_handler.js \
        services/*.js items/*.js \
	connection.js

DOCDIR = ../docs

JSDOCDIR = ../frameworks/jsdoc-toolkit
TEMPLATE = $(JSDOCDIR)/templates/jitsi

JAVA =	java

all:	src doc

src:	jitsi.js

jitsi.js:	Makefile $(SRC)
	cat $(SRC) > ../$@

doc:	$(DOCDIR)/index.html

$(DOCDIR)/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js --allfunctions --private -a -t=$(TEMPLATE) -d=$(DOCDIR) $(SRC)

clean-doc:
	rm -rf $(DOCDIR)

clean:
	rm -f ../jitsi.js
