# Notice

Akshar is a modified version of **Monkeytype**
(https://github.com/monkeytypegame/monkeytype), Copyright © Miodec and the
Monkeytype contributors, licensed under the GNU General Public License v3.0.

Modifications Copyright © 2026 Rojan Acharya, also licensed under GPL-3.0.

## Modifications (2026-11)

Forked from upstream commit `9c3a9ce` and changed as follows:

- Rebranded to Akshar (अक्षर); Nepali (`nepali unicode`) is the default language.
- Added Nepali Unicode (romanized) and Nepali Traditional keyboard emulation,
  Nepali word lists, Nepali custom-text defaults and quote support for Nepali.
- Removed the backend and everything that depended on it: accounts, login,
  leaderboards, friends, profiles, notifications, presets, tags, quote rating,
  ads, analytics and Firebase.
- Results, personal bests and settings are stored in localStorage.
- Anticheat runs in the browser.
- Added static SEO landing pages and generated sitemap, robots.txt and llms.txt.
- Replaced deploy, CI and repository configuration for static hosting on Vercel.

The full upstream history is available in the Monkeytype repository.
