SHELL = /bin/sh

.PHONY: frameworks src test doc clean-src clean-doc

all:	src doc

clean:	clean-src clean-doc

src:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C src src)

doc:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C src doc)

clean-src:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C src clean)

clean-doc:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C src clean-doc)
