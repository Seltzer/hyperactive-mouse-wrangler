var extension = (function() {
    var lastRequest = null;

    return {
        logRequest: function(url, time) {
        }
    };
})();


chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    console.log('URL = ' + details.url);
    console.log('timestamp = ' + details.timeStamp);
    console.log('frameId = ' + details.frameId);
    console.log('parentFrameId = ' + details.parentFrameId);
    console.log('tabId = ' + details.tabId);


    return {
        cancel: true
        //redirectUrl: 'http://www.google.co.nz'
    };
}, null, ["blocking"]);
