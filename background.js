(function() {
    var thresholdInMilliseconds = 500,        // TODO: Make configurable.
        lastRequest = null;

    /**
     * We're hooking into the tabs.onCreated event in order to figure out when tabs have been spawned via middle click
     * (and by other means). Alternatives:
     *
     * 1. webNavigation.onBeforeNavigate - Convenient as it provides a URL and timestamp for us. Problems/disadvantages:
     *        - Fires too late; after the tab has been spawned, after tabs.onCreated.
     *        - Need to ignore activity which doesn't spawn a new tab (e.g. repeated refreshes in current tab).
     *        - Need to ignore intra-tab navigation (i.e. navigation not triggered by a user; e.g. iframe/AJAX requests)
     */
    chrome.tabs.onCreated.addListener(function(tab) {
        sanctionTab(tab, generateTimestamp());
    });

    
    function generateTimestamp() {
        // We're doing this because the above event doesn't give us a timestamp and the alarms API isn't granular enough.
        return new Date().getTime();
    }


    /**
    * @param tab (chrome.tabs.Tab)
    */
    function sanctionTab(tab, timestamp) {
        // Ignore new blank tabs... they're all good.
        if (!tab.url)
            return;

        if (shouldCancel(tab.url, timestamp))
            chrome.tabs.remove(tab.id);
        else
            logRequest(tab.url, timestamp);
    }

    
    function shouldCancel(url, timestamp) {
        return lastRequest && lastRequest.url === url && thresholdInMilliseconds > (timestamp - lastRequest.timestamp);
    }


    function logRequest(url, timestamp) {
        lastRequest = { url: url, timestamp: timestamp };
    }
})();
