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

//Default random reactors
const createDefaultReactors = (amount) => {
  for (let index = 0; index < amount; index++) {
    reactors.push(new Reactor(index));
  }
};

//updateAll (Random temperature increase or decrease)
const updateAllReactorTemperatures = (reactorData) => {
  reactors.length = 0;
  reactorData.map((reactor, i) => {
    reactors.push(new Reactor(i, reactor._Powergrid, reactor._Temperature));
  });
};

//update One reactor (scenario buttons)
const updateReactorState = (reactor) => {
  reactors[reactor._id].UpdateState(reactor._Status);
};

//Reset after meltdown
const resetReactorMeltdowns = () => {
  reactors.map((reactor) => {
    reactor.ResetMeltdown();
  });
};

createDefaultReactors(reactorAmount);
console.log(reactors);

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
  console.log("reactors requested");
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

//Update all statusses & temperatures from the reactors (RandomTemperature)
APP.put("/reactors/update/temperature", (req, res) => {
  console.log("Temperature update requested");
  let response = {};
  try {
    updateAllReactorTemperatures(req.body.data);
    response = { action: "Update All Temperatures", status: "OK" };
  } catch (error) {
    response = { action: "Update All Temperatures", status: "NOK" };
  }
  return res.send(JSON.stringify(response));
});

//Update status from this reactor (on/off/meltdown button)
APP.put("/reactor/update/state", (req, res) => {
  console.log("state update requested (test scenario's)");
  let response = {};
  try {
    updateReactorState(req.body.data);
    response = { action: "Update Reactor State", status: "OK" };
  } catch (error) {
    response = { action: "Update Reactor State", status: "NOK" };
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
  console.log(`App running at http://localhost:${PORT}`);
});

// ---------------------------------------
// #endregion
