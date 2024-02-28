import express from "express";
import {WebSocketServer} from "ws"
import {createClient, HafasClient} from "hafas-client"
import {profile} from "hafas-client/p/nahsh/index.js"

const app = express()
const wss = new WebSocketServer({port: 1934})
const client: HafasClient = createClient(profile, "NAHSHPROD")!

export {app, wss, client}