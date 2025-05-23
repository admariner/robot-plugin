function initPassFailGraph(target) {
    var mode = getCookie("RobotResult_zoom", "true");
    var failedOnly = getCookie("RobotResult_failedOnly", "false");
    var maxBuildsToShow = getCookie("RobotResult_maxBuildsToShow", 0);
    if (document.getElementById("zoomToChanges"))
        document.getElementById("zoomToChanges").checked = (mode == "true");
    if (document.getElementById("failedOnly"))
        document.getElementById("failedOnly").checked = (failedOnly == "true");
    setMaxBuildsToShow(maxBuildsToShow);
    setPassFailGraphSrc(target, mode, failedOnly, maxBuildsToShow);
}

function initDurationGraph(target) {
    var maxBuildsToShow = getCookie("RobotResult_maxBuildsToShow", 0);
    setDurationGraphSrc(target, maxBuildsToShow);
}

function setMaxBuildsToShow(maxBuildsToShow) {
    document.getElementById("maxBuildsToShow").value = maxBuildsToShow == 0 ? "" : maxBuildsToShow;
}

function getMaxBuildsToShow() {
    var v = document.getElementById("maxBuildsToShow").value;
    return v != "" ? v : 0;
}

function setLinks(graph, href) {
    if (document.getElementById(graph+"_hd"))
        document.getElementById(graph+"_hd").href = href + "&hd=true";
    document.getElementById(graph+"_hd_link").href = href + "&hd=true";
    document.getElementById(graph).src = href;
}

function setPassFailGraphSrc(target, mode, failedOnly, maxBuildsToShow) {
    var href = target + "graph?" +
               "zoomSignificant=" + mode +
               "&failedOnly=" + failedOnly +
               "&maxBuildsToShow=" + maxBuildsToShow;
    setLinks("passfailgraph", href)
}

function setDurationGraphSrc(target, maxBuildsToShow) {
    var href = target + "durationGraph?" +
               "maxBuildsToShow=" + maxBuildsToShow;
    setLinks("durationgraph", href);
}

function redrawPassFailGraph() {
    var mode = false;
    var target = document.getElementById("robot-fromurl-id").getAttribute("data-url");
    if (document.getElementById("zoomToChanges")) {
        mode = Boolean(document.getElementById('zoomToChanges').checked).toString();
        setCookie("RobotResult_zoom",mode, 365);
    }
    var failedOnly = false;
    if (document.getElementById("failedOnly")) {
        failedOnly = Boolean(document.getElementById('failedOnly').checked).toString();
        setCookie("RobotResult_failedOnly",failedOnly, 365);
    }
    var maxBuildsToShow = getMaxBuildsToShow();
    setMaxBuildsToShow(maxBuildsToShow);
    setCookie("RobotResult_maxBuildsToShow",maxBuildsToShow, 365);

    setPassFailGraphSrc(target, mode, failedOnly, maxBuildsToShow);
}

function redrawDurationGraph() {
    var target = document.getElementById("robot-fromurl-id").getAttribute("data-url");
    var maxBuildsToShow = getMaxBuildsToShow();
    setDurationGraphSrc(target, maxBuildsToShow);
}

function setCookie(c_name,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : ";expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name, default_value) {
    var name = c_name + "=";
    var cookies = document.cookie.split(';');
    for(var i=0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0)==' ') cookie = cookie.substring(1);
        if (cookie.indexOf(name) != -1) return cookie.substring(name.length, cookie.length);
    }
    return default_value;
}

function showStackTrace(id,query) {
    var element = document.getElementById(id)
    element.style.display = "";
    document.getElementById(id + "-showlink").style.display = "none";
    document.getElementById(id + "-hidelink").style.display = "";

    var rqo = new XMLHttpRequest();
    rqo.open('GET', query, true);
    rqo.onreadystatechange = function() { element.innerHTML = rqo.responseText; }
    rqo.send(null);
}

function hideStackTrace(id) {
    document.getElementById(id).style.display = "none";
    document.getElementById(id + "-showlink").style.display = "";
    document.getElementById(id + "-hidelink").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function(){
    var element = document.getElementById("robot-fromurl-id");
    if (element) {
        var url = element.getAttribute("data-url");

        ["zoomToChanges", "failedOnly"].forEach(function(id) {
            if (document.getElementById(id))
                document.getElementById(id).addEventListener("click", redrawPassFailGraph);
        });

        if (document.getElementById("maxBuildsToShow")) {
            document.getElementById("maxBuildsToShow").addEventListener("change", redrawPassFailGraph);
            if (url == "")
                document.getElementById("maxBuildsToShow").addEventListener("change", redrawDurationGraph);
        }
        initPassFailGraph(url);
        if (url == "")
            initDurationGraph(url);
    }

    document.querySelectorAll('.robot-expand').forEach(function(element) {
            element.addEventListener('click', function(event) {
                event.preventDefault();
                showStackTrace(event.target.dataset.escapedName, event.target.dataset.relativeId);
            });
        });

    document.querySelectorAll('.robot-collapse').forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            hideStackTrace(event.target.dataset.escapedName);
        });
    });
});
