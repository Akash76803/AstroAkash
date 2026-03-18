# AstroBud Node Astrology Service

This service is the Node.js backend for chart-based astrology reporting.

## What it does

- generates birth-chart based Kundli report payloads
- supports multilingual report output
  - Hindi
  - Marathi
  - English
  - Hinglish
- uses Swiss Ephemeris-based chart logic
- exposes permission-first report endpoints

## Current verified local URL

- `http://127.0.0.1:4102`

## Current endpoints

- `GET /health`
- `POST /api/v1/kundli/report`
- `POST /api/v1/compatibility/report`

## Current status

Working and verified:

- service build
- local startup
- health check
- detailed Kundli report response
- permission-first report flow
- pure-language permission prompts

Partially complete:

- compatibility report narrative depth
- full parity between Kundli and compatibility writers

## Install

```bash
cd server
npm install
```

## Windows prerequisites

`swisseph-v2` is a native Node addon. On Windows you need:

- Visual Studio Build Tools
- Desktop development with C++
- Windows SDK
- Python 3

Without these, `npm install` may fail during native build.

## Environment

Set:

```env
SWISSEPH_EPHE_PATH=./ephe
PORT=4102
```

`SWISSEPH_EPHE_PATH` must point to the Swiss Ephemeris data files directory.

## Run locally

```bash
npm run build
set PORT=4102&& npm run start
```

Sample chart script:

```bash
npm run sample:chart
```

## Notes

- The chart calculation layer is real and chart-grounded.
- The narrative layer is rule-based report writing on top of chart data.
- Kundli analysis is currently the most complete report flow in this service.
