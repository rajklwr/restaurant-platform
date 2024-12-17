const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const corsOptions = {
    origin: 'http://192.168.1.4:3000',
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
