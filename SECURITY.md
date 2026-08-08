# Security policy

## Reporting a vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/xcybplx/exceljs-community/security/advisories/new).
Please do not open a public issue for an unfixed vulnerability.

You should get an acknowledgement within 14 days.

## What is promised

A security release within **30 days** of a confirmed vulnerability in a
production dependency, in line with the commitment in the README.

Vulnerabilities in development dependencies (`grunt`, `eslint`, `mocha`,
`prettier`, `browserify` and similar) are handled on a best-effort basis. They
are not installed by users of this package and do not reach anyone's production
code. `npm audit` in this repository reports them; `npm audit --omit=dev` shows
what actually affects you.

## Supported versions

| Version | Supported |
|---|---|
| 4.5.x | yes |
| 4.4.x and earlier (upstream `exceljs`) | no — unmaintained since October 2023 |
