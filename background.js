(function() {
    var thresholdInMilliseconds = 500,        // TODO: Make configurable.
        lastRequest = null;

    chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
        // We only care about user instigated navigation which launches new tabs/windows, not iframe / AJAX requests.
        if (details.parentFrameId !== -1) 
            return;

        if (shouldCancel(details.url, details.timeStamp))
            chrome.tabs.remove(details.tabId);
        else
            logRequest(details.url, details.timeStamp);
    }, null, ["blocking"]);

    
    function shouldCancel(url, timeStamp) {
       return lastRequest && lastRequest.url === url && thresholdInMilliseconds > (timeStamp - lastRequest.timeStamp);
    }


    function logRequest(url, timeStamp) {
        lastRequest = { url: url, timeStamp: timeStamp };
    }
})();
