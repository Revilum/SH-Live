import WebSocket from "ws";
import {v4 as uuid} from 'uuid';
import {Radar, RadarOptions} from "hafas-client";

import {client, wss} from "../constants.js";

const clients: Map<string, WebSocket> = new Map()
let radarData = await getRadarData();

async function initWss() {
  const id = uuid()
  wss.on("connection", (ws) => {
    clients.set(uuid(), ws)
    ws.send(JSON.stringify(radarData))
  })

  wss.on("close", () => {
    clients.get(id)?.close()
  })
}

async function getRadarData(): Promise<Radar> {
  const opt: RadarOptions = {
    products: {
      suburban: true, //S-Bahn Hamburg
      subway: false, //U-Bahn Hamburg - die Daten sind ungenau um hilfreich zu sein
      bus: false, //Linienbusse
      ferry: true, //Fähren
      regional: true, //Alle RE/RB/AKN
      onCall: false, //OnCall Busse.
      national: true, //Intercity(IC)/Eurocity(EC)
      nationalExpress: true, //Intercity Express(ICE)
      interregional: true //Das Sylt-Shuttle Plus Meme. Heisst irgendwie A10 oder so kp
    },
    results: 512,
    polylines: false, //irgendwie kaputt, weil nur 4 Punkte angezeigt werden.
    subStops: false,
    entrances: false,
  }

  return await client.radar!({
    north: 54.9393591,
    west: 8.2637111,
    south: 53.4985902,
    east: 11.3579961
  }, opt)
}

async function updateRadar() {
  radarData = await getRadarData()
  for (const ws of clients.values()) {
    ws.send(JSON.stringify(radarData))
  }
}

export {initWss, updateRadar}