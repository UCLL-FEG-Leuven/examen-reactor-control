import { Reactor } from "./Modules/reactor.js";
import { Diagnostics } from "./Modules/diagnostics.js";

let temperatureUnit = "C";

const getReactors = async () => {
  let reactors = await Reactor.getReactors();
  Diagnostics.generateDiagnosticsWidget(diagnosticsHtmlElement, reactors, temperatureUnit);
  generateReactorHtml(reactors);
};

// #region Widget interface
// ---------------------------------------
const reactorManagementListeners = () => {
  document.querySelector("#createReactor").addEventListener("click", async () => {
    await Reactor.createReactor();
    getReactors();
  });

  document.querySelector("#resetMeltdown").addEventListener("click", async () => {
    await Reactor.resetReactors();
    getReactors();
  });
};

const tempConversionListeners = () => {
  document.querySelector("#unitCelcius").addEventListener("click", () => {
    temperatureUnit = "C";
    getReactors();
  });
  document.querySelector("#unitFahrenheit").addEventListener("click", () => {
    temperatureUnit = "F";
    getReactors();
  });
  document.querySelector("#unitKelvin").addEventListener("click", () => {
    temperatureUnit = "K";
    getReactors();
  });
};
// ---------------------------------------
// #endregion

// #region Reactor interface
// ---------------------------------------
const generateReactorHtml = (reactors) => {
  reactorHtmlElement.innerHTML = "";
  reactors.map((reactor) => {
    reactor.render(temperatureUnit, reactorHtmlElement);
  });
  addReactorListeners(reactors);
};

const addReactorListeners = (reactors) => {
  reactors.map((reactor) => {
    document.querySelector(`#start${reactor._id}`).addEventListener("click", async () => {
      if (reactor._status !== "Meltdown") {
        reactor._status = "Running";
        await Reactor.updateReactorState(reactor);
        getReactors();
      }
    });

    document.querySelector(`#stop${reactor._id}`).addEventListener("click", async () => {
      if (reactor._status !== "Meltdown") {
        reactor._status = "Stopped";
        await Reactor.updateReactorState(reactor);
        getReactors();
      }
    });

    document.querySelector(`#meltdown${reactor._id}`).addEventListener("click", async () => {
      reactor._status = "Meltdown";
      await Reactor.updateReactorState(reactor);
      getReactors();
    });

    document.querySelector(`#cooldown${reactor._id}`).addEventListener("click", async () => {
      if (reactor._status !== "Meltdown") {
        reactor._status = "Cooldown";
        await Reactor.updateReactorState(reactor);
        getReactors();
      }
    });
  });
};
// ---------------------------------------
// #endregion

// #region MainCode
// ---------------------------------------

const diagnosticsHtmlElement = document.querySelector("#diagnostics");
const reactorHtmlElement = document.querySelector("#reactors");

reactorManagementListeners();
tempConversionListeners();
getReactors();
setInterval(getReactors, 1000);
// ---------------------------------------
// #endregion