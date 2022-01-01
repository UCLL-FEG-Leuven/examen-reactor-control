const reactorStatus = ["Stopped", "Running", "Meltdown"];
// const getRandomArray = (maxInt) => {
//   return Math.floor(Math.random() * maxInt);
// };
const getStatus = (x) => {
  switch (true) {
    case x >= 0 && x <= 150:
      return "Sleep Mode";
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

  SetCooldown() {
    this._Status = "Cooldown";
    this._Temperature = 10;
  }

  ResetMeltdown() {
    this._Status = "Stopped";
    this._Temperature = 10;
  }

  CreateTemp(state) {
    this._Status = state;
    switch (this._Status) {
      case "Meltdown":
        this._Temperature = 837;
        break;
      case "Stopped":
        this._Temperature = 125;
        break;
      case "Running":
        this._Temperature = 250;
        break;
    }
  }
}
