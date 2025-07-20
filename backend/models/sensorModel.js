import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // temperature, humidity, etc.
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },

}, { minimize: false });

const sensorModel = mongoose.models.sensor || mongoose.model("sensor", sensorSchema);

export default sensorModel;
