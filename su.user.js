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

const fcs = [
    {
        id: 'BRS1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(BRS1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'EMA1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(EMA1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'EMA2',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(EMA2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'LTN4',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(LTN4)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'MAN1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'MAN2',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(MAN2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'MAN3',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(MAN3)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'MME1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(MME1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'MME2',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(MME2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'LCY2',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(LBA3)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'KTW3',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(KTW3)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'SZZ1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(SZZ1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'DUS4',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(DUS4)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'FRA7',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(FRA7)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'HAM2',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(HAM2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'PAD1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(PAD1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'ORY4',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(ORY4)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'BLQ1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(BLQ1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'FCO1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(FCO1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'TRN1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(TRN1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'BCN1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(BCN1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
        id: 'SVQ1',
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(SVQ1)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
]

const FC_TWO_FLOORS = ['BRS1', 'DUS4', 'EMA1', 'LTN4', 'MAN2', 'MAN3', 'MME1', 'PAD1'];
const FC_ONE_TO_THREE_FLOORS = ['EMA2', 'HAM2'];
const FC_TWO_TO_FOUR_FLOORS = ['KTW3', 'MAN1', 'MME2'];

let fc_id = getArSite();
//gets the link
function getArLink(ar_id) {
    const fc_object = fcs.filter(fc => (fc.id === ar_id));
    const {data_link} = fc_object[0];
    return data_link;
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
        onload: parseResponse,
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error
    });
    // refreshing rate se tot 1 min
    var timer;
    clearTimeout(timer);
    timer = setTimeout(loadSU, 1 * 60000);//set to 1 min
};

function parseResponse(rspObj) {
    
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
    app.innerHTML = '';
    // console.table(ss);
    if(FC_TWO_FLOORS.includes(fc_id)) {
        createTwoFloors(ss);
        setTimeout(() => {
            displayTwoFloors(2);
        }, 2000);
    } else if(FC_ONE_TO_THREE_FLOORS.includes(fc_id)) {
        createOneToThreeFloors(ss);
    } else if (FC_TWO_TO_FOUR_FLOORS.includes(fc_id)) {

    }
}

function reportAJAX_Error(rspObj) {
    console.error(`scrpt => Error ${rspObj.status}!  ${rspObj.statusText} contact @tudosm`);
    alert("Choose your FC and refresh the page or contact @tudosm")
}

var myDiv = document.querySelector("#loadSU");
if (myDiv) {
    myDiv.addEventListener("click", loadSU, false);
}
loadSU();
