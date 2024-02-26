const API_URL = "http://localhost:3765"
const REQUEST_PARAMS = {
    north: 54.9393591,
    west: 8.2637111,
    south: 53.4985902,
    east: 11.3579961,
    opt: {
        //results: 256,
        polylines: true,
        subStops: false,
        entrances: false,
        language: 'de'
    }
}

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
    let tmp = (await (await fetch(API_URL + "/radar", {
        method: "POST",
        body: JSON.stringify(REQUEST_PARAMS),
        headers: {
            "Content-Type": "application/json"
        }
    })).json())

    console.log(JSON.stringify(tmp.movements))

    tmp.movements.forEach(obj => {
        L.marker([obj.location.latitude, obj.location.longitude], {icon: tmpIcon}).addTo(map)
    })
}

updateData().then(()=> console.log("updated data"))
setInterval(updateData, 10000)