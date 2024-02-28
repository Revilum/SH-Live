import {initServer} from "./components/restApi.js"
import {app} from "./constants.js";
import {initWss, updateRadar} from "./components/wsServer.js";

await initServer()
await initWss()


app.listen(1825, () => console.log("rest-api is running on port 1825 and websocket server on port 1934"));

await updateRadar()
setInterval(updateRadar, 10000)