var portFromCS;

function retrieve_title(obj){
    //function to help map values from response to titles
    //needed because for tv shows, the title is stored under original_name not title
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
  //add listener for messages from content script
  portFromCS.onMessage.addListener(function(m) {
    //sets up REST api details
    var key="c5a28ebdd06f8663b366b08d3221cbf2";
    var responsestring = "";
    var url="https://api.themoviedb.org/3/search/person?include_adult=false&page=1&query="+m.selectedText.toString().split(" ").join("%20")+"&language=en-US&api_key="+key;

    //fetches search results from TMDb API
    fetch(url).then(function(response) {return response.json();}).then(function(data) {
        //checks to make sure that there are search results for that query
        if(data.total_results == 0){
            responsestring = "Sorry, nothing found!";
        }
        //sets responsestring to concatenated string from array
        else{
            //map is used to convert the array of json objects to array of title or original_name values
            titles = data.results[0].known_for.map(x=> retrieve_title(x));
            responsestring = titles.join(', ');
        }
        //sends responsestring to content script so it can be displayed
        portFromCS.postMessage({response: responsestring});
    });


  });
}
browser.runtime.onConnect.addListener(connected);



browser.browserAction.onClicked.addListener(function (tab) {
    //on page load, inject content scripts and style
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




