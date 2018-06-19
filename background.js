var portFromCS;

function retrieve_title(obj){
    if(obj.title == undefined){
        return obj.original_name;
    }
    else{
        return obj.title;
    }
}
function connected(p) {
  portFromCS = p;
  console.log("connected to background script");
  portFromCS.onMessage.addListener(function(m) {
    console.log("selectedText: " +m.selectedText);
    var key="c5a28ebdd06f8663b366b08d3221cbf2";
    var responsestring = "";
    var url="https://api.themoviedb.org/3/search/person?include_adult=false&page=1&query="+m.selectedText.toString().split(" ").join("%20")+"&language=en-US&api_key="+key;
    fetch(url).then(function(response) {return response.json();}).then(function(data) {
        if(data.total_results == 0){
            responsestring = "Sorry, nothing found!";
            console.log("nothing found for that query");
        }
        else{
            titles = data.results[0].known_for.map(x=> retrieve_title(x));
            responsestring = titles.join(', ');
        }
        console.log(responsestring);
        portFromCS.postMessage({response: responsestring});
    });


  });
}
browser.runtime.onConnect.addListener(connected);



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




