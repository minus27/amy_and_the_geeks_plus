const START_POP_MONITOR = true;
const GLITCH_DOMAIN = 'google-pop-map.glitch.me';
const QS_STATUS_TWEAKING = true;

var DEBUG_POP = null; //{code:'BOG',initial_status:null,in_status:null,update_status:null,out_status:null};

const mapIcons = {
  hole: {
    path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  },
  filled: {
    path: "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z",
  },
  beer: {
    path: "M15.946 15.36c.276-3.767 2.054-6.188 2.054-10.232 0-1.086-.128-2.289-.448-3.666-1.561-.945-3.541-1.462-5.564-1.462-1.914 0-3.866.462-5.539 1.462-.32 1.38-.449 2.584-.449 3.671 0 4.042 1.778 6.452 2.055 10.228.137 1.869-.277 4.63-.581 6.321-.279 1.546 2.12 2.318 4.52 2.318 2.404 0 4.811-.774 4.533-2.319-.303-1.69-.717-4.452-.581-6.321zm-6.281-9.373c0 3.36 1.478 4.926 1.702 8.54.174 2.807-.148 5.885-.596 7.621-.458-.028-1.138-.096-1.56-.273.351-1.973.728-4.685.583-6.641-.141-1.922-.617-3.483-1.079-4.993-.712-2.333-1.334-4.37-.725-7.628 1.19-.571 2.558-.87 3.998-.87 1.444 0 2.847.305 4.022.867.258 1.378.294 2.539.197 3.597-1.849-.904-5.066-.962-6.542-.22z",
  },
  egg: {
    path: "M9 12.5c0 .829-.671 1.5-1.5 1.5s-1.5-.671-1.5-1.5.671-1.5 1.5-1.5 1.5.671 1.5 1.5zm7.5-1.5c-.829 0-1.5.671-1.5 1.5s.671 1.5 1.5 1.5 1.5-.671 1.5-1.5-.671-1.5-1.5-1.5zm-4.5 0c-.829 0-1.5.671-1.5 1.5s.671 1.5 1.5 1.5 1.5-.671 1.5-1.5-.671-1.5-1.5-1.5zm9 2.584c0 5.722-3.416 10.416-9 10.416s-9-4.694-9-10.416c0-6.469 4.499-13.584 9-13.584s9 7.115 9 13.584zm-2 0c0-1.89-.421-3.762-1.086-5.437l-1.186.851-1.184-.852-1.182.853-1.185-.853-1.183.854-1.181-.853-1.184.853-1.178-.852-1.18.852-1.181-.853c-.665 1.674-1.09 3.549-1.09 5.437 0 .978.131 1.973.392 2.92l.698-.504 1.181.852 1.18-.852 1.18.853 1.183-.853 1.181.853 1.182-.852 1.185.853 1.182-.853 1.186.853 1.187-.852.693.498c.26-.947.39-1.94.39-2.916zm-12.167-7.048l.438.316 1.18-.852 1.18.853 1.183-.853 1.181.853 1.182-.852 1.185.853 1.182-.853 1.186.853.439-.315c-1.435-2.68-3.466-4.539-5.169-4.539-1.703 0-3.732 1.858-5.167 4.536zm11.138 11.649l-.055-.04-1.188.853-1.184-.852-1.182.853-1.185-.853-1.183.854-1.181-.853-1.184.853-1.178-.852-1.18.852-1.181-.853-.059.042c1.082 2.186 3.036 3.811 5.969 3.811 2.935 0 4.889-1.628 5.971-3.815z",
  },
  coffee: {
    path: "M13 24h-7c-1.857-3.32-3.742-8.431-4-16h15c-.255 7.504-2.188 12.781-4 16zm5.088-14c-.051.688-.115 1.355-.192 2h1.707c-.51 1.822-1.246 3.331-2.539 4.677-.283 1.173-.601 2.25-.939 3.229 3.261-2.167 5.556-6.389 5.875-9.906h-3.912zm-7.714-3.001c4.737-4.27-.98-4.044.117-6.999-3.783 3.817 1.409 3.902-.117 6.999zm-2.78.001c3.154-2.825-.664-3.102.087-5.099-2.642 2.787.95 2.859-.087 5.099z",
  },
  star: {
    path: "M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z",
  },
  pin: {
    path: "M18 6c0-3.314-2.687-6-6-6s-6 2.686-6 6c0 2.972 2.164 5.433 5 5.91v12.09l2-2v-10.09c2.836-.477 5-2.938 5-5.91zm-8.66-1.159c-.53-.467-.516-1.372.034-2.023.548-.65 1.422-.799 1.952-.333s.515 1.372-.033 2.021c-.549.652-1.423.801-1.953.335z",
  },
  pawprint: {
    path: "M11.954 11c3.33 0 7.057 6.123 7.632 8.716.575 2.594-.996 4.729-3.484 4.112-1.092-.271-3.252-1.307-4.102-1.291-.925.016-2.379.836-3.587 1.252-2.657.916-4.717-1.283-4.01-4.073.774-3.051 4.48-8.716 7.551-8.716zm10.793-4.39c1.188.539 1.629 2.82.894 5.27-.704 2.341-2.33 3.806-4.556 2.796-1.931-.877-2.158-3.178-.894-5.27 1.274-2.107 3.367-3.336 4.556-2.796zm-21.968.706c-1.044.729-1.06 2.996.082 5.215 1.092 2.12 2.913 3.236 4.868 1.87 1.696-1.185 1.504-3.433-.082-5.215-1.596-1.793-3.824-2.599-4.868-1.87zm15.643-7.292c1.323.251 2.321 2.428 2.182 5.062-.134 2.517-1.405 4.382-3.882 3.912-2.149-.407-2.938-2.657-2.181-5.061.761-2.421 2.559-4.164 3.881-3.913zm-10.295.058c-1.268.451-1.92 2.756-1.377 5.337.519 2.467 2.062 4.114 4.437 3.269 2.06-.732 2.494-3.077 1.377-5.336-1.125-2.276-3.169-3.721-4.437-3.27z",
  },
  fish: {
    path: "M21 11c0-.552-.448-1-1-1s-1 .448-1 1c0 .551.448 1 1 1s1-.449 1-1m3 .486c-1.184 2.03-3.29 4.081-5.66 5.323-1.336-1.272-2.096-2.957-2.103-4.777-.008-1.92.822-3.704 2.297-5.024 2.262.986 4.258 2.606 5.466 4.478m-6.63 5.774c-.613.255-1.236.447-1.861.573-1.121 1.348-2.796 2.167-5.287 2.167-.387 0-.794-.02-1.222-.061.647-.882.939-1.775 1.02-2.653-2.717-1.004-4.676-2.874-6.02-4.287-1.038 1.175-2.432 2-4 2 1.07-1.891 1.111-4.711 0-6.998 1.353.021 3.001.89 4 1.999 1.381-1.2 3.282-2.661 6.008-3.441-.1-.828-.399-1.668-1.008-2.499.429-.04.837-.06 1.225-.06 2.467 0 4.135.801 5.256 2.128.68.107 1.357.272 2.019.495-1.453 1.469-2.271 3.37-2.263 5.413.008 1.969.773 3.799 2.133 5.224",
  },
  pizza: {
    path: "M6.127 4.259c6.741 1.591 11.289 4.752 13.731 13.508l-19.858 6.233 6.127-19.741zm-1.129 12.742c1.103 0 1.999.898 1.999 2 0 1.104-.896 2-1.999 2-1.104 0-1.999-.896-1.999-2 0-1.102.895-2 1.999-2m4.763-2.889c1.043.36 1.596 1.5 1.236 2.543-.361 1.043-1.501 1.597-2.543 1.236 0 0-.615-.217-.418-.783.195-.566.81-.351.81-.351.417.145.873-.076 1.018-.493.143-.419-.078-.874-.495-1.02 0 0-.629-.167-.417-.777.192-.554.809-.355.809-.355m-2.622-11.289c-1.385-.442-.93-2.823.747-2.823l.111.004c8.306 1.342 14.005 7.672 15.995 15.998l.008.153c0 1.544-2.378 2.031-2.89.723-2.154-7.803-6.827-12.358-13.971-14.055m7.357 11.178c.827 0 1.499.673 1.499 1.5 0 .829-.672 1.5-1.499 1.5-.829 0-1.501-.671-1.501-1.5 0-.827.672-1.5 1.501-1.5m-7.932-.052c-1.075-.254-1.741-1.332-1.487-2.406.253-1.074 1.331-1.741 2.404-1.487 0 0 .634.153.497.737-.138.584-.771.431-.771.431-.43-.102-.861.165-.962.595-.102.429.165.861.594.962 0 0 .642.103.494.732-.135.571-.769.436-.769.436m5.432-5.946c1.103 0 1.999.896 1.999 1.999 0 1.104-.896 2-1.999 2-1.104 0-2-.896-2-2 0-1.103.896-1.999 2-1.999",
  },
  glasses: {
    path: "M17.701 8c-3.236 0-3.525.934-5.701.923-2.176.011-2.461-.923-5.701-.923-2.119 0-4.397.332-6.299.715v1.462c.328.276.999.447 1.001 1.418.006 3.827 1.588 4.387 4.603 4.405 4.05 0 4.597-.927 5.273-4.148.15-.715.513-1.148 1.122-1.148s.972.434 1.122 1.148c.678 3.221 1.225 4.148 5.275 4.148 3.016-.018 4.598-.578 4.604-4.405.002-.971.673-1.142 1.001-1.418v-1.462c-1.903-.383-4.181-.715-6.3-.715zm-7.795 3.584c-.56 2.662-.688 3.442-4.297 3.416-2.839-.017-3.609-.57-3.609-3.426 0-1.516 0-2.574 4.299-2.574 1.925 0 3.106.441 3.511 1.028.215.313.248.836.096 1.556zm8.485 3.416c-3.608.026-3.736-.754-4.297-3.416-.151-.72-.119-1.244.097-1.556.404-.587 1.585-1.028 3.51-1.028 4.299 0 4.299 1.058 4.299 2.574 0 2.856-.77 3.409-3.609 3.426zm-.77-5.15c3.438 0 3.438.847 3.438 2.06 0 .232-.012.432-.025.628-.503-1.726-1.315-2.132-3.413-2.688zm-14.655 2.688c-.014-.196-.026-.396-.026-.628 0-1.213 0-2.06 3.438-2.06-2.097.556-2.909.962-3.412 2.688z",
  },
  crosshairs: {
    path: "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 13v-2h3.931c-.452-3.617-3.314-6.479-6.931-6.931v3.931h-2v-3.931c-3.617.452-6.479 3.314-6.931 6.931h3.931v2h-3.931c.452 3.617 3.313 6.479 6.931 6.931v-3.931h2v3.931c3.617-.452 6.479-3.313 6.931-6.931h-3.931z",
  }
}

