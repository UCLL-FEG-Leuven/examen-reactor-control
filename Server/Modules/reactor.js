const getStatus = (x) => {
  switch (true) {
    case x < 30:
      return "Stopped";
    case x >= 30 && x < 150:
      return "Cooldown";
    case x >= 150 && x <= 830:
      return "Running";
    case x > 830:
      return "Meltdown";
  }
};

const getRandomTemperature = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export class Reactor {
  constructor(id, powergrid, temperature) {
    this._id = id;
    this._temperature = temperature || getRandomTemperature(15, 1000);
    this._status = getStatus(this._temperature);
    this._powerGrid = powergrid || Math.floor(id / 3) + 1;

    setInterval(() => {
      this._randomlyChangeTemperature();
    }, 1000)
  }

  _randomlyChangeTemperature() {
    if (this._status === "Running") {
      let temperatureDirection;
      let newTemperature, newState;
      let max = 50;
      let min = 1;
      temperatureDirection = Math.round(Math.random());
      let temperatureChange = Math.floor(Math.random() * (max - min + 1)) + min;
      temperatureDirection == 0 ? (newTemperature = this._temperature - temperatureChange) : (newTemperature = this._temperature + temperatureChange);
      if (newTemperature <= 0) newTemperature = 0;
      newState = getStatus(newTemperature);

      console.log(`(internal) 'Running' reactor ${this._id} is updating its temperature from ${this._temperature} to ${newTemperature}. New status is '${newState}'.`); 
      this._temperature = newTemperature;
      this._status = newState;
    }
  }

  resetMeltdown() {
    this._status = "Running";
    this._temperature = 400;
  }

  updateStatus(status) {
    if (this._status)
    this._status = status;
    switch (this._status) {
      case "Meltdown":
        this._temperature = 837;
        break;
      case "Stopped":
        this._temperature = 5;
        break;
      case "Running":
        this._temperature = 250;
        break;
      case "Cooldown":
        this._temperature = 45;
        break;
    }
  }
}