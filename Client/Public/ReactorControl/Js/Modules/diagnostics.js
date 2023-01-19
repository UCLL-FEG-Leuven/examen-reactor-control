// Objecten van deze class stellen de reactoren voor.
export class Diagnostics {
    constructor() {
    }

    static generateDiagnosticsWidget(htmlElement, reactors, temperatureUnit) {
        let diagnosticData = this._generateDiagnosticsData(reactors);
        let htmlString = /* html */ `
            <p>Average temperature: <b>${this._convertTemperature(diagnosticData.temperature, temperatureUnit)}°${temperatureUnit}</b></p>
            <p>Alert status: <b>${diagnosticData.status}</b></p>
            <p>Temperature Unit: <b>°${temperatureUnit}</b></p>`;
        htmlElement.innerHTML = htmlString;
    }

    static _convertTemperature(temperature, temperatureUnit) {
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
    }

    static _generateDiagnosticsData(reactors) {
        let diagnosticData = {};
        let averageTemp = 0;
        diagnosticData.status = "Operational";
        reactors.map((reactor, i) => {
            averageTemp += reactor._temperature;
            if (reactor._status == "Meltdown") {
                diagnosticData.status = "Meltdown";
            }
        });
        averageTemp = averageTemp / reactors.length;
        diagnosticData.temperature = averageTemp;
        return diagnosticData;
    }
}
