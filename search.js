
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
    var myPort = browser.runtime.connect({name:"port-from-cs"});
    $("<ul class=\"tools\">Nothing found! Unfortunately</ul>").appendTo("body");
    console.log($('body').html());
    $(document).bind("mouseup", function() {
        var selectedText = x.Selector.getSelected();
        function handleResponse(message) {
            console.log(response);
            $('ul.tools').html(message.response[0]+message.response[1]+message.response[2]);
        }
        function handleError(error) {
          console.log(`${error}`);
        }
        function notifyBackgroundPage(e) {
          browser.runtime.sendMessage({selectedText: selectedText.toString()}).then(handleResponse, handleError);
        }
        window.addEventListener("mouseup", notifyBackgroundPage);
        if(selectedText != ''){
            $('ul.tools').css({
                'left': pageX + 5,
                'top' : pageY - 55
            }).fadeIn(200);
        } else {
            $('ul.tools').fadeOut(200);
        }
    });
    $(document).on("mousedown", function(e){
        pageX = e.pageX;
        pageY = e.pageY;
        console.log(pageX, pageY);
    });
});
})();





