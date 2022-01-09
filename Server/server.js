// #region IMPORTS / EXPRESS SETUP
// ---------------------------------------
import { Reactor } from "./Modules/reactor.js";
import express from "express";
const APP = express();
const PORT = 2022;

// ---------------------------------------
// #endregion

// #region JAVASCRIPT CODE
// ---------------------------------------
const reactorAmount = 3;
const reactors = [];

// Create default reactors when this server/backend starts
for (let index = 0; index < reactorAmount; index++) {
  reactors.push(new Reactor(index));
}
console.log("Reactors created:");
console.log(reactors);

// ---------------------------------------
// #endregion

// #region EXPRESS CODE
// ---------------------------------------

/* ---ACTIVATE MIDDLEWARE--- */
// De Reactor Control
APP.use("/", express.static("../Client/Public/ReactorControl"));
APP.use(express.json());

/* ---ENDPOINTS--- */

// Return all the reactors
APP.get("/api/reactor", (req, res) => {
  console.log("HTTP GET received: reactors requested");
  res.send(JSON.stringify(reactors));
});

// Reset all reactor statusses & temperatures 
APP.post("/api/meltdownreset", (req, res) => {
  console.log("HTTP POST received: meltdown reset requested");
  let response = {};
  try {

    reactors.forEach((reactor) => {
      reactor.resetMeltdown();
    });

    response = { action: "Meltdown Reset", status: "OK" };
  } catch (error) {
    response = { action: "Meltdown Reset", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});


/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`Reactor Control app running at http://localhost:${PORT}.\nAPI for ajax calls available at http://localhost:${PORT}/api.`);
});

// ---------------------------------------
// #endregion
