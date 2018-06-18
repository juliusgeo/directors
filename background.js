

function handleMessage(request, sender, sendResponse){
    console.log("selectedText: " +request.selectedText);
    var key="c5a28ebdd06f8663b366b08d3221cbf2";
    var url="https://api.themoviedb.org/3/search/person?include_adult=false&page=1&query="+request.selectedText.toString().split(" ").join("%20")+"&language=en-US&api_key="+key+"";
    fetch(url).then(function(response) {return response.json();}).then(function(data) {
        movie1=data.results[0].known_for[0].title
        movie2=data.results[0].known_for[1].title
        movie3=data.results[0].known_for[2].title
        console.log(movie1, movie2, movie3);
    });
    setTimeout(() => {
    sendResponse({response: [movie1, movie2, movie3]});
    }, 1000);
    return true;
    //sendResponse({response: [movie1, movie2, movie3]});
};

browser.runtime.onMessage.addListener(handleMessage);


browser.browserAction.onClicked.addListener(function (tab) {
    // for the current tab, inject the "inject.js" file & execute it
    browser.runtime.onMessage.addListener(handleMessage);
    browser.tabs.executeScript({
        file: 'jquery-3.3.1.js',runAt: "document_start"
    });
    browser.tabs.executeScript({
        file: 'search.js',runAt: "document_start"
    });
    browser.tabs.insertCSS({
        file: 'style.css', runAt: "document_start"
    });
});




