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
// De Reactor Control is bereikbaar op twee url's
APP.use("/", express.static("../Client/Public/ReactorControl"));
APP.use("/reactor-control", express.static("../Client/Public/ReactorControl"));
APP.use(express.json());

/* ---ENDPOINTS--- */
// HTTP GET to /api/reactor: return all the reactors.
APP.get("/api/reactor", (req, res) => {
  console.log("HTTP GET received: reactors requested");
  res.send(JSON.stringify(reactors));
});

// HTTP POST to /api/reactor: reset all reactor statusses & temperatures after a meltdown.
APP.post("/api/reset", (req, res) => {
  console.log("HTTP POST received: reset requested");
  let response = {};
  try {    
    // Alle reactors resetten
    reactors.forEach((reactor) => {
      reactor.reset();
    });

    response = { action: "Meltdown Reset", status: "OK" };
  } catch (error) {
    response = { action: "Meltdown Reset", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

// HTTP PUT to /api/reactor: update status from this reactor (on/off/cooldown/meltdown button)
APP.put("/api/reactor", (req, res) => {
  console.log("HTTP PUT received: state update requested");
  let response = {};
  try {
    // Reactor status bijwerken
    reactors[req.body.data._id].updateState(req.body.data._status);

    response = { action: "Update Reactor State", status: "OK" };
  } catch (error) {
    response = { action: "Update Reactor State", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

//HTTP POST to /api/reactor: add new reactor and generate random values
APP.post("/api/reactor", (req, res) => {
  console.log("HTTP POST received: reactor creation requested");
  let response = {};
  try {
    // Reactor aanmaken en toevoegen aan lijst van reactors.
    reactors.push(new Reactor(reactors.length));
    
    response = { action: "Create Reactor", status: "OK" };
  } catch (error) {
    response = { action: "Create Reactor", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`Reactor Control app running at http://localhost:${PORT} (and http://localhost:${PORT}/reactor-control).\nAjax calls can be sent to http://localhost:${PORT}/api/...`);
});

// ---------------------------------------
// #endregion
