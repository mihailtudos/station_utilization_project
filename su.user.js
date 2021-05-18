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
      id: 'BRS2',
      data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(BRS2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
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
        data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(LCY2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
    },
    {
      id: 'LCY3',
      data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(LCY3)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
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
      id: 'POZ2',
      data_link: "https://roboscout.amazon.com/view_plot_data/?sites=(POZ2)&instance_id=0&object_id=20672&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
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
];

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
    var timer;
    clearTimeout(timer);
    timer = setTimeout(fetchStations, 1 * 60000);;//set to 1 min
};

function parseResponse(rspObj) {
    
    if (rspObj.status != 200 && rspObj.status != 304) {
        reportAJAX_Error(rspObj);
        return;
    }
    var st = rspObj.response;
    if (fc_id != 'TRN1') {
      //convert to JSON string after converting the received obj back to array
      st = JSON.parse(JSON.stringify(st).replace(/null/g, '"#"')); 
    }
    let prevStationsNumbers = null;
    let prevStationsStations = null;
    if (localStorage.hasOwnProperty('stations')) {
      prevStationsNumbers = JSON.parse(localStorage.getItem('stations')).map(item => item.snumber);
      prevStationsStations = JSON.parse(localStorage.getItem('stations'));
    }
    document.getElementById("ar-location").textContent = `at ${st.data[1].yValue}`;
    document.getElementById('fc-id').textContent = st.data[1].yValue;
    const dataSize = st.data.length;
    const ss = [];
    let i = 0;
    while (i < dataSize) {
        const sfloor = st.data[i + 2].yValue;
        const snumber = st.data[i + 3].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').trim();
        // const slogin = st.data[i + 4].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
        const saa = st.data[i + 5].yValue.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
        let stype = st.data[i + 6].yValue;
        // const sopmode = st.data[i + 7].yValue;
        // const smode = st.data[i + 8].yValue;
        const sversion = st.data[i + 9].yValue;
        // const sidle = st.data[i + 10].yValue;
        // const stimein = st.data[i + 11].yValue;
        if (sversion.includes("IDS")) {
            stype = "Nike";
        }
        if (saa === 'AVAILABLE') {
          let timer = 0;
          if (prevStationsStations) {
            const index = prevStationsNumbers.indexOf(snumber);
           if (index != -1) {
            timer = prevStationsStations[index].timer + 1;
           }
          }
          const sdata = { sfloor, snumber, saa, stype, timer };
          ss.push(sdata);
        }
        i = i + 12;
    }
    const stringStations = JSON.stringify(ss);
    localStorage.setItem('stations', stringStations);
    // console.table(ss);
    createAppSchema(ss);
}

function reportAJAX_Error(rspObj) {
    alert("Please, choose your FC and refresh the page or contact @tudosm")
}

fetchStations();