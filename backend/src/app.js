import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import tableRouter from "./routes/table.routes.js";
import menuRouter from "./routes/menu.routes.js";
import orderRouter from "./routes/order.routes.js";
import kitchenRouter from "./routes/kitchen.routes.js";
import restaurantSettingsRouter from "./routes/restaurantSettings.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/kitchen-tickets", kitchenRouter);
app.use("/api/v1/restaurant-settings", restaurantSettingsRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.use(errorHandler);

export default app;
 