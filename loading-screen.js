/**
 * loading-screen.js
 * Drop-in animated loading screen matching the "Tools that actually Work" theme.
 *
 * USAGE:
 * Just add this one line near the top of <head> or right after <body> opens:
 *   <script src="loading-screen.js" defer></script>
 *
 * No other HTML or CSS changes needed — everything is injected automatically.
 * The screen hides itself once the page has fully loaded (or after a max
 * timeout, so it never gets stuck).
 */

(function () {
    "use strict";

    var MIN_DISPLAY_MS = 600;   // always show at least this long (avoids flashing)
    var MAX_DISPLAY_MS = 6000;  // hide no matter what after this long (safety net)

    var startTime = Date.now();

    function injectStyles() {
        var style = document.createElement("style");
        style.id = "ltyn-loading-styles";
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap');

            #ltyn-loading-overlay {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background-color: #fffae2;
                background-image: radial-gradient(circle, rgba(50,37,107,0.13) 1.4px, transparent 1.4px);
                background-size: 28px 28px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }
            #ltyn-loading-overlay.ltyn-hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            .ltyn-loading-text {
                font-family: 'Fraunces', serif;
                font-weight: 900;
                font-size: 2.5rem;
                color: #32256b;
                margin: 0 0 1.5rem 0;
                text-align: center;
            }

            .ltyn-loading-shapes {
                position: relative;
                width: 90px;
                height: 90px;
                margin-bottom: 1.5rem;
            }

            .ltyn-shape {
                position: absolute;
                top: 50%;
                left: 50%;
                border-radius: 50%;
            }
            .ltyn-shape:nth-child(1) {
                width: 90px;
                height: 90px;
                margin: -45px 0 0 -45px;
                border: 4px solid #32256b;
                border-top-color: transparent;
                animation: ltyn-spin 1.1s linear infinite;
            }
            .ltyn-shape:nth-child(2) {
                width: 56px;
                height: 56px;
                margin: -28px 0 0 -28px;
                border: 4px solid #ff8552;
                border-bottom-color: transparent;
                animation: ltyn-spin-rev 0.9s linear infinite;
            }
            .ltyn-shape:nth-child(3) {
                width: 16px;
                height: 16px;
                margin: -8px 0 0 -8px;
                background-color: #ffd23f;
                animation: ltyn-pulse 1s ease-in-out infinite;
            }

            @keyframes ltyn-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes ltyn-spin-rev {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            @keyframes ltyn-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.4); opacity: 0.6; }
            }

            .ltyn-loading-sub {
                font-family: 'Outfit', sans-serif;
                font-size: 0.95rem;
                color: #535353;
                letter-spacing: 0.02em;
            }

            @media (prefers-reduced-motion: reduce) {
                .ltyn-shape { animation: none !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function injectOverlay() {
        var overlay = document.createElement("div");
        overlay.id = "ltyn-loading-overlay";
        overlay.innerHTML =
            '<p class="ltyn-loading-text">Loading tools&hellip;</p>' +
            '<div class="ltyn-loading-shapes">' +
                '<div class="ltyn-shape"></div>' +
                '<div class="ltyn-shape"></div>' +
                '<div class="ltyn-shape"></div>' +
            '</div>' +
            '<p class="ltyn-loading-sub">Just a moment</p>';

        // Insert as the very first thing so it covers everything else immediately
        if (document.body) {
            document.body.insertBefore(overlay, document.body.firstChild);
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                document.body.insertBefore(overlay, document.body.firstChild);
            });
        }
    }

    function hideOverlay() {
        var overlay = document.getElementById("ltyn-loading-overlay");
        if (!overlay) return;

        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(function () {
            overlay.classList.add("ltyn-hidden");
            // Remove from DOM after the fade-out transition finishes
            setTimeout(function () {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 600);
        }, remaining);
    }

    // Inject styles + overlay as early as possible
    injectStyles();
    injectOverlay();

    // Hide once the page is fully loaded (images, fonts, etc.)
    window.addEventListener("load", hideOverlay);

    // Safety net: never let the overlay get stuck forever
    setTimeout(hideOverlay, MAX_DISPLAY_MS);
})();