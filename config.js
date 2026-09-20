// GitHub Pages: leave signalingEndpoint empty (no RTC backend).
// Grok preview ignores this file's empty default via same-origin /api/rtc.
// Set only a trusted HTTPS signaling service that implements the existing RTC protocol.
window.ODD_CONFIG = Object.freeze({ signalingEndpoint: "" });
