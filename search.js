
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


var pageX;
var pageY;

$(document).ready(function() {
    console.log("attemping to connect to port");
    var myPort = browser.runtime.connect({name:"port-from-cs"});
    console.log("connected to port");
    $("<ul class=\"tools\">Nothing found! Unfortunately</ul>").appendTo("body");
    myPort.onMessage.addListener(function(m) {
            if(m.response == "Sorry, nothing found!"){
                $('ul.tools').html("");
                $('ul.tools').fadeOut(0);
            }
            else{
                console.log(m.response);
                $('ul.tools').html(m.response);
                $('ul.tools').css({
                    'left': pageX + 5,
                    'top' : pageY - 55
                }).fadeIn(200);
            }

    });
    function send_selectedtext(selt){
        myPort.postMessage({selectedText: selt});
    }
    $(document).bind("mouseup", function() {
        send_selectedtext(x.Selector.getSelected().toString());

    });
    $(document).on("mousedown", function(e){
        pageX = e.pageX;
        pageY = e.pageY;
        if(x.Selector.getSelected().toString() == ''){
            $('ul.tools').fadeOut(200);
        }
        console.log(pageX, pageY);
    });
});
})();





