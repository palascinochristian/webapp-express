const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const moviesRouter = require("./routers/moviesRouter");

const app = express();
const { PORT, FE_URL } = process.env;

app.use(
  cors({
    origin: FE_URL,
  })
);
// middleware per i file statici
app.use(express.static("public"));
// middleware per il parsing del req.body
app.use(express.json());
// middleware CORS (che permette la comunicazione con il FE)

// Routes (le rotte della mia applicazione)
app.use("/movies", moviesRouter);

// Middlewares - Per la gestione degli errori (404, 500)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
