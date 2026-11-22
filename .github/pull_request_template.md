### Description

<!-- What changed and why. Link issues with "Closes #123". -->

### Checks

- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org) (see `docs/CONTRIBUTING.md`), e.g. `feat(quotes): add nepali quotes`
- [ ] `pnpm oxlint --type-aware --type-check` and `npx vitest run` pass in `frontend/`
- [ ] UI changes: screenshots attached, checked at phone width
- [ ] Language / quote / layout / theme: added to the `_list` (and `_groups`) files, valid JSON
- [ ] Nepali text uses Unicode Devanagari (no legacy Preeti-style fonts)
