import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    empId: { type: String, required: true },
    empData: { type: Object, required: true },

    sensorId: { type: String, required: true },
    sensorData: { type: Object, required: true },

    issueId: { type: String, required: true },
    issueDescription: { type: String, required: true },

    assignDate: { type: String, required: true },
    assignTime: { type: String, required: true },

    completionDate: { type: String, required: true },
    completionTime: { type: String, required: true },

    reqCancelled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
});

const issueModel = mongoose.models.issue || mongoose.model("issue", issueSchema);

export default issueModel;