// ==UserScript==
// @name         Discord Endpoint Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Stop discord from tracking you.
// @author       kokofixcomputers
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the endpoints to block
    const blockedEndpoints = [
        'https://discord.com/api/v9/science',
        'https://discord.com/api/v9/metrics/v2',
        'https://discord.com/error-reporting-proxy/web'
    ];

    // Create a new XMLHttpRequest object to intercept requests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedEndpoints.includes(url)) {
            console.log(`Blocked request to ${url}`);
            this.status = 500;
            this.responseText = 'Internal Server Error';
            this.dispatchEvent(new Event('load'));
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    console.log('Discord Extension Script loaded via Tampermonkey.');
    console.log('Visit: https://github.com/kokofixcomputers/stop-discord-tracking/tree/main');
    console.log('for more info.');

    // Function to add the status message
    function addStatusMessage(targetDiv) {
        if (!targetDiv.querySelector('.discord-tracking-blocker-status')) {
            const statusSpan = document.createElement('span');
            statusSpan.className = 'text-xs/normal_cf4812 line__2debe discord-tracking-blocker-status';
            statusSpan.dataset.textVariant = 'text-xs/normal';
            statusSpan.style.color = 'var(--text-muted)';
            statusSpan.textContent = 'Discord Tracking Blocker Loaded';
            targetDiv.appendChild(statusSpan);
        }
    }

    // Function to start observing for DOM changes
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const targetDiv = document.querySelector('div.info__2debe[data-mtctest-ignore="true"]');
                    if (targetDiv) {
                        addStatusMessage(targetDiv);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the observer
    startObserver();

})();
