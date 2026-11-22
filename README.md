# Akshar (अक्षर)

A minimalistic Nepali typing test. Type Devanagari with the Nepali Unicode
(romanized) or Nepali Traditional keyboard from any physical keyboard, or switch
to English and dozens of other languages.

**Live:** https://akshar.rojanacharya.com

Akshar is a fork of [Monkeytype](https://github.com/monkeytypegame/monkeytype)
by [Miodec](https://github.com/Miodec) and the
[Monkeytype contributors](https://github.com/monkeytypegame/monkeytype/graphs/contributors),
released under the same [GPL-3.0](LICENSE) license. See [Credits](#credits).

## Features

- **Nepali first.** `nepali unicode` is preselected. The language list starts with:
  - `nepali unicode`: Nepali Unicode (romanized) keyboard, emulated from any keyboard
  - `nepali traditional`: Nepali Traditional keyboard, emulated from any keyboard
  - `nepali` / `nepali 1k`: type with your own system keyboard or IME
  - `nepali romanized`: Nepali written in Latin letters
- **English and every upstream language** remain one click away.
- **Frontend only.** No accounts, no server, no tracking. Results history,
  personal bests, settings, theme and font are stored in your browser
  (localStorage).
- **Anticheat in the browser.** Synthetic keystrokes and robotic timing
  invalidate a result, so it never becomes a personal best.
- **Everything Monkeytype does well:** time, words, quote, zen and custom modes,
  punctuation and numbers, live speed and accuracy, themes, sounds, smooth caret,
  funboxes.
- **SEO landing pages** in Nepali and English, plus `sitemap.xml`, `robots.txt`
  and `llms.txt`, generated at build time.

## Development

Requires Node 24 (`.nvmrc`) and pnpm (`corepack enable`).

```bash
pnpm install
pnpm dev-fe        # http://localhost:3000
```

Checks (from `frontend/`): `pnpm oxlint --type-aware --type-check` and
`npx vitest run`. Full guide: [docs/CONTRIBUTING_ADVANCED.md](docs/CONTRIBUTING_ADVANCED.md).

## Deploy

Static site, no environment variables needed. See [DEPLOY.md](DEPLOY.md).

## Contributing

Bug reports, Nepali word fixes, quotes and layout corrections are welcome. Start
with [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). PR titles follow
[Conventional Commits](https://www.conventionalcommits.org).

Security issues: see [docs/SECURITY.md](docs/SECURITY.md).

## Credits

Akshar would not exist without [Monkeytype](https://monkeytype.com). The typing
engine, test modes, themes, sounds, fonts, languages, layouts and most of the UI
are their work.

- [Miodec](https://github.com/Miodec), creator of Monkeytype
- All [Monkeytype contributors](https://github.com/monkeytypegame/monkeytype/graphs/contributors)
  for features, themes, languages, quotes and fixes
- If you enjoy Akshar, consider [supporting Monkeytype](https://www.patreon.com/monkeytype)

Third-party fonts and assets keep their own licenses (see `frontend/static/webfonts`
and [docs/FONTS.md](docs/FONTS.md)).

## License

[GPL-3.0](LICENSE). Akshar is a modified version of Monkeytype; what changed is
listed in [NOTICE.md](NOTICE.md). Any redistribution must keep this license and
publish its source.
