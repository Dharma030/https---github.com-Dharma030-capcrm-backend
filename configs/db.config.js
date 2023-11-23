require("dotenv").config();

module.exports = {
  DB_Name: "CRM",
  DB_URL: process.env.MONGODB_URI || "mongodb://localhost:27017/CRM", // Use the environment variable if available, otherwise use a default local URI
};
