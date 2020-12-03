// ==UserScript==
// @name         su script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows_empty_stations
// @author       Mihail Tudos
// @require      http://code.jquery.com/jquery-3.5.1.min.js

// @include      *SUtest*.html
// @match        *SUtest*.html

// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==
/* global $ */
/* eslint-disable no-multi-spaces, curly */
alert('hello');

var timer;

let dataUrl = "https://roboscout.amazon.com/view_plot_data/?sites=(BRS1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout"
//let dataUrl = "http://192.168.0.16:8888/roboscout.json"
$("#help").css("display","none");
var apiURL = dataUrl + Math.random();

//document.getElementById("fbuttons").innerHTML += "----> <button id='loadSU'>LOAD</button><span id='loadmsg'></span>";
function loadSU() {
    document.getElementById("loadmsg").innerHTML=" Loading data please wait.     "
    GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        responseType: "json",
        onload: processJSON_Response,
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error
    });

    function processJSON_Response(rspObj) {
        if (rspObj.status != 200 && rspObj.status != 304) {
            reportAJAX_Error(rspObj);
            return;
        }

        var st = rspObj.response;
        var old = JSON.stringify(st).replace(/null/g, '"#"'); //convert to JSON string
        st = JSON.parse(old); //convert back to array

        var dataSize = st.data.length;

        //console.log(dataSize);
        var ss = [];
        var sl = [];
        var i = 0;
        while (i < dataSize) {
            //$("body").append(st.data[i + 3].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').trim() + " " + st.data[i + 4].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '') + "<br>");


            var sfloor = st.data[i + 2].yValue;
            var snumber = st.data[i + 3].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').trim();
            var sside;
            if(snumber.substring(0,2)=="11"){
                sside="P1N";
            }
            if(snumber.substring(0,2)=="12"){
                sside="P1W";
            }
            if(snumber.substring(0,2)=="21"){
                sside="P2N";
            }
            if(snumber.substring(0,2)=="22"){
                sside="P2W";
            }
            if(snumber.substring(0,2)=="23"){
                sside="P2S";
            }
            if(snumber.substring(0,2)=="24"){
                sside="P2E";
            }
            if(snumber.substring(0,2)=="31"){
                sside="P3N";
            }
            if(snumber.substring(0,2)=="32"){
                sside="P3W";
            }
            if(snumber.substring(0,2)=="33"){
                sside="P3S";
            }
            if(snumber.substring(0,2)=="34"){
                sside="P3E";
            }

            var slogin = st.data[i + 4].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
            var saa = st.data[i + 5].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
            var stype = st.data[i + 6].yValue;
            var sopmode = st.data[i + 7].yValue;
            var smode = st.data[i + 8].yValue;
            var sversion = st.data[i + 9].yValue;
            var sidle = st.data[i + 10].yValue;
            var stimein = st.data[i + 11].yValue;
            var stask = "EMPTY";
            if (sversion.includes("IDS")) {
                stype = "Nike";
            }
            var sdata = { sfloor, snumber, sside, slogin, saa, stype, sopmode, smode, sversion, sidle, stimein };
            ss.push(sdata);
            var slstationint=parseInt(snumber);
            var sldata = {slstationint,sfloor, snumber, sside, slogin, saa, stype, sopmode, smode, sversion, sidle, stimein,stask };
            sl.push(sldata);
            i = i + 12;
        }
        JSON.stringify(ss);
        //console.table(ss);
        //console.table(sl);

        var stowStations = 0;
        var pickStations = 0;
        var countStations = 0;
        var inspectStations = 0;

        var totalfree = 0;
        var freeRebin =0;
        var freeArsaw =0;
        let p1npick = 0;
        let p2npick = 0;
        let p3npick = 0;
        var p2nused = 0, p2nfree = 0, p2eused = 0, p2efree = 0, p2wused = 0, p2sfree = 0, p2sused = 0, p2wfree = 0;
        var p3nused = 0, p3nfree = 0, p3eused = 0, p3efree = 0, p3wused = 0, p3sfree = 0, p3sused = 0, p3wfree = 0;
        var p2arsawUsed = 0, p2arsawFree = 0, p2nikeUsed = 0, p2nikeFree = 0, p2uniUsed = 0, p2uniFree = 0, p2rebinUsed = 0, p2rebinFree = 0;

        for (var i = 0, len = ss.length; i < len; i++) {
            if (document.getElementById("s" + ss[i].snumber)) {

                document.getElementById("s" + ss[i].snumber).innerHTML = ss[i].snumber;
                //su data insertion
                if (ss[i].sversion.includes("Rebin")) {
                    document.getElementById("s" + ss[i].snumber).style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "l").style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "Pick";
                    document.getElementById("s" + ss[i].snumber + "l").innerHTML = ss[i].slogin;
                    document.getElementById("s" + ss[i].snumber + "l").style.fontSize = "10px";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                }
                if (ss[i].stype.includes("ARSAW")) {
                    document.getElementById("s" + ss[i].snumber).style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "l").style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "Pick";
                    document.getElementById("s" + ss[i].snumber + "l").innerHTML = ss[i].slogin;
                    document.getElementById("s" + ss[i].snumber + "l").style.fontSize = "10px";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                }
                if (ss[i].sversion.includes("IDS")) {
                    document.getElementById("s" + ss[i].snumber).style.backgroundColor = "gold";
                    document.getElementById("s" + ss[i].snumber + "l").style.backgroundColor = "gold";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "gold";
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "Stow";
                    document.getElementById("s" + ss[i].snumber + "l").innerHTML = ss[i].slogin;
                    document.getElementById("s" + ss[i].snumber + "l").style.fontSize = "10px";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                }
                if (ss[i].stype.includes("Universal")) {
                    document.getElementById("s" + ss[i].snumber).style.backgroundColor = "goldenrod";
                    document.getElementById("s" + ss[i].snumber + "l").style.backgroundColor = "goldenrod";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "goldenrod";
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "Stow";
                    document.getElementById("s" + ss[i].snumber + "l").innerHTML = ss[i].slogin;
                    document.getElementById("s" + ss[i].snumber + "l").style.fontSize = "10px";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                }
                if (ss[i].slogin.length < 3) {
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "EMPTY";
                    document.getElementById("s" + ss[i].snumber + "l").style.backgroundColor = "red";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "red";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "white";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontSize = "10px";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "bold";
                }

                if (ss[i].sopmode.includes("Count")) {
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "<a href='https://fans-dub.amazon.com/?to="+ss[i].slogin+"' target='_blank'>Count</a>";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontSize = "12px";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "chartreuse";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                    countStations++;
                    sl[i].stask="Count";
                }
                if (ss[i].sopmode.includes("Stow")) {
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "<a href='https://fans-dub.amazon.com/?to="+ss[i].slogin+"' target='_blank'>Stow</a>"; //
                    document.getElementById("s" + ss[i].snumber + "t").style.fontSize = "12px";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "gold";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                    stowStations++;
                    sl[i].stask="Stow";
                }
                if (ss[i].sopmode.includes("Pick")) {
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "<a href='https://fans-dub.amazon.com/?to="+ss[i].slogin+"' target='_blank'>Pick</a>";;
                    document.getElementById("s" + ss[i].snumber + "t").style.fontSize = "12px";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "skyblue";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                    pickStations++;
                    sl[i].stask="Pick";
                }
                if (ss[i].sopmode.includes("Inspect")) {
                    document.getElementById("s" + ss[i].snumber + "t").innerHTML = "<a href='https://fans-dub.amazon.com/?to="+ss[i].slogin+"' target='_blank'>Inspect</a>";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontSize = "11px";
                    document.getElementById("s" + ss[i].snumber + "t").style.backgroundColor = "magenta";
                    document.getElementById("s" + ss[i].snumber + "t").style.color = "white";
                    //document.getElementById("s" + ss[i].snumber + "t").style.color = "black";
                    document.getElementById("s" + ss[i].snumber + "t").style.fontWeight = "normal";
                    inspectStations++;
                    sl[i].stask="Inspect";
                }
                if ((sl[i].sside.includes("P1"))&&(sl[i].sopmode.includes("Pick"))) { p1npick++; }
                if ((sl[i].sside=="P2N")&&(sl[i].sopmode.includes("Pick"))) { p2npick++; }
                if ((sl[i].sside=="P3N")&&(sl[i].sopmode.includes("Pick"))) { p3npick++; }

            } else {
                //console.log("nera" + ss[i].snumber);
            }

        }
        //console.log(sl);
        let arsawStations = sl.filter(function (el) {
           return el.stype =="ARSAW"
        });
        let icqaStations = sl.filter(function (el) {
            return el.stask =="Count"
        });
        //console.log(arsawStations);
        //$("#arsawStations").text(JSON.stringify(arsawStations));

        //console.log(p1npick + " " + p2npick + " " +p3npick);
        document.getElementById("p1ps").innerHTML= p1npick;
        document.getElementById("p2ps").innerHTML= p2npick;
        document.getElementById("p3ps").innerHTML= p3npick;
        document.getElementById("tpsn").innerHTML= p1npick+p2npick+p3npick;
        document.getElementById("loadmsg").innerHTML = "   Done!    "
        //console.log(pickStations + " " + stowStations + " " + countStations + " " + inspectStations);
        document.getElementById("pickStations").innerHTML = pickStations;
        document.getElementById("pickStations").style.padding = "0.5em";
        document.getElementById("picks").style.backgroundColor = "skyblue";
        document.getElementById("picks").style.textAlign = "right";

        document.getElementById("stowStations").innerHTML = stowStations;
        document.getElementById("stowStations").style.padding = "0.5em";
        document.getElementById("stows").style.backgroundColor = "gold";
        document.getElementById("stows").style.textAlign = "right";

        document.getElementById("countStations").innerHTML = countStations;
        document.getElementById("countStations").style.padding = "0.5em";
        document.getElementById("counts").style.backgroundColor = "chartreuse";
        document.getElementById("counts").style.textAlign = "right";

        document.getElementById("inspectStations").innerHTML = inspectStations;
        document.getElementById("inspectStations").style.padding = "0.5em";
        document.getElementById("inspects").style.backgroundColor = "magenta";
        document.getElementById("inspects").style.color = "white";
        document.getElementById("inspects").style.textAlign = "right";

        document.getElementById("totalUsed").innerHTML = stowStations + pickStations + countStations + inspectStations;
        document.getElementById("totals").style.textAlign = "right";
        document.getElementById("draggable").style.display = "unset";
        document.getElementById("draggable2NorthPickStations").style.display = "unset";
        document.getElementById("totalUsed").style.padding = "0.5em";


        $("#arsawStationsP1").empty();
        $("#arsawStationsP2").empty();
        $("#arsawStationsP3").empty();
        arsawStations.sort((a, b) => a.snumber - b.snumber);
        for(let i=0, len = arsawStations.length; i<len; i++){
            if (arsawStations[i].snumber<2000) {
                $("#arsawStationsP1").append("<div>"+arsawStations[i].snumber+" <span class='arsawLogin'>" +arsawStations[i].slogin +"</span><span> "+arsawStations[i].stask +"</div>");
            }
            if (arsawStations[i].snumber>3000) {
                $("#arsawStationsP3").append("<div>"+arsawStations[i].snumber+" <span class='arsawLogin'>" +arsawStations[i].slogin +"</span><span> "+arsawStations[i].stask +"</div>");
            }
            if ((arsawStations[i].snumber>2000)&&(arsawStations[i].snumber<3000)){
                $("#arsawStationsP2").append("<div>"+arsawStations[i].snumber+" <span class='arsawLogin'>" +arsawStations[i].slogin +"</span><span> "+arsawStations[i].stask +"</div>");
            }
            //$(#arsawStations").append("<div>"+arsawStations[i].snumber+" <span class='arsawLogin'>" +arsawStations[i].slogin +"</span><span> "+arsawStations[i].stask +"</div>");
            //document.getElementById("arsawStations").innerHTML += arsawStations[i].slogin;
        }
    }
    function reportAJAX_Error(rspObj) {
        console.error(` scrpt => Error ${rspObj.status}!  ${rspObj.statusText}`);
    }
    //////////////////////////  refresh  /////////////////////////////////////////////////////////
    clearTimeout(timer);
    timer = setTimeout(loadSU, $("#refreshTime").val()*60000);
    //////////////////////////  refresh  /////////////////////////////////////////////////////////
};

var myDiv = document.querySelector("#loadSU");
if (myDiv) {
    myDiv.addEventListener("click", loadSU, false);
}
loadSU();






/* setInterval(function () {
    // your code goes here...
    loadSU();
    console.log("x");

}, ($("#refreshTime").val() * 10) * 1000); // 60 * 1000 milsec */
let arbtn = false;
document.getElementById("arsawBtn").addEventListener("click", function () {
    if (arbtn) {
        arbtn = false;
        $("#arsawStations").css("display","none");
    }else {
        arbtn = true;
        $("#arsawStations").css("display","table");
    }

});

