SHELL = /bin/sh

.PHONY: frameworks src test doc clean-src clean-doc

all:	src doc

clean:	clean-src clean-doc

standalone:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C frameworks src)
	@($(MAKE) -C src standalone)

frameworks:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C frameworks all)

src:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C src src)

test:	frameworks
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C test test)

doc:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C frameworks doc)
	@($(MAKE) -C src doc)

clean-src:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C frameworks clean)
	@($(MAKE) -C src clean)

clean-doc:
	@echo "--> $(MAKE) $(MFLAGS) $@"
	@($(MAKE) -C frameworks clean-doc)
	@($(MAKE) -C src clean-doc)
