//set current year
let date = new Date();
const app = document.getElementById('app');
document.getElementById("year").textContent = date.getFullYear();
let data; 
const floorsAndLevels = [];
let numberOfFloors;


function setLocalArId(ar_id) {
  localStorage.removeItem('ar_id');
  localStorage.removeItem('stations');
  localStorage.setItem('ar_id', ar_id);
  document.getElementById('fc-id').textContent = ar_id;
  location.reload();
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
    case 5: return `m6`;
    case 6: return `m6`;
    case 7: return `m6`;
  }
}

function checkHeaderSize(numberOfFloors) {
  switch (numberOfFloors) {
    case 2: return `m6`;
    case 3: return `m4`;
    case 4: return `m3`;
    case 5: return `m2`;
    case 6: return `m2`;
    case 7: return `m2`;
  }
}

function setFloorsAndLevels(stations) {
  stations.forEach(station => {
    if(!floorsAndLevels.includes(station.sfloor)) {
      floorsAndLevels.push(station.sfloor);
    }
  });
  numberOfFloors = floorsAndLevels.length;
}

function createAppSchema(stations) {
  setFloorsAndLevels(stations);
  app.innerHTML = '';
  const floorHeader = document.createElement('div');
  floorHeader.id = 'floorHeaderContainer';
  let row = document.createElement('div');
  row.className = 'row center remove-space';
  row.id = 'floorHeader';
  floorHeader.appendChild(row);

  const floorStations = document.createElement('div');
  floorStations.id = 'floorStationsContainer';
  row = document.createElement('div');
  row.className = 'row';
  row.id = 'floorStations';
  floorStations.appendChild(row);

  app.append(floorHeader, floorStations);
  createBuildingSchema(stations);
}


function createBuildingSchema(stations) {
  const floorHeader = document.getElementById('floorHeader');
  const floorStations = document.getElementById('floorStations');

  for (let i = 0; i < floorsAndLevels.length && i < 6; i++) {
    let colDiv = document.createElement('div');
    let divClass = `col ${checkHeaderSize(numberOfFloors)}`;
    
    if(i === 0 && floorsAndLevels.length === 5) {
      divClass += divClass + ' offset-m1';
    }

    colDiv.className = divClass;
    let floorTitle = document.createElement('h3');
    floorTitle.textContent = `${floorsAndLevels[i]}`;
    colDiv.append(floorTitle);
    floorHeader.append(colDiv);

    //creates floors schema 
    colDiv = document.createElement('div');
    colDiv.id = floorsAndLevels[i];
    colDiv.className = divClass;
    i > 0 ? colDiv.classList.add('border-left') : ''; 
    floorStations.append(colDiv)
  }

  appendStations(stations);
}

function appendStations(stations) {

  for (let i = 0; i < numberOfFloors; i++) {
    let floorID = document.getElementById(floorsAndLevels[i]);
    stations.forEach(station => {
      if (station.sfloor === floorID.id) {
        createStationCard(station.snumber, station.stype, station.timer, floorID.id, numberOfFloors);
      }
    })
  }
}

const getTimer = (sTimer) => {
  let time = 0;
  if (sTimer > 60) {
    if (sTimer > 1440) {
      time = '+24h'
    } else {
      time = Math.floor(sTimer/60).toFixed(0).toString();
      time += 'h'
    }
  } else {
    time = sTimer.toString() + 'min';
  }

  return time; 
}

// creates a station card
function createStationCard(sNumber, sType, sTimer, floor, noFloors){
  //station number paragraph
  const paragraph = document.createElement("p");
  paragraph.classList.add("flow-text");
  paragraph.textContent = sNumber;

  //station type paragraph
  const station_type = document.createElement("p");
  station_type.textContent = `${sType} | ${getTimer(sTimer)} `;

  //inner div (card body)
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("hoverable", "card", "clear-margin");
  if (sTimer > 10) {
    innerDiv.classList.add("med-timer");
  }
  if (sTimer > 20) {
    innerDiv.classList.add("high-timer");
  }
  if (sType === 'Universal' || sType === 'Nike') {
    let badge = document.createElement('span');
    badge.textContent = '!';
    badge.classList.add('card__badge');
    innerDiv.appendChild(badge);
  }
  innerDiv.appendChild(paragraph);
  innerDiv.appendChild(station_type);
  //outer div (card container div)
  const cardContainer = document.createElement("div");
  cardContainer.className = `col s6 center ${checkCardSize(noFloors)}`;
  cardContainer.appendChild(innerDiv);
  
  //get the floor to add created card
  const selectedFloor = document.getElementById(floor);
  if (selectedFloor) selectedFloor.appendChild(cardContainer);
}