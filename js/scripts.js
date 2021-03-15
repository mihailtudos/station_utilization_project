//set current year
var date = new Date();
document.getElementById("year").textContent = date.getFullYear();

function setLocalArId(ar_id) {
  localStorage.removeItem('ar_id');
  localStorage.setItem('ar_id', ar_id);
  document.getElementById('fc-id').textContent = ar_id;
}
//gets the FC ID
function getArSite(){
  id = localStorage.getItem("ar_id");
  return id;
}

$(".dropdown-trigger").dropdown();

// creates a station badge
function createStationCard(sNumber, sType, floor, mCols){
  let node = document.createElement("div");               
  node.classList.add("col", "s6", mCols, "center");
  let secondDiv = document.createElement("div");
  secondDiv.classList.add("z-depth-3", "hoverable", "round", "green", "accent-3");
  let para = document.createElement("p");
  para.classList.add("flow-text");
  let textnode = document.createTextNode(sNumber); 
  para.appendChild(textnode);        
  secondDiv.appendChild(para);
  let station_type_p = document.createElement("p");
  station_type_p.classList.add("flow-text2");
  textnode = document.createTextNode(sType); 
  station_type_p.appendChild(textnode);        
  secondDiv.appendChild(station_type_p);
  node.appendChild(secondDiv);                             
  document.getElementById(floor).appendChild(node);
}


function createTwoFloors(ss) {
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
}