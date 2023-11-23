require('dotenv').config(); // Add this line at the top

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./configs/connectdb");
const serverConfig = require("./configs/server.config");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CRM Backend App API created By Dharma Full Stack Developer",
  });
});

// Import and use your routes
require("./Routes/userRoutes")(app);
require("./Routes/authRoutes")(app);
require("./Routes/ticketRoutes")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Application running on port ${serverConfig.PORT}`);
});
