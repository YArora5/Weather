# Weather App

A small vanilla JavaScript weather app using OpenWeather current conditions. It supports city search, browser geolocation, temperature, feels-like temperature, humidity, wind, and condition-based backgrounds.

## Run locally

1. Get an OpenWeather API key.
2. Copy `config.example.js` to `config.js` and set `window.WEATHER_API_KEY`.
3. Open `index.html` through a local static server. Browser geolocation generally requires localhost or HTTPS.

## Security note

Browser-side API keys are visible to visitors. Restrict the key to the required API and allowed referrers where supported, monitor usage, and use a server-side proxy for production. The previous key was committed to a public repository; rotate it in the OpenWeather dashboard. Moving it to `config.js` does not remove the old value from Git history.

## Limitations and next steps

This is a frontend prototype. Add automated tests, accessible status announcements, request cancellation, unit preferences, and a backend proxy before treating it as production-ready.
