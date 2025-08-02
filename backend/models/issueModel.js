import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    issueId: { type: String, required: true, unique: true },
    sensorId: { type: String, required: true },
    empId: { type: String, required: true },
    empName: { type: String, required: true },
    empEmail: { type: String, required: true },
    issueDescription: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isCompleted: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' }
}, { minimize: false });

const issueModel = mongoose.models.issue || mongoose.model("issue", issueSchema);

export default issueModel;
