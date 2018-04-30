chrome.browserAction.onClicked.addListener(tab => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    focused: true,
    width: 435,
    height: 145
  });
});

function get_display_time (request) {
    var display_time = 500;
    var tip = parseInt(request.tip.replace(/\D/g,''));
    switch(request.source) {
        case "amateurtv":
            if (tip <= 1000) {
                display_time = tip * 5;
            } else if (tip > 1000) {
                display_time = 5000 + ((tip - 1000)  / 2);   
            }
            break;
        case "chaturbate":
            if (tip > 10 && tip <= 100) {
                display_time = tip * 50;
            } else if (tip > 100 && tip <= 1000) {
                display_time = 5000 + ((tip - 100) * 5);
            } else if (tip > 1000) {
                display_time = 10000 + (tip - 1000);
            }    
            break;
    }
    return display_time;
}

function display_notification (request) {
    var display_time = get_display_time(request);
    var user = request.user.substr(0, 19);
    $(".username").html("<span class=\"notification_text\">" + user + "</span>");
    $(".coins").html("<img scr=\"coin.gif\"><span class=\"notification_text\">" + request.tip + "</span>");
    $(".name" ).fadeIn("slow", function() {
        setTimeout(function (){$(".name" ).fadeOut("slow");}, display_time);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request.user + " " + request.tip);
    display_notification(request);
});

window.onload = function(){
    document.getElementById("test_button").addEventListener("click", function(){
        console.log("test tip");
        var request = {};
        request.user = "test"
        request.tip = "test"
        request.source = "test"
        display_notification(request);
    });
}