// ==UserScript==
// @name         Su v1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Mihail Tudos
// @require      http://code.jquery.com/jquery-3.5.1.min.js

// @include      *index*.html
// @match        *index*.html

// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==
/* global $ */
/* eslint-disable no-multi-spaces, curly */

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createStationCard(sNumber, sType, floor, sSide){
    let node = document.createElement("div");               
    node.classList.add("col", "s6", "m2", "center");
                    let secondDiv = document.createElement("div");
                    secondDiv.classList.add("z-depth-3", "hoverable", "round", "green", "accent-3", sSide);
                    let para = document.createElement("p");
                    para.classList.add("flow-text");
                    let textnode = document.createTextNode(sNumber); 
                    para.appendChild(textnode);        // Create a text node
                    secondDiv.appendChild(para);
                    let station_type_p = document.createElement("p");
                    station_type_p.classList.add("flow-text2");
                    textnode = document.createTextNode(sType); 
                    station_type_p.appendChild(textnode);        // Create a text node
                    secondDiv.appendChild(station_type_p);
                    node.appendChild(secondDiv);                             // Append the text to <li>
                    document.getElementById(floor).appendChild(node);     // Append <li> to <ul> with id="myList" 
}
var timer;

let dataUrl = "https://roboscout.amazon.com/view_plot_data/?sites=(BRS1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout"

var apiURL = dataUrl + Math.random();


const p2 = document.getElementById('p2');
const p3 = document.getElementById('p3');

function loadSU() {
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
        var ss = [];
        var sl = [];
        var i = 0;
        
        /* JSON structure:
            sfloor -> st.data[i + 2].yValue -> the floor eg. paKivaA02
            snumber  -> st.data[i + 3].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').trim() -> the station e.g. 2105
            slogin -> st.data[i + 4].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '') -> user login e.g. phrichie
            saa -> st.data[i + 5].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '') -> station type e.g Nike, ARSAW
            stype -> st.data[i + 6].yValue -> station type -> current task 
        */
        while (i < dataSize) {
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
        console.table(ss);
        console.table(sl);
      
        removeAllChildNodes(p2);
        removeAllChildNodes(p3);
        for (var i = 0, len = ss.length; i < len; i++) {
            if(ss[i].saa == 'AVAILABLE' && ss[i].snumber != 2383 && ss[i].snumber != 3383) {
                if(ss[i].snumber < 3000 ) {
                    createStationCard(ss[i].snumber, ss[i].stype, "p2", ss[i].sside);
                } else {
                    createStationCard(ss[i].snumber, ss[i].stype, "p3", ss[i].sside);
                }
            }
        }
      
    }
    function reportAJAX_Error(rspObj) {
        console.error(` scrpt => Error ${rspObj.status}!  ${rspObj.statusText}`);
    }
    //////////////////////////  refresh   //////////////////////////////////
    clearTimeout(timer);
    timer = setTimeout(loadSU, 1 * 60000);//set to 1 min
    
};

var myDiv = document.querySelector("#loadSU");
if (myDiv) {
    myDiv.addEventListener("click", loadSU, false);
}
loadSU();
