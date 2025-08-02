import sensorModel from "../models/sensorModel.js";

const generateFakeData = async () => {
    const sensors = [
        {
            sensorId: `sen${Math.floor(Math.random() * 100000000)}`,
            name: "Temperature Sensor",
            type: "temperature",
            value: Math.floor(Math.random() * 10 + 20),
            unit: "°C"
        },
        {
            sensorId: `sen${Math.floor(Math.random() * 100000000)}`,
            name: "Humidity Sensor",
            type: "humidity",
            value: Math.floor(Math.random() * 40 + 30),
            unit: "%"
        },
        {
            sensorId: `sen${Math.floor(Math.random() * 100000000)}`,
            name: "Vibration Sensor",
            type: "vibration",
            value: Math.floor(Math.random() * 5),
            unit: "Hz"
        },
        {
            sensorId: `sen${Math.floor(Math.random() * 100000000)}`,
            name: "Pressure Sensor",
            type: "pressure",
            value: Math.floor(Math.random() * 20 + 100),
            unit: "kPa"
        }
    ];

    for (const sensor of sensors) {
        const newSensor = new sensorModel(sensor);
        await newSensor.save();
    }

    console.log("Fake sensor data generated!");
};

export default generateFakeData;