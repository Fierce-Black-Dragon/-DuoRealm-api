
import express, { Express, Application,Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import xss from 'xss-clean';
import rateLimit from "express-rate-limit"; // Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
import helmet from "helmet"; // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
import mongoose from "mongoose"
import mongosanitize from "express-mongo-sanitize"; // This module searches for any keys in objects that begin with a $ sign or contain a ., from req.body, req.query or req.params.
import router from "./routes/index"
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config();
require("./config/db.ts").connect(mongoose);
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true
  }));
  
// app.options("*", cors());
app.options("*", cors() as (req: any, res: any, next: any) => void);


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: '3dofjiarfngwnfvun',
        resave: false,

        saveUninitialized: false,
        cookie: { secure: false },
    }),
);

app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000, // In one hour
    message: "Too many Requests from this IP, please try again in an hour!",
});


app.use("/slate", limiter);
app.use(
    express.urlencoded({
        extended: true,
    })
); // Returns middleware that only parses urlencoded bodies

app.use(mongosanitize());


app.use(
    express.urlencoded({
        extended: true,
    })
); // Returns middleware that only parses urlencoded bodies

app.use(mongosanitize());

app.use(xss());
app.use(morgan("dev"))
app.use('/slate/api', router);
app.get('/', (req: Request, res: Response) => {
    res.send('server is live');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});