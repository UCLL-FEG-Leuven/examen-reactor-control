// Objecten van deze class stellen de reactoren voor.
export class Reactor {
  constructor(id, temperature, status, powergrid) {
    this._id = id;
    this._temperature = temperature;
    this._status = status;
    this._powerGrid = powergrid;
  }

  render(temperatureUnit, htmlElement) {
    let htmlString = /* html */ `
      <div class="reactor">
        <h1>Reactor: ${this._id}</h1>
        <img src="./Images/reactor${this._status}.png" alt="reactor ${this._status}">
        <p>Temperature: <b>${this._convertTemperature(this._temperature, temperatureUnit)}°${temperatureUnit}</b></p>
        <p>Status: <b>${this._status}</b></p>
        <p>Powergrid: <b>${this._powerGrid}</b></p>
        <div class="reactorControl">
            <h2>Control</h2>
            <i id="start${this._id}" class="fas fa-play"></i>
            <i id="stop${this._id}" class="fas fa-stop"></i>
            <h2>Test scenario's</h2>
            <i id="meltdown${this._id}" class="fas fa-radiation"></i>
            <i id="cooldown${this._id}" class="fas fa-temperature-low"></i>
        </div>
      </div>`;
    htmlElement.insertAdjacentHTML('beforeend', htmlString);

  }

  _convertTemperature(temperature, temperatureUnit) {
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
  static async getReactors() {
    let res = await fetch("/api/reactor");
    if (res.ok) {
      let data = await res.json();
      let reactors = data.map((reactor) => new Reactor(reactor._id, reactor._temperature, reactor._status, reactor._powerGrid))
      return reactors;
    }
    else {
      console.log('get reactors request failed')
    }
  }

  static async createReactor() {
    let res = await fetch("/api/reactor", {
      method: "POST",
    });
    if (res.ok) {
      let data = await res.json();
      if (data.status == "OK") {
        console.log(data);
      }
    }
    else {
      console.log('create reactor request failed')
    }
  }

  static async resetReactors() {
    let res = await fetch("/api/reset", {
      method: "POST",
    });
    if (res.ok) {
      let data = await res.json();
      if (data.status == "OK") {
        console.log(data);
      }
    }
    else {
      console.log('reset reactor request failed')
    }
  }

  static async updateReactorState(reactor) {
    let obj = { data: reactor };
    let res = await fetch("/api/reactor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (res.ok) {
      let data = await res.json();
      if (data.status == "OK") {
        console.log(data);
      }
    }
    else {
      console.log('update reactor request failed')
    }
  }
}
