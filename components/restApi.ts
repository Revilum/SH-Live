import cors from "cors";
import bodyParser from "body-parser"
import {TripOptions} from "hafas-client";

import {client, app} from "../constants.js"
import {TripRequest} from "../types.js"


async function initServer() {
  app.use(cors())
  app.use(bodyParser.json())

  createPOST("/trip", async (reqParam) => {
    const opt: TripOptions = {
      polyline: true,
      subStops: true,
      entrances: false,
      language: "de"
    }
    const tripReq = reqParam as TripRequest
    return await client.trip!(tripReq.id, opt)
  })

  app.get("/", (_, res) => {
    res.send((new Date()).toLocaleString())
  })
}

function createPOST(endpoint: string, func: (reqParam: object) => Promise<object>) {
    app.post(endpoint, async (req, res) => {
      try {
        res.json(await func(req.body))
      } catch (err) {
        if (err instanceof Error) {
          res.status(400).send(err.message)
        } else {
          res.status(500).send("I don't fucking know")
        }
    }
  })
}

export {initServer}
