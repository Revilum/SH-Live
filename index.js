const express = require('express');
const path = require('path');
const cors = require('cors')

cors({credentials: true, origin: true})
const app = express();
app.use(cors({credentials: true, origin: true}))

const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

app.use(allowCrossDomain);

app.use('/', express.static(path.join(__dirname, "./website")));

app.listen(3000, () => console.log("running on port 3000"));
