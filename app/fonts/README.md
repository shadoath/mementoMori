# Fonts

These are vendored rather than pulled from Google Fonts at build time.
`next/font/google` fetches font files from `fonts.gstatic.com` during
`next build`, so a single slow response fails the whole deploy — which is
exactly what happened once EB Garamond and Cinzel were added alongside Inter
(`ETIMEDOUT` on `fonts.gstatic.com`). Serving them from the repo makes the
build hermetic. Runtime behaviour is unchanged; `next/font` self-hosts either
way.

Each file is the **latin** subset only, in the same variable-font form Google
serves to modern browsers.

| File | Family | Axes |
| --- | --- | --- |
| `cinzel-latin.woff2` | Cinzel | weight 400–900 |
| `eb-garamond-latin.woff2` | EB Garamond | weight 400–800 |
| `eb-garamond-latin-italic.woff2` | EB Garamond italic | weight 400–800 |
| `inter-latin.woff2` | Inter | weight 100–900 |

All three families are licensed under the SIL Open Font License 1.1; see
`OFL.txt`. Copyright holders:

- Cinzel — Natanael Gama (https://github.com/NDISCOVER/Cinzel)
- EB Garamond — The EB Garamond Project Authors (https://github.com/octaviopardo/EBGaramond12)
- Inter — The Inter Project Authors (https://github.com/rsms/inter)

To refresh a file, take the `/* latin */` `@font-face` block from the family's
`fonts.googleapis.com/css2` response and download the `.woff2` it points at.
