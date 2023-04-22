"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
const helmet_1 = __importDefault(require("helmet")); // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
const mongoose_1 = __importDefault(require("mongoose"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize")); // This module searches for any keys in objects that begin with a $ sign or contain a ., from req.body, req.query or req.params.
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
require("./config/db.ts").connect(mongoose_1.default);
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true
}));
// app.options("*", cors());
app.options("*", (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: '3dofjiarfngwnfvun',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use((0, helmet_1.default)());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
const limiter = (0, express_rate_limit_1.default)({
    max: 3000,
    windowMs: 60 * 60 * 1000,
    message: "Too many Requests from this IP, please try again in an hour!",
});
app.use("/slate", limiter);
app.use(express_1.default.urlencoded({
    extended: true,
})); // Returns middleware that only parses urlencoded bodies
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.urlencoded({
    extended: true,
})); // Returns middleware that only parses urlencoded bodies
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use('/slate/api', index_1.default);
app.get('/', (req, res) => {
    res.send('server is live');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
