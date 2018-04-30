// ==UserScript==
// @name           Buniscript
// @description    This script sends messages on chatroom message posting
// @author         Matarredona
// @version        1.0
// @namespace      amateur.tv
// @run-at         window-load
// @match          "https://www.amateur.tv/cam/amateur/*", "https://*chaturbate.com/*"
// ==/UserScript==

console.log("!!!buniscript injected");
NodeList.prototype.forEach = Array.prototype.forEach;
var re_user = new RegExp ( "<a.*\">(.*)</a>");
var re_tip = new RegExp ( "<ins.*\">(.*)</ins>");
var re_tip_cb = new RegExp ( "tipped (.*) token");

var amateurtv_observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (new_chat_node) {
            var node_classes = new_chat_node.classList;
            node_classes.forEach(function (node_class) {
                if (node_class == "msg-type--monedasP") {
                    var content = new_chat_node.childNodes[1].innerHTML;
                    var message = {};
                    message.source = "amateurtv";
                    message.tip = re_tip.exec(content)[1];
                    message.user = re_user.exec(content)[1];
                    if (message.user == "Usuario Ninja") {
                        message.user = "";
                    }
                    console.log(message.user + " " + message.tip);
                    chrome.runtime.sendMessage(message);
               }
            });
        });
    });
});

var chaturbate_observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (new_chat_node) {
            if (new_chat_node.childNodes[0].childNodes[0].className == "tipalert") {
                var message = {};
                message.source = "chaturbate";
                message.user = new_chat_node.childNodes[0].childNodes[0].childNodes[0].innerHTML;
                message.tip = re_tip_cb.exec(new_chat_node.childNodes[0].childNodes[0].innerHTML)[1];
                console.log(message.user + " " + message.tip);
                chrome.runtime.sendMessage(message);
            }
        });
    });
});

document.querySelectorAll('.atv_msg_public').forEach(function (target) {
    amateurtv_observer.observe(target, {childList : true});
});

document.querySelectorAll('.chat-list').forEach(function (target) {
    chaturbate_observer.observe(target, {childList : true});
});