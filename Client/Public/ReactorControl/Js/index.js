let temperatureUnit = "C";

// #region Ajax
// ---------------------------------------
const postReactor = () => {
  fetch("http://localhost:2022/reactor/add", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getReactors();
    });
};
const putStatus = (reactor) => {
  let obj = { data: reactor };
  fetch("http://localhost:2022/reactor/status", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getReactors();
    });
};
const putMeltdownReset = () => {
  fetch("http://localhost:2022/reactors/reset", {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getReactors();
    });
};
const getReactors = async () => {
  let res = await fetch("http://localhost:2022/reactors/get");
  let data = await res.json();
  //   console.log("reactors: ", data);
  generateDiagnostics(data);
  generateReactorHtml(data);
  return data;
};
// ---------------------------------------
// #endregion

// #region Main
// ---------------------------------------
const reactorManagementListeners = () => {
  document.querySelector("#createReactor").addEventListener("click", () => {
    postReactor();
  });

  document.querySelector("#resetMeltdown").addEventListener("click", () => {
    putMeltdownReset();
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
  let htmlString = "";
  reactors.map((reactor, i) => {
    htmlString += /* html */ `
      <div class="reactor">
        <h1>Reactor: ${reactor._id}</h1>
        <img src="./Images/reactor${reactor._status}.png" alt="reactor ${reactor._status}">
        <p>Temperature: <b>${convertTemperature(reactor._temperature)}°${temperatureUnit}</b></p>
        <p>Status: <b>${reactor._status}</b></p>
        <p>Powergrid: <b>${reactor._powerGrid}</b></p>
        <div class="testScenario">
            <h2>Control</h2>
            <i id="start${reactor._id}" class="fas fa-play"></i>
            <i id="stop${reactor._id}" class="fas fa-stop"></i>
            <h2>Test scenario's</h2>
            <i id="meltdown${reactor._id}" class="fas fa-radiation"></i>
            <i id="cooldown${reactor._id}" class="fas fa-temperature-low"></i>
        </div>
      </div>`;
  });
  document.querySelector("#reactors").innerHTML = htmlString;
  addReactorListeners(reactors);
};
const addReactorListeners = (reactors) => {
  reactors.map((reactor, i) => {
    document.querySelector(`#start${reactor._id}`).addEventListener("click", () => {
      if (reactor._status !== "Meltdown") {
        reactor._status = "Running";
        putStatus(reactor);
      }
    });
    document.querySelector(`#stop${reactor._id}`).addEventListener("click", () => {
      if (reactor._status !== "Meltdown") {
        reactor._status = "Stopped";
        putStatus(reactor);
      }
    });
    document.querySelector(`#meltdown${reactor._id}`).addEventListener("click", () => {
      reactor._status = "Meltdown";
      putStatus(reactor);
    });
    document.querySelector(`#cooldown${reactor._id}`).addEventListener("click", () => {
      reactor._status = "Cooldown";
      putStatus(reactor);
    });
  });
};
// ---------------------------------------
// #endregion

// #region Diagnostics
// ---------------------------------------
const generateDiagnostics = (reactors) => {
  let averageTemp = 0;
  let status = "Operational";
  reactors.map((reactor, i) => {
    averageTemp += reactor._temperature;
    if (reactor._status == "Meltdown") {
      status = "Meltdown";
    }
  });
  averageTemp = averageTemp / reactors.length;

  generateDiagnosticsHtml(averageTemp, status);
};
const generateDiagnosticsHtml = (temp, status) => {
  let htmlString = /* html */ `
    <p>Average temperature: <b>${convertTemperature(temp)}°${temperatureUnit}</b></p>
    <p>Alert status: <b>${status}</b></p>
    <p>Temperature Unit: <b>°${temperatureUnit}</b></p>
  `;
  document.querySelector("#diagnostics").innerHTML = htmlString;
};
// ---------------------------------------
// #endregion

// #region Temperature
// ---------------------------------------
const convertTemperature = (temperature) => {
  let temp = temperature;
  switch (temperatureUnit) {
    case "F":
      temp = (temperature * (9 / 5) + 32).toFixed(2);
      return temp;
    case "K":
      temp = (temperature + 273.15).toFixed(2);
      return temp;
    default:
      return temp.toFixed(2);
  }
};
// ---------------------------------------
// #endregion

// #region MainCode
// ---------------------------------------
reactorManagementListeners();
tempConversionListeners();
getReactors();
setInterval(getReactors, 1000);
// ---------------------------------------
// #endregion