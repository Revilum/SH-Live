const API_URL = "http://localhost:3765"
const REQUEST_PARAMS = {
    north: 54.9393591,
    west: 8.2637111,
    south: 53.4985902,
    east: 11.3579961,
    opt: {
        products: {
            suburban: true, //S-Bahn Hambugr
            subway: true, //U-Bahn Hamburg
            bus: false, //Linienbusse
            ferry: true, //Fähren
            regional: true, //Alle RE/RB/AKN
            onCall: false, //OnCall Busse.
            national: true, //Intercity(IC)/Eurocity(EC)
            nationalExpress: true, //Intercity Express(ICE)
            interregional: true //Das Sylt-Shuttle Plus Meme. Heisst irgendwie A10 oder so kp
        },
        results: 512,
        polylines: true,
        subStops: false,
        entrances: false,
        language: 'en'
    }
}

const MARKERS = {}

const map = L.map('map', {
    center: [54.3126897, 10.129182],
    zoom: 17
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const tmpIcon = L.icon({
    iconUrl: "../img/tmp.png",
    iconSize: [61, 43],
})

async function updateData() {
    let data = (await (await fetch(API_URL + "/radar", {
        method: "POST",
        body: JSON.stringify(REQUEST_PARAMS),
        headers: {
            "Content-Type": "application/json"
        }
    })).json())

    /*MARKERS.forEach((obj) => {
        map.removeLayer(obj)
    })

    MARKERS.length = 0*/
    const currentUpdateTime = Date.now().toString();
    data.movements.forEach(train => {
        if (MARKERS[train.tripId] !== undefined) {
            MARKERS[train.tripId].marker.setLatLng(new L.LatLng(train.location.latitude, train.location.longitude))
            MARKERS[train.tripId].lastUpdate = currentUpdateTime
        } else {
            MARKERS[train.tripId] = {
                marker: L.marker([train.location.latitude, train.location.longitude], {icon: tmpIcon})
                    .bindPopup(train.line.name + " nach " + train.direction)
                    .addTo(map),
                lastUpdate: currentUpdateTime
            }
        }
    })

    for (const [trip, marker] of Object.entries(MARKERS)) {
        if (marker.lastUpdate !== currentUpdateTime) {
            map.removeLayer(marker.marker)
            delete MARKERS[trip]
        }
    }
}

updateData().then()
setInterval(updateData, 10000)