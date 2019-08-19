# Monthly-mix
The latest music from the past month delivered to your inbox

## Requirements
- Node 10.16.0 or greater
- A YouTube Data API key

Get additional dependencies with `npm install`

## Development
Before developing duplicate the `config.example.json` file and populate with values. Only the YouTube value (a key for the YouTube Data API) is required to develop locally.

For the first time grab the latest data using `npm run data`

Give it a bit of `npm run start` to watch for `html`, `sass` and `js` changes.

If for any reason you need grab fresh data use `npm run fresh-data`, which will nuke the locally saved data and fetch all playlists from YouTube again.