var popMap = {
  map: null,
  icon: 'star',
  setIcon: function(iconName = null) {
    if (!iconName || !mapIcons[iconName]) {
      if (typeof iconName == "string") console.error(`Icon "${iconName}" not found`);
      console.log(`Current Icon = ${this.icon}\nIcon Options: ${Object.keys(mapIcons).sort().join(', ')}`);
      return;
    }
    this.icon = iconName;
    reloadMarkers();
  },
  markers: [],
  infoWindow: null,
}

var popMonitor = {
  wow_in_progress: false,
  id: null,
  interval: 2, // seconds
  max: 300, // seconds,
  startTime: null,
  start: function() {
    $('#fsp-monitor-buttons button.start').attr('disabled','');
    $('#fsp-monitor-buttons button.stop').removeAttr('disabled');
    let secondX = n => `${n} second${(n != 1) ? 's' : ''}`;
    if (this.id != null) {
      console.log('POP Monitor is already running');
    } else {
      this.startTime = Date.now();
      this.id = setInterval(function(){
        if((Date.now() - popMonitor.startTime) > (popMonitor.max * 1000)) {
          popMonitor.stop(true);
          return;
        }
        if (!popMonitor.wow_in_progress) popInfo.update();
      }, this.interval * 1000);
      console.log(`POP Monitor started and will check every ${secondX(this.interval)} for ${secondX(this.max)}`);
    }
  },
  stop: function(timedOut = false) {
    $('#fsp-monitor-buttons button.stop').attr('disabled','');
    $('#fsp-monitor-buttons button.start').removeAttr('disabled');
    if (this.id == null) {
      console.log('POP Monitor is NOT running');
    } else {
      clearInterval(this.id );
      this.id = null;
      this.startTime = null;
      console.log(`POP Monitor ${timedOut ? 'timed out' : 'stopped'}`);
    }
  },
  status: function() {
    console.log(`POP Monitor is ${(this.id == null) ? 'NOT ' : ''}running`)
  }
}

var popInfo = {
  localPop: 'LON',
  data: [],
  update: async function( initializeFirst = false ) {
    if (initializeFirst) this.data = [];
    await updatePopData();
    //if (pops.filter( pop => pop.state == 'CHANGED').length > 0) reloadMarkers();
    pops.filter( pop => pop.state == 'CHANGED').forEach( pop => setMarker(pop.code, true) );
  }
}

const qsParams = parseQueryString();

var pops = [];
var updatedPops;
var popIndexes = {};
var localPop = 'LON';


var statusValues = [
  {
    index: 0,
    name: "Operational",
    color: "green",
  },
  {
    index: 1,
    name: "Degraded Performance",
    color: "yellow",
  },
  {
    index: 2,
    name: "Partial Outage",
    color: "orange",
  },
  {
    index: 3,
    name: "Major Outage",
    color: "red",
  },
  {
    index: 4,
    name: "Maintenance",
    color: "blue",
  },
  {
    index: 5,
    name: "Not Available",
    color: "purple",
  }
];

function clickDismissButton() {
  var timerId = window.setInterval(function(){
    let eButton = document.querySelector('button.dismissButton');
    if (!eButton) return;
    clearInterval(timerId);
    document.querySelector('button.dismissButton').click();
  }, 10);
}

function parseQueryString() {
  const qs = window.location.search;
  var tmpReturn = {};
  var kvPairs = (qs[0] === '?' ? qs.substr(1) : qs).split('&');
  kvPairs.forEach( kvPair => {
    let tmp = kvPair.split('=');
    tmpReturn[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1] || '');
  });
  return tmpReturn;
}

async function updatePopData( initializeFirst = false ) {
  if (DEBUG_POP) DEBUG_POP.in_status = (DEBUG_POP.code in popIndexes) ? pops[popIndexes[DEBUG_POP.code]].status : '-';
  let url = `https://amy-and-the-geeks.edgecompute.app/${(pops.length == 0)?'':'noscrape'}`;
  //console.log(`pops.length ${pops.length} - ${url}`)
  const maxRetries = 1;
  let response = {ok: false};
  
  if (initializeFirst) pops = [];
  
  console.groupCollapsed('Updating POP Data');
  for (var retry = 0; !response.ok && retry < maxRetries;) {
    try {
      console.groupCollapsed(`Attempt ${ ++retry}`);
      response = await fetch(url, {credentials: 'same-origin'});
      console.log('Success');
      console.groupEnd();
    } catch(err) {
      //console.error(err.message);
      console.groupEnd();
    }
  }
  console.groupEnd();
  
  if (!response.ok) {
    throw new Error(`updatePopData failed - HTTP-Error: ${response.status}`);
  }
  
  let responseBody = await response.text();
  let tmpJson = JSON.parse(responseBody);
  localPop = tmpJson.current_pop;
  updatedPops = tmpJson.pop_status_data;

  // Set any unknown status values to the "Not Available" status
  let unknownStatusPops = [];
  updatedPops.forEach( pop => {
    let tmp = statusValues.filter( statusValue => statusValue.name == pop.status );
    if (tmp.length == 0) {
      unknownStatusPops.push([pop.code,pop.status]);
      pop.status = statusValues[statusValues.length - 1].name;
    }
  });
  if (unknownStatusPops.length != 0) {
    console.groupCollapsed(`Unknown Status POPs: ${unknownStatusPops.length}`);
    unknownStatusPops.forEach( kv => console.log(`${kv[0]}: ${kv[1]}`));
    console.groupEnd();
  }
  
  let statusTotals = {};
  statusValues.forEach( statusValue => {
    statusTotals[statusValue.name] = updatedPops.filter( pop => pop.status == statusValue.name).length;
  });
  console.log(JSON.stringify(statusTotals).replace(/\{?("([^"]+)":(\d+),?)\}?/g,function(m,p1,p2,p3){
    return `${p3} ${p2}${p1.endsWith(',')?'; ':''}`
  }));
  
  // Check for changed POP statuses or deleted/duplicated POPs
  let dupFound = false;
  pops.forEach( (pop, popIndex) => {
    let tmp = updatedPops.filter( uPop => pop.code == uPop.code );
    if (tmp.length == 0) {
      pop.state = 'DELETED';
    } else if (tmp.length == 1) {
      if (DEBUG_POP && tmp[0].code == DEBUG_POP.code) DEBUG_POP.update_status = tmp[0].status;
      let oldStatus = pop.status;
      pop.status = (tmp[0].status != 'Not Available') ? tmp[0].status : pop.initial_status;
      pop.state = `${(pop.status == oldStatus) ? 'UN' : ''}CHANGED`;
    } else {
      pop.state = 'DUPLICATED';
      console.error(`Duplicate POP ${popIndex}: ${pop.code} (tmp.length)`)
      dupFound = true;
    }
  });
  if (dupFound) console.error(`Duplicate POPs found - check POP states`);
  // Check for new POPs
  updatedPops.forEach( uPop => {
    if (pops.filter( pop => pop.code == uPop.code ).length == 0) {
      //console.log(`${uPop.code} added!${(uPop.code == DEBUG_POP.code)?' ******':''}`)
      popIndexes[uPop.code] = pops.length;
      pops.push(uPop);
      pops[pops.length - 1].initial_status = pops[pops.length - 1].status;
      pops[pops.length - 1].state = 'ADDED';
      //if (uPop.code == DEBUG_POP.code) console.log(pops[pops.length - 1])
      if (DEBUG_POP && uPop.code == DEBUG_POP.code) DEBUG_POP.update_status = pops[pops.length - 1].status;
    }
  });
  
  console.groupCollapsed(`Unchanged Status POPs: ${pops.filter( pop => pop.state == 'UNCHANGED').length} of ${pops.length}`);
  ['UNCHANGED','CHANGED','ADDED','DELETED','DUPLICATED'].forEach( state => {
    console.log(`${state}: ${pops.filter( pop => pop.state == 'UNCHANGED').length}`)
  });
  //console.log(popDeltas);
  console.groupEnd();

/*  
  // Update changed POP statuses
  pops.filter( pop => pop.state == 'CHANGED').forEach( pop => {
    pop.status = updatedPops.filter( uPop => uPop.code == pop.code).status;
  });
*/
  if (DEBUG_POP) {
    DEBUG_POP.initial_status = pops[popIndexes[DEBUG_POP.code]].initial_status;
    DEBUG_POP.out_status = pops[popIndexes[DEBUG_POP.code]].status;
    console.log(`${JSON.stringify(DEBUG_POP)}`)
    console.log(`${JSON.stringify(pops[popIndexes[DEBUG_POP.code]])}`)
  }
}

function tweakPopData() {
  Object.keys(qsParams).forEach( key => {
    let findVal = statusValues.filter( statusValue => statusValue.index ==  qsParams[ key ] );
    if ( findVal.length == 1 ) {
      key = key.toUpperCase();
      pops.filter( pop => key == '*' || pop.code == key).forEach( pop => pop.status = findVal[0].name);
    }
  });
}

// https://stackoverflow.com/questions/2472957/how-can-i-change-the-color-of-a-google-maps-marker#answer-23163930
function createStatusMarker(statusName) {

  let tmp = statusValues.filter(statusValue => statusValue.name == statusName);
  let statusValue = statusValues[ (tmp.length == 1) ? tmp[0].index : (statusValues.length - 1) ];
  
  return {
      path: mapIcons[popMap.icon].path,
      anchor: new google.maps.Point(0,0),
      fillOpacity: 1,
      fillColor: statusValue.color,
      strokeWeight: 0.75,
      strokeColor: "white",
      scale: 0.75,
      labelOrigin: new google.maps.Point(0,0)
  };
}

function setMarker(popCode, nullify = false) {
  let popIndex = popIndexes[popCode], pop = pops[popIndex];
  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(pop.latitude, pop.longitude),
    icon: createStatusMarker(pop.status),
    map: popMap.map,
    title: pop.code
  });
  if (popIndex > popMap.markers.length) {
    console.error(`Error setting marker for ${pop.code}`);
    return;
  }
  if (popIndex == popMap.markers.length) {
    popMap.markers.push( marker );
  } else {
    if (nullify) popMap.markers[ popIndex ].setMap(null);
    popMap.markers[ popIndex ] = marker;
  }
  google.maps.event.addListener(marker, 'click', (function (marker, count) {
    return function () {
      let content = [
        `<section class="pop">`,
        `<div>${pop.name}</div>`,
        `<span>Code:</span> ${pop.code}<br>`,
        `<span>Group:</span> ${pop.group}<br>`,
        `<span>Shield:</span> ${(pop.shield) ? pop.shield : '-'}<br>`,
        `<span>Status:</span> ${pop.status}`,
        `<\section>`,
      ];
      popMap.infoWindow.setContent(content.join(''));
      popMap.infoWindow.open(popMap.map, marker);
    }
  })(marker, popIndex));
}

// https://stackoverflow.com/questions/22773651/reload-markers-on-googles-maps-api/26408428
function setMarkers() {
  pops.forEach(pop => {
    setMarker(pop.code);
  });
}

function reloadMarkers() {
    for (var i=0; i<popMap.markers.length; i++) {
        popMap.markers[i].setMap(null);
    }
    popMap.markers = [];
    setMarkers();
}

// https://medium.com/@limichelle21/integrating-google-maps-api-for-multiple-locations-a4329517977a
async function initMap() {
  
  clickDismissButton();

  await updatePopData();
  
  if (QS_STATUS_TWEAKING) tweakPopData();
  
  
  let defaultOpts = {
    center: {lat:zoom.data.world.lat, lng:zoom.data.world.lng},
    zoom: zoom.data.world.zoom,
    fullscreenControl: false,
  }
  popMap.map = new google.maps.Map(document.getElementById('fastly-status-map'), defaultOpts);
  
  popMap.infoWindow = new google.maps.InfoWindow({});
  
  google.maps.event.addListener(popMap.map, "click", function(event) { popMap.infoWindow.close(); });
  
  setMarkers();
  
  initLegend();
  $('#home').text(`(${localPop})`)
  
  if (START_POP_MONITOR && location.host != GLITCH_DOMAIN)
    popMonitor.start();
}

function initLegend() {
  
  function addOptions(name, data) {
    let percentageWidth = `${(1 / data.length) * 100}%`;
    //console.log(`addOptions(): ${name} ${data.length} ${percentageWidth}`)
    data.forEach(datum => {
      let jqObject = $(`#options .${name}-filter`)
        .append($('<td>',{visible:'1', name: datum.name}))
        .children().last()
        .append($('<div>',{class:'legend-item'}))
        .children().last();
      if ('color' in datum) {
        let newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSvg.setAttribute('viewBox', '0 0 24 24');
        newSvg.setAttribute('width', '18');
        newSvg.setAttribute('height', '18');
        newSvg.setAttribute('stroke', 'black');
        newSvg.setAttribute('stroke-width', '0.75');
        newSvg.setAttribute('fill', datum.color);
        let newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        newPath.setAttribute('d', mapIcons[popMap.icon].path);
        jqObject.append( newSvg ).children().last().append( newPath );
      }
      jqObject.append($('<span>',{html:datum.name.replace(/ /g,'<br>').replace(/\//g,'/<br>')}))
      if (datum.name == 'Home') jqObject.children().last().append($('<div>',{id:'home'}))
    });
    $(`#options .${name}-filter td`).width(percentageWidth);
  }
  
  $('#tabs td').click(function(){
    $('#frame').attr("class",$(this).attr("class"));
  });
  
  addOptions('status',statusValues);
  
  let groupNames = [], groups = [];
  pops.forEach(pop => groupNames.push(pop.group));
  groupNames.sort();
  groupNames = [...new Set(groupNames)];
  for(let i=0; i<groupNames.length; i++) { groups.push({name: groupNames[i]}); }
  groups.unshift({name: 'Home'});
  groups.push({name: 'World'});
  
  addOptions('group',groups);
  
  $('#options tr').height(`${$('#options').innerHeight()}px`);
  
  $(`#options td`)
    .click(function(){
      if ($(this).parent().hasClass('group-filter')) {
        zoom.set($(this).attr('name'));
        return;
      }
      let vizVals = {status:{},group:{}}; 
      popMap.infoWindow.close();
      $(this).attr('visible',($(this).attr('visible') == '1') ? '0' : '1');
      ['status','group'].forEach( tab => {
        $(`#options .${tab}-filter td`).each(function(){
          vizVals[tab][$(this).attr('name')] = $(this).attr('visible');
        });
      });
      ['status','group'].forEach( tab => {
        if (Object.keys(vizVals[tab]).filter(index => vizVals[tab][index] === '1').length == 0) alert(`No ${tab} values selected!`);
      });
      popMap.markers.forEach( (marker, index) => {
        marker.setVisible(vizVals.status[pops[index].status] == '1' && vizVals.group[pops[index].group] == '1');
      });
    });
}

function initBody() {
  if ($('#fastly-status-map-container').length != 1) return;
  $('#fastly-status-map-container')
    .append($('<div>',{id:'fastly-status-map'}))
    .append($('<div>',{id:'fastly-status-legend'}));
  $('#fastly-status-legend')
    .append($('<table>',{id:'frame', class:'status-filter'})).children().last()
      .append($('<tr>')).children().last()
        .append($('<td>',{id:'tabs'}))
        .append($('<td>',{id:'options'}));
  $('#tabs').append($('<table>'));
  $('#tabs table')
    .append($('<tr>')).children().last()
      .append($('<td>',{class:'status-filter'})).children().last()
        .append($('<span>',{class:'button'})).children().last()
          .append($('<span>',{text:'Status Filter'}));
  $('#tabs table')
    .append($('<tr>')).children().last()
      .append($('<td>',{class:'group-filter'})).children().last()
        .append($('<span>',{class:'button'})).children().last()
          .append($('<span>',{text:'Zoom Controls'}));
  $('#options')
    .append($('<table>')).children().last()
      .append($('<tr>',{class:'status-filter'}))
      .append($('<tr>',{class:'group-filter'}));
}

function addSampleIcons() {
  function createIcons(status,icon) {
  let newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  newSvg.setAttribute('viewBox', '0 0 24 24');
  newSvg.setAttribute('width', '24');
  newSvg.setAttribute('height', '24');
  newSvg.setAttribute('stroke', 'black');
  newSvg.setAttribute('stroke-width', '0.75');
  let newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  newPath.setAttribute('d', mapIcons[icon].path);
  $(`${tmpSelector} > div.${icon}`)
    .append($('<div>',{class:status,style:'display: inline-block; padding: 1em'})).children().last()
    .append( newSvg ).children().last()
    .append( newPath );
  }
  
  var tmpSelector = '#fastly-status-map-container'
  $(tmpSelector).append($('<style>'));
  let tmpStatus = {};
  statusValues.forEach( statusValue => {
    let status = statusValue.name.replace(/ /g,'-').toLowerCase();
    tmpStatus[status] = statusValue.color;
    $(`${tmpSelector} style`).text(`${$(`${tmpSelector} style`).html()}\n${tmpSelector} > div div.${status} svg { fill:${statusValue.color} }`);
  });
  Object.keys(mapIcons).forEach( icon =>  {
    if (icon == popMap.icon) {
      $(tmpSelector).append($('<div>',{class:icon}));
      Object.entries(tmpStatus).forEach( kv =>  createIcons(kv[0],icon) );
    }
  });
}

var zoom = {
  homePop: null,
  data: {
    africa: {lat: 0.06713329556280945, lng: 19.926710106136817, zoom: 2.5},
    asia_pacific: {lat:-8.067555718733956, lng:101.90176804246921, zoom:2.2},
    europe: {lat:50.78170270303783, lng:369.719548804401, zoom:3.5},
    united_states: {lat:37.60034090066672, lng:-99.08889958741243, zoom:3.5},
    south_america: {lat: -25.85834838414139, lng: -62.86334514248203, zoom: 2.5},
    world: {lat:7.086830762971572, lng:-84.86513931591246, zoom:1.6},
    home: null,
  },
  get: function() {
    let o = {lat:popMap.map.getCenter().lat(), lng:popMap.map.getCenter().lng(), zoom:popMap.map.getZoom()};
    console.log(JSON.stringify(o).replace(/"/g,'').replace(/,/g,', '));
  },
  set: function(n){
    let k = n.replace(/[ /]/g, '_').toLowerCase();
    if (!(k in this.data)) {
      console.error(`${n} (${k}) not found`);
      return;
    }
    if (k == 'home' && this.data.home == null) this.initHome();
    let o = this.data[k];
    popMap.map.setCenter({lat:o.lat, lng:o.lng});
    popMap.map.setZoom(o.zoom);
  },
  initHome: function(homePop = localPop) {
    if (!homePop || typeof homePop == 'undefined') { this.data.home = null; return; }
    let tmp = [];
    if (homePop) tmp = pops.filter( pop => pop.code == homePop);
    if (tmp.length == 1) {
      $('#home').text(`(${homePop})`);
      this.data.home = {lat: tmp[0].latitude, lng: tmp[0].longitude, zoom: 6};
    } else {
      this.data.home = {...this.data.world};
    }
  }
}

function wow(maxSeconds = 30) {
  let getRandomInt = max => Math.floor(Math.random() * max);
  let startTime = Date.now();
  popMonitor.wow_in_progress = true;
  let id = setInterval(function(){
    if((Date.now() - startTime) > (maxSeconds * 1000)) {
      clearInterval(id );
      popMonitor.wow_in_progress = false;
      return;
    }
    let popIndex = getRandomInt(pops.length);
    let popCode = pops[popIndex].code;
    let statusIndex = getRandomInt(statusValues.length);
    pops[popIndex].status = statusValues[statusIndex].name;
    setMarker(popCode, true);
  }, this.interval * 50);
}

var demo = {
  lastOverrides: null,
  callApi: async function(qs = null) {
    let aatgUrl = 'https://amy-and-the-geeks.edgecompute.app/set_pop';
    if (qs) aatgUrl += `?${qs}`
    let response = await fetch(aatgUrl);
    this.lastOverrides = await response.text();
  },
  setPop:  async function (popCode = null, popStatus = null, refreshMap = true) {
    //console.log(`demo(${JSON.stringify(popCode)}, ${JSON.stringify(popStatus)})`)
    let popCodeOk = popCode != null;
    let popStatusOk = popStatus != null;
    if (!popCodeOk && !popStatusOk) {
      let msgText = [
        `Current setting: ${await this.callApi()}`,
        `To set a status for a POP, enter "demo(POP_CODE, POP_STATUS)"`
      ]
      console.log(msgText.join('\n').replace(/\n/g,'\n\n'));
      return;
    }
    popCodeOk = typeof popCode == 'string' && popCode != '';
    if (popCodeOk && popCode != '*') {
      popCode = popCode.toUpperCase();
      popCodeOk = pops.filter(pop => pop.code == popCode).length == 1;
    }
    if (popStatusOk && popStatus != '-') {
      popStatusOk = statusValues.map(sV => sV.index).includes(parseInt(popStatus));
    }
    if (!popCodeOk || !popStatusOk) {
      let msgText = [
        'Usage: demo(POP_CODE, POP_STATUS)',
        'where:',
        `POP_CODE = '*' (for all POPs) or one of the following: ${pops.map(pop => `'${pop.code}'`).sort().join(', ')}`,
        `POP_STATUS = '-' (to delete existing status) or one of the following: ${statusValues.map(sV => `${sV.index} (${sV.name})`).join(', ')}`
      ]
      console.error(msgText.join('\n').replace(/\n/g,'\n\n'));
      return;
    }
    await this.callApi(`${popCode}=${popStatus}`);
    console.log(`New setting: ${this.lastOverrides}`);
    if (popMonitor.id == null && refreshMap) popInfo.update();
  }
}