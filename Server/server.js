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

// Create default reactors
// This function is called once, when the server starts.
const createDefaultReactors = (amount) => {
  for (let index = 0; index < amount; index++) {
    reactors.push(new Reactor(index));
  }
};

//update One reactor (scenario buttons)
const updateReactorStatus = (reactor) => {
  reactors[reactor._id].updateStatus(reactor._status);
};

//Reset after meltdown
const resetReactorMeltdowns = () => {
  reactors.map((reactor) => {
    reactor.resetMeltdown();
  });
};

createDefaultReactors(reactorAmount);
console.log(reactors);
// setInterval(updateAllReactorTemperaturesRandomly, 1000);

// ---------------------------------------
// #endregion

// #region EXPRESS CODE
// ---------------------------------------

/* ---ACTIVATE MIDDLEWARE--- */
APP.use("/reactor", express.static("../Client/Public/ReactorControl"));
APP.use(express.json());

/* ---ENDPOINTS--- */
//return all the reactors
APP.get("/api/reactor", (req, res) => {
  console.log("HTTP GET received: reactors requested");
  res.send(JSON.stringify(reactors));
});

//Update status from this reactor (on/off/meltdown button)
APP.put("/api/reactor", (req, res) => {
  console.log("HTTP PUT received: update (status of) reactor");
  let response = {};
  try {
    updateReactorStatus(req.body.data);
    response = { action: "Update Reactor Status", status: "OK" };
  } catch (error) {
    response = { action: "Update Reactor Status", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

//Add new reactor and generate random values
APP.post("/api/reactor", (req, res) => {
  console.log("HTTP POST received: reactor creation requested");
  let response = {};
  try {
    reactors.push(new Reactor(reactors.length));
    response = { action: "Create Reactor", status: "OK" };
  } catch (error) {
    response = { action: "Create Reactor", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

//Reset all reactor statusses & temperatures 
APP.post("/api/meltdownreset", (req, res) => {
  console.log("HTTP POST received: meltdown reset requested");
  let response = {};
  try {
    resetReactorMeltdowns();
    response = { action: "Meltdown Reset", status: "OK" };
  } catch (error) {
    response = { action: "Meltdown Reset", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`Reactor Control app running at http://localhost:${PORT}/reactor`);
});

// ---------------------------------------
// #endregion
