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
  reactors[reactor._id].updateStatus(reactor._Status);
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
APP.get("/reactors/get", (req, res) => {
  console.log("HTTP GET received: reactors requested");
  res.send(JSON.stringify(reactors));
});

//Reset all statusses & temperatures from the reactors (Reset Meltdown)
APP.put("/reactors/reset", (req, res) => {
  console.log("meltdown reset requested");
  let response = {};
  try {
    resetReactorMeltdowns();
    response = { action: "Meltdown Reset", status: "OK" };
  } catch (error) {
    response = { action: "Meltdown Reset", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

//Update status from this reactor (on/off/meltdown button)
APP.put("/reactor/status", (req, res) => {
  console.log("status update requested");
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
APP.post("/reactor/add", (req, res) => {
  console.log("reactor creation requested");
  let response = {};
  try {
    reactors.push(new Reactor(reactors.length));
    response = { action: "Create Reactor", status: "OK" };
  } catch (error) {
    response = { action: "Create Reactor", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

/* ---START SERVER--- */
APP.listen(PORT, () => {
  console.log(`Reactor Control app running at http://localhost:${PORT}/reactor`);
});

// ---------------------------------------
// #endregion
