import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.get("/", (req, res) => {
    res.json({message : "the TableFlow server !! "});
})

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;
 