// #region Global variables
// ---------------------------------------
let temperatureUnit = "C";
let reactorData = [];
// ---------------------------------------
// #endregion

// #region Main
// ---------------------------------------
const reactorManagementListeners = () => {
  document.querySelector("#createReactor").addEventListener("click", () => {
    fetch("http://localhost:2022/reactor/add", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getReactors();
      });
  });

  document.querySelector("#resetMeltdown").addEventListener("click", () => {
    fetch("http://localhost:2022/reactors/reset", {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getReactors();
      });
  });
};

const temperatureConversionListeners = () => {
  document.querySelector("#unitCelcius").addEventListener("click", () => {
    temperatureUnit = "C";
    console.log(`CurrentTemperature: °${temperatureUnit}`);
    getReactors();
  });
  document.querySelector("#unitFahrenheit").addEventListener("click", () => {
    temperatureUnit = "F";
    console.log(`CurrentTemperature: °${temperatureUnit}`);
    getReactors();
  });
  document.querySelector("#unitKelvin").addEventListener("click", () => {
    temperatureUnit = "K";
    console.log(`CurrentTemperature: °${temperatureUnit}`);
    getReactors();
  });
};

const getReactors = () => {
  fetch("http://localhost:2022/reactors/get")
    .then((response) => response.json())
    .then((data) => {
      //   console.log("reactors: ", data);
      generateDiagnostics(data);
      generateReactorHtml(data);
      reactorData = data;
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
        <img src="./Images/reactor${reactor._Status}.png" alt="reactor ${reactor._Status}">
        <p>Temperature: <b>${convertTemperature(reactor._Temperature)}°${temperatureUnit}</b></p>
        <p>Status: <b>${reactor._Status}</b></p>
        <p>Powergrid: <b>${reactor._PowerGrid}</b></p>
        <div class="testScenario">
        <h2>Test scenario's</h2>
            <i id="start${reactor._id}" class="fas fa-play"></i>
            <i id="stop${reactor._id}" class="fas fa-stop"></i>
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
      reactor._Status = "Running";
      updateReactorStatus(reactor);
      console.log("start");
    });
    document.querySelector(`#stop${reactor._id}`).addEventListener("click", () => {
      reactor._Status = "Stopped";
      updateReactorStatus(reactor);
      console.log("stop");
    });
    document.querySelector(`#meltdown${reactor._id}`).addEventListener("click", () => {
      reactor._Status = "Meltdown";
      updateReactorStatus(reactor);
      console.log("melt");
    });
    document.querySelector(`#cooldown${reactor._id}`).addEventListener("click", () => {
      reactor._Status = "Cooldown";
      updateReactorStatus(reactor);
      console.log("cool");
    });
  });
};

const updateReactorStatus = (reactor) => {
  let obj = { data: reactor };
  fetch("http://localhost:2022/reactor/update/state", {
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
// ---------------------------------------
// #endregion

// #region Diagnostics
// ---------------------------------------
const generateDiagnostics = (reactors) => {
  let averageTemp = 0;
  let status = "Operational";
  reactors.map((reactor, i) => {
    averageTemp += reactor._Temperature;
    if (reactor._Status == "Meltdown") {
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
const randomTemperature = () => {
  reactorData.map((reactor) => {
    if (reactor._Status == "Running") {
      let temperatureDirection;
      let newTemperature;
      let max = 50;
      let min = 1;
      temperatureDirection = Math.round(Math.random());
      let temperatureChange = Math.floor(Math.random() * (max - min + 1)) + min;
      temperatureDirection == 0 ? (newTemperature = reactor._Temperature - temperatureChange) : (newTemperature = reactor._Temperature + temperatureChange);
      if (newTemperature <= 0) newTemperature = 0;
      reactor._Temperature = newTemperature;
    }
  });
  let obj = { data: reactorData };
  fetch("http://localhost:2022/reactors/update/temperature", {
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
temperatureConversionListeners();
getReactors();
setInterval(randomTemperature, 1000);
// ---------------------------------------
// #endregion
