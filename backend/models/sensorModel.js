import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    sensorId: { type: String, required: true, unique: true }, // eg. sen100
    name: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true }
}, { minimize: false });

const sensorModel = mongoose.models.sensor || mongoose.model("sensor", sensorSchema);

export default sensorModel;
