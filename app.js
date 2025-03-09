require("dotenv").config();
const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const moviesRouter = require("./routers/moviesRouter");
//Auth
const authRouter = require("./routers/authRouters");

const app = express();
const { PORT, FE_URL } = process.env;

app.use(cors({ origin: FE_URL }));
app.use(express.static("public"));
app.use(express.json());

// Routes
app.use("/movies", moviesRouter);
app.use("/auth", authRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
