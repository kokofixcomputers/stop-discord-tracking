// ==UserScript==
// @name         Discord Endpoint Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
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


    console.log('Endpoint blocking script loaded. Requests to the specified endpoints will get canceled.');
})();
