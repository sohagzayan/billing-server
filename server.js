const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/connectDatabase");

dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is open on http://localhost:${process.env.PORT}`);
});

// unhandled promise Rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
