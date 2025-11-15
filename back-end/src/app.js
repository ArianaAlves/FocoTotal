import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;
