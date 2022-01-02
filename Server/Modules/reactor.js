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
    this._Temperature = temperature || getRandomTemperature(15, 1000);
    this._Status = getStatus(this._Temperature);
    this._PowerGrid = powergrid || Math.floor(id / 3) + 1;
  }

  ResetMeltdown() {
    this._Status = "Running";
    this._Temperature = 400;
  }

  UpdateState(state) {
    this._Status = state;
    switch (this._Status) {
      case "Meltdown":
        this._Temperature = 837;
        break;
      case "Stopped":
        this._Temperature = 5;
        break;
      case "Running":
        this._Temperature = 250;
        break;
      case "Cooldown":
        this._Temperature = 45;
        break;
    }
  }
}
