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

// Objecten van deze class stellen de reactoren voor.
// Bij het aanmaken van een reactor zal deze elke seconde zijn temperatuur en mogelijks zijn status bijwerken.
// Hiervoor wordt gebruik gemaakt van setInterval();
// Deze class wordt enkel gebruikt door de backend.
export class Reactor {
  constructor(id, powergrid, temperature) {
    this._id = id;
    this._temperature = temperature || getRandomTemperature(300, 500);
    this._status = getStatus(this._temperature);
    this._powerGrid = powergrid || Math.floor(id / 3) + 1;

    setInterval(() => {
      this._randomlyChangeTemperature();
    }, 1000)
  }

  // Deze methode wordt elke seconde uitgevoerd (door de setInterval() die in de constructor werd aangeroepen).
  // Een reactor werkt zijn temperatuur/status dus autonoom bij.
  // De nieuwe temperatuur wordt 'willekeurig' berekend, waarbij er 50% kans is dat de temperatuur zakt en
  // 50% kans is dat de temperatuur stijgt. 
  _randomlyChangeTemperature() {
    if (this._status === "Cooldown" || this._status === "Running") {
      let temperatureDirection;
      let newTemperature, newState;
      let max = 50;
      let min = 1;
      temperatureDirection = Math.round(Math.random());
      let temperatureChange = Math.floor(Math.random() * (max - min + 1)) + min;
      temperatureDirection == 0 ? (newTemperature = this._temperature - temperatureChange) : (newTemperature = this._temperature + temperatureChange);
      if (newTemperature <= 0) newTemperature = 0;
      newState = getStatus(newTemperature);

      console.log(`(internal) Reactor ${this._id} is updating its temperature from ${this._temperature} to ${newTemperature}. New status is '${newState}'.`); 
      this._temperature = newTemperature;
      this._status = newState;
    } else {
      console.log(`(internal) Reactor ${this._id} is in status '${this._status}'. Temperature will not change.`); 
    }
  }

  // Deze methode wordt aangeroepen wanneer de front end een HTTP POST stuurt naar /api/reset.
  // De reactor krijgt dan terug een veilige temperatuur en wordt in de Running status gezet.
  reset() {
    this._status = "Running";
    this._temperature = getRandomTemperature(300, 500);
  }

  updateState(state) {
    this._status = state;
    switch (this._status) {
      case "Meltdown":
        this._temperature = 837;
        break;
      case "Stopped":
        this._temperature = 5;
        break;
      case "Running":
        this._temperature = getRandomTemperature(300, 500);
        break;
      case "Cooldown":
        this._temperature = 90;
        break;
    }
  }
}