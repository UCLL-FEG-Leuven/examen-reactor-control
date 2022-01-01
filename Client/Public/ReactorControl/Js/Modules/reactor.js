const getReactorImage = () => {
  switch (this._Status) {
    case "Stopped":
      return "reactorOff.png";
    case "Cooldown":
      return "reactorCool.png";
    case "Running":
      return "reactorOn.png";
    case "Meltdown":
      return "reactorMeltdown.png";
  }
};
export class Reactor {
  constructor(id, status, powergrid, temperature) {
    this._id = id;
    this._Temperature = temperature;
    this._Status = status;
    this._PowerGrid = powergrid;
    this._Image = getReactorImage();
  }
}
