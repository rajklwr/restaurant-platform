const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: function (origin, callback) {
      // Check if the incoming request's origin is in the allowedOrigins list
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          // If it matches one of the allowed origins or no origin (for non-browser requests like Postman), proceed
          callback(null, true);
      } else {
          // If the origin is not allowed, reject the request
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
  

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Import routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/menus", require("./routes/menus"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
