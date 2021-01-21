// ==UserScript==
// @name         Su v1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This project uses the roboscout API to fetch real time station status (AR sites), manipulates received data and displays available station in a user friendly manner
// @author       Mihail Tudos
// @require      http://code.jquery.com/jquery-3.5.1.min.js

// @include      *index*.html
// @match        *index*.html

// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==
/* global $ */
/* eslint-disable no-multi-spaces, curly */

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
let fc_id = getArSite();
//gets the link
function getArLink(ar_id) {
    if(ar_id == "BRS1"){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(BRS1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'EMA1'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(EMA1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    }else if(ar_id == 'EMA2'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(EMA2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'LTN4'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(LTN4)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'MAN1'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'MAN2'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(MAN2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'MME1'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(MME1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'MAN3'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(MAN3)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } else if(ar_id == 'MME2'){
        return "https://roboscout.amazon.com/view_plot_data/?sites=(MME2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout";
    } 
}
const apiURL = getArLink(getArSite());
const p2 = document.getElementById('p2');
const p3 = document.getElementById('p3');
const p3_3floors = document.getElementById("p3-3floors")
const p2_3floors = document.getElementById("p2-3floors")
const p4_3floors = document.getElementById("p4-3floors")
const extraFloor = document.getElementById("extra_floor");

function loadSU() {
    GM.xmlHttpRequest({
        method: "GET",
        url: getArLink(getArSite()),
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
        document.getElementById("ar-location").textContent = `at ${st.data[1].yValue}`;
        document.getElementById('fc-id').textContent = st.data[1].yValue;
        var dataSize = st.data.length;
        var ss = [];
        var i = 0;
        while (i < dataSize) {
            var sfloor = st.data[i + 2].yValue;
            var snumber = st.data[i + 3].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').trim();
            var slogin = st.data[i + 4].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
            var saa = st.data[i + 5].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
            var stype = st.data[i + 6].yValue;
            var sopmode = st.data[i + 7].yValue;
            var smode = st.data[i + 8].yValue;
            var sversion = st.data[i + 9].yValue;
            var sidle = st.data[i + 10].yValue;
            var stimein = st.data[i + 11].yValue;
            if (sversion.includes("IDS")) {
                stype = "Nike";
            }
            var sdata = { sfloor, snumber, slogin, saa, stype, sopmode, smode, sversion, sidle, stimein };
            ss.push(sdata);
            i = i + 12;
        }
        JSON.stringify(ss);
        console.table(ss);
        if(fc_id == 'BRS1' || fc_id == 'EMA1' || fc_id == 'MAN2' || fc_id == 'MME1' || fc_id == 'MAN3') {
            removeAllChildNodes(p2);
            removeAllChildNodes(p3);
            document.getElementById("2-floors").style.display = "initial";
            document.getElementById("3-floors").style.display = "none"
            let countStationsFF = 0, countStationsSF = 0;
            for (let i = 0, len = ss.length; i < len; i++) {
                if(ss[i].snumber < 3000  && ss[i].snumber != 2383) {
                    if(ss[i].saa == 'AVAILABLE'){
                        createStationCard(ss[i].snumber, ss[i].stype, "p2", "m2");
                    } 
                    if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
                        countStationsFF++;
                    }
                }
                if(ss[i].snumber > 3000  && ss[i].snumber != 3383) {
                    if(ss[i].saa == "AVAILABLE") {
                        createStationCard(ss[i].snumber, ss[i].stype, "p3", "m2");
                    }
                    if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
                        countStationsSF++;
                    }
                }
            }
            document.getElementById("countStationsFF").textContent = countStationsFF;
            document.getElementById("countStationsSF").textContent = countStationsSF;
        } else if(fc_id = "MAN1" || fc_id == 'MME2') {
            removeAllChildNodes(p3_3floors);
            removeAllChildNodes(p2_3floors);
            removeAllChildNodes(p4_3floors);
            document.getElementById("2-floors").style.display = "none";
            document.getElementById("3-floors").style.display = "initial"
            let countStationsFF = 0, countStationsSF = 0, countStationsTF = 0;
            for (let i = 0, len = ss.length; i < len; i++) {
                
                    if(ss[i].snumber < 3000 ) {
                        if(ss[i].saa == 'AVAILABLE') {
                            createStationCard(ss[i].snumber, ss[i].stype, "p2-3floors", "m2");
                        }
                        if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
                            countStationsFF++;
                        }
                    } else if(ss[i].snumber > 3000 && ss[i].snumber < 4000) {
                        if(ss[i].saa == 'AVAILABLE') {
                            createStationCard(ss[i].snumber, ss[i].stype, "p3-3floors", "m2");
                        }
                        if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
                            countStationsTF++;
                        }
                    } else if(ss[i].snumber > 4000 && ss[i].snumber < 5000) {
                        if(ss[i].saa == 'AVAILABLE') {
                            createStationCard(ss[i].snumber, ss[i].stype, "p4-3floors", "m2");
                        }
                        if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
                            countStationsSF++;
                        }
                    }
                
            }
            document.getElementById("countStationsFF").textContent = countStationsFF;
            document.getElementById("countStationsSF").textContent = countStationsSF;
            document.getElementById("countStationsTF").textContent = countStationsTF;
            extraFloor.style.display = "initial"
        }
    }
    function reportAJAX_Error(rspObj) {
        console.error(`scrpt => Error ${rspObj.status}!  ${rspObj.statusText} contact @tudosm`);
        alert("There seems to be a problem (hint: choose your FC and refresh the page) please, contact @tudosm")
    }
    // refreshing rate se tot 1 min
    var timer;
    clearTimeout(timer);
    timer = setTimeout(loadSU, 1 * 60000);//set to 1 min
};

var myDiv = document.querySelector("#loadSU");
if (myDiv) {
    myDiv.addEventListener("click", loadSU, false);
}
loadSU();
