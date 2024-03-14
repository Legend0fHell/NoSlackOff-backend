import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

import {initWebRoutes} from "./routes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));

initWebRoutes(app);

app.listen(process.env.BACKEND_PORT || 3000, () => {
    console.log("No time for you to slacking off now!! I'm staring at you from port " + (process.env.PORT || 3000));
});

