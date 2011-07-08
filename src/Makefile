SRC = core.js base.js user_agent.js registration.js call.js

all:	src doc

src:	jitsi.js

jitsi.js:	Makefile $(SRC)
	cat $(SRC) > ../$@
