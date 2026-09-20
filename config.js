// Empty on GitHub Pages: show an explicit link to the original Grok multiplayer site.
// Set only to your own trusted HTTPS signaling service implementing the existing RTC protocol.
// It must allow this site's Origin, GET and POST, and the content-type header via CORS.
// Do not put credentials here. This is a public file.
window.ODD_CONFIG = Object.freeze({signalingEndpoint: ''});
