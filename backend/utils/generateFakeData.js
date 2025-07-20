import sensorModel from "../models/sensorModel.js";

const generateFakeData = async () => {
    const sensors = [
        {
            name: "Temperature Sensor",
            type: "temperature",
            value: (Math.random() * 10 + 20).toFixed(2),
            unit: "°C",
        },
        {
            name: "Humidity Sensor",
            type: "humidity",
            value: (Math.random() * 40 + 30).toFixed(2),
            unit: "%",
        },
        {
            name: "Vibration Sensor",
            type: "vibration",
            value: (Math.random() * 5).toFixed(2),
            unit: "Hz",
        },
        {
            name: "Pressure Sensor",
            type: "pressure",
            value: (Math.random() * 20 + 100).toFixed(2),
            unit: "kPa",
        },
    ];

    for (const sensor of sensors) {
        const newSensor = new sensorModel(sensor);
        await newSensor.save();
    }

    console.log("Fake sensor data generated!");
};

export default generateFakeData;