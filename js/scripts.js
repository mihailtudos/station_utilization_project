//set current year
let date = new Date();
const app = document.getElementById('app');
document.getElementById("year").textContent = date.getFullYear();

function setLocalArId(ar_id) {
  localStorage.removeItem('ar_id');
  localStorage.setItem('ar_id', ar_id);
  document.getElementById('fc-id').textContent = ar_id;
  // fetchStations();
}

//gets the FC ID
function getArSite(){
  id = localStorage.getItem("ar_id");
  return id;
}

$(".dropdown-trigger").dropdown();

function checkCardSize(numberOfFloors) {
  switch (numberOfFloors) {
    case 2: return `m3`;
    case 3: return `m4`;
    case 4: return `m6`;
    case 5: return `m12`;
  }
}

// creates a station card
function createStationCard(sNumber, sType, floor, numberOfFloors){
  //station number paragraph
  const paragraph = document.createElement("p");
  paragraph.classList.add("flow-text");
  paragraph.textContent = sNumber;

  //station type paragraph
  const station_type = document.createElement("p");
  station_type.textContent = sType;

  //inner div (card body)
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("hoverable", "card");
  innerDiv.appendChild(paragraph);
  innerDiv.appendChild(station_type);
  
  //outer div (card container div)
  const cardContainer = document.createElement("div");
  cardContainer.className = `col s6 center ${checkCardSize(numberOfFloors)}`;
  cardContainer.appendChild(innerDiv);
  
  //get the floor to add created card
  const selectedFloor = document.getElementById(floor);
  if (selectedFloor) selectedFloor.appendChild(cardContainer);
}

function buildFloorHeader(start, end, numberOfFloors) {
  const containerDiv = document.getElementById('2-floors');
  const row = document.createElement('div');
  row.className = 'row center remove-space';

  for(; start <= end; start++) {
    let colDiv = document.createElement('div');
    colDiv.className = `col m${12/numberOfFloors}`;
    let floorTitle = document.createElement('h3');
    floorTitle.textContent = `P${start}`;
    colDiv.append(floorTitle);
    row.append(colDiv);
  }
  containerDiv.appendChild(row);
}

function buildFloors(start, end, numberOfFloors) {
  const containerDiv = document.createElement('div');
  containerDiv.id = '2-floors';
  app.appendChild(containerDiv);
  buildFloorHeader(start, end, numberOfFloors);
  const row = document.createElement('div');
  row.className = 'row';

  for(; start <= end; start++) {
    let colDiv = document.createElement('div');
    colDiv.className = `col m${12/numberOfFloors}`;
    colDiv.id = `p${start}`;
    start < end ? colDiv.classList.add('border-right') : ''; 
    row.append(colDiv);
  }
  containerDiv.appendChild(row);
}

function createBuildingFloors(ss, start, end, numberOfFloors) {
  app.innerHTML = '';
  buildFloors(start, end, numberOfFloors);

  for (let i = 0, len = ss.length; i < len; i++) {
    if (ss[i].saa == 'AVAILABLE') {
      if(ss[i].snumber > 1000 && ss[i].snumber < 2000) {
        addStationOnP1(ss[i], numberOfFloors);
      }

      if(ss[i].snumber >= 2000 && ss[i].snumber < 3000  && ss[i].snumber != 2383) {
        addStationOnP2(ss[i], numberOfFloors);
      }

      if(ss[i].snumber >= 3000 && ss[i].snumber < 4000  && ss[i].snumber != 3383) {
        addStationOnP3(ss[i], numberOfFloors);
      }

      if(ss[i].snumber >= 4000 && ss[i].snumber < 5000) {
        addStationOnP4(ss[i], numberOfFloors);
      }
    }
  }
}


function addStationOnP1({snumber, stype}, numberOfFloors) {
  createStationCard(snumber, stype, "p1", numberOfFloors);
}

function addStationOnP2({snumber, stype}, numberOfFloors) {
  createStationCard(snumber, stype, "p2", numberOfFloors);
}

function addStationOnP3({snumber, stype}, numberOfFloors) {
  createStationCard(snumber, stype, "p3", numberOfFloors);
}

function addStationOnP4({snumber, stype}, numberOfFloors) {
  createStationCard(snumber, stype, "p4", numberOfFloors);
}


// function createTwoFloors(ss) {
//   app.innerHTML = '';
//   buildFloors(2);
//   document.getElementById("2-floors").style.display = "initial";
//   document.getElementById("3-floors").style.display = "none";
//   let countStationsFF = 0, countStationsSF = 0;
//     for (let i = 0, len = ss.length; i < len; i++) {
//         if(ss[i].snumber < 3000  && ss[i].snumber != 2383) {
//             if(ss[i].saa == 'AVAILABLE'){
//                 createStationCard(ss[i].snumber, ss[i].stype, "p2", "m2");
//             } 
//             if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
//                 countStationsFF++;
//             }
//         }
//         if(ss[i].snumber > 3000  && ss[i].snumber != 3383) {
//             if(ss[i].saa == "AVAILABLE") {
//                 createStationCard(ss[i].snumber, ss[i].stype, "p3", "m2");
//             }
//             if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
//                 countStationsSF++;
//             }
//         }
//     }
//     document.getElementById("countStationsFF").textContent = countStationsFF;
//     document.getElementById("countStationsSF").textContent = countStationsSF;
// }

// function createOneToThreeFloors(ss) {
//   removeAllChildNodes(p3_3floors);
//   removeAllChildNodes(p2_3floors);
//   removeAllChildNodes(p4_3floors);
//   document.getElementById("2-floors").style.display = "none";
//   document.getElementById("3-floors").style.display = "initial"
//   let countStationsFF = 0, countStationsSF = 0, countStationsTF = 0;
//   for (let i = 0, len = ss.length; i < len; i++) {
//     if(ss[i].snumber < 3000 ) {
//         if(ss[i].saa == 'AVAILABLE') {
//             createStationCard(ss[i].snumber, ss[i].stype, "p2-3floors", "m2");
//         }
//         if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
//             countStationsFF++;
//         }
//     } else if(ss[i].snumber > 3000 && ss[i].snumber < 4000) {
//         if(ss[i].saa == 'AVAILABLE') {
//             createStationCard(ss[i].snumber, ss[i].stype, "p3-3floors", "m2");
//         }
//         if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
//             countStationsTF++;
//         }
//     } else if(ss[i].snumber > 4000 && ss[i].snumber < 5000) {
//         if(ss[i].saa == 'AVAILABLE') {
//             createStationCard(ss[i].snumber, ss[i].stype, "p4-3floors", "m2");
//         }
//         if(ss[i].smode.trim() == "Simple Bin Count Generic" || ss[i].smode.trim() == "Simple Record Count Generic" || ss[i].smode.trim() == "Cycle Count Generic") {
//             countStationsSF++;
//         }
//     }
      
//   }
//   document.getElementById("countStationsFF").textContent = countStationsFF;
//   document.getElementById("countStationsSF").textContent = countStationsSF;
//   document.getElementById("countStationsTF").textContent = countStationsTF;
//   extraFloor.style.display = "initial"
// }

