// ==UserScript==
// @name         Su v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  This project uses the roboscout API to fetch in real time station status of any EU AR site, manipulates received data and displays available station in a user friendly view
// @author       Mihail Tudos
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @include      *index*.html
// @match        *index*.html
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==
/* global $ */
/* eslint-disable no-multi-spaces, curly */

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

const apiUrl = getArLink(getArSite());

function fetchStations() {
    GM.xmlHttpRequest({
        method: "GET",
        url: apiUrl,
        responseType: "json",
        onload: parseResponse,
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error
    });
    // refreshing rate set ot 1 min
    let timer;
    clearTimeout(timer);
    timer = setTimeout(fetchStations, 60000);//set to 1 min
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

    // console.table(ss);
    if(FC_TWO_FLOORS.includes(fc_id)) {
        createBuildingFloors(ss, 2, 3, 2);
    } else if(FC_ONE_TO_THREE_FLOORS.includes(fc_id)) {
        createBuildingFloors(ss, 1, 3, 3);
    } else if (FC_TWO_TO_FOUR_FLOORS.includes(fc_id)) {
      createBuildingFloors(ss, 2, 4, 3);
    }
}

function reportAJAX_Error(rspObj) {
    // console.error(`scrpt => Error ${rspObj.status}!  ${rspObj.statusText} contact @tudosm`);
    alert("Choose your FC and refresh the page or contact @tudosm")
}

// var myDiv = document.querySelector("#loadSU");

// if (myDiv) {
//     myDiv.addEventListener("click", loadSU, false);
// }

// fetchStations();
