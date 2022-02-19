require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");

// Db connection
const connectDb = require("./db/connect");

// Auth middleware
const authMiddleware = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const theaterRouter = require("./routes/theaters");
const movieRouter = require("./routes/movies");
const bookingRouter = require("./routes/bookings");
const payments = require("./routes/payments");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to BookMySeats!</h1>
      <div>
        <h3><u>REST Endpoints</u></h3>
        <p><b>Authentication:</b>/api/v1/auth</p>
        <p><b>Theaters:</b>/api/v1/theaters</p>
        <p><b>Movies:</b>/api/v1/movies</p>
        <p><b>Bookings:</b>/api/v1/bookings</p>
      </div>
    `);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/theaters", authMiddleware, theaterRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/bookings", authMiddleware, bookingRouter);
app.use("/api/v1/payments", authMiddleware, payments);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
