import express from "express";
import errorMiddleware from "./backend/middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const app = express();
app.use(express.json());
app.use(cookieParser());
//Middleware
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(fileUpload());


if(process.env.NODE_ENV!=="PRODUCTION"){
    // config
    dotenv.config({path:"backend/config/config.env"});
}

// Route Imports
import product from "./backend/routes/productRoute.js";
import user from "./backend/routes/userRoute.js";
import order from "./backend/routes/orderRoute.js";
import payment from "./backend/routes/paymentRoute.js";

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//To run frontend and backend on same port
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "./frontend/build")));
app.get("*",(req,res) => {
    res.sendFile(resolve(__dirname, "./frontend/build/index.html"));
});

//Middleware for errors
app.use(errorMiddleware);


export default app;