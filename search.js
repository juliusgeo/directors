
  (function() {
    if (window.hasRun==true) {
        return;
    }
    window.hasRun = true;
    console.log("done");

    if (!window.x) {
        var x = {};
    }

    x.Selector = {};
    x.Selector.getSelected = function() {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    };

//initalize global variables
var pageX;
var pageY;
var myPort;
$(document).ready(function() {
    //connect to background.js
    console.log("attemping to connect to port");
    myPort = browser.runtime.connect({name:"port-from-cs"});
    console.log("connected to port");

    //initalize popup
    $("<ul class=\"directorspopup\">Sorry, nothing found!</ul>").appendTo("body");

    //add listener to handle response from background.js which will contain contents of popup
    myPort.onMessage.addListener(function(m) {
            //hide popup if no result was obtained for selected text
            if(m.response == "Sorry, nothing found!"){
                $('ul.directorspopup').html("");
                $('ul.directorspopup').fadeOut(0);
            }
            //update directorspopup with response, and fade in the directorspopup
            else{
                console.log(m.response);
                $('ul.directorspopup').html(m.response);
                $('ul.directorspopup').css({
                    'left': pageX + 5,
                    'top' : pageY - 55
                }).fadeIn(200);
            }
    });

    //function to handle sending the selected text to background.js
    function send_selectedtext(selt){
        try {
            myPort.postMessage({selectedText: selt});
        }
        catch{
            //attempts to reconnect to port if connection fails
            console.log("attemping to connect to port");
            myPort = browser.runtime.connect({name:"port-from-cs"});
            console.log("connected to port");
        }
    }
    $(document).bind("mouseup", function() {
        send_selectedtext(x.Selector.getSelected().toString());

    });
    $(document).on("mousedown", function(e){
        //on mousedown update the current coordinates to where the mouse is
        pageX = e.pageX;
        pageY = e.pageY;
        //if nothing is selected, hide the directorspopup
        if(x.Selector.getSelected().toString() == ''){
            $('ul.directorspopup').fadeOut(200);
        }
    });
});
})();





