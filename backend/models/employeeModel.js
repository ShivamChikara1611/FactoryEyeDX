import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: String, required: true, unique: true }, // eg. emp100
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experience: { type: String, required: true },
    available_status: { type: Boolean, default: true },
    taskAssignedId: { type: String, default: "" }, // issueId or task id
    tasksCompleted: { type: Number, default: 0 },
    deskAccepted: { type: Boolean, default: false }, // accept/decline desk

}, { minimize: false });

const employeeModel = mongoose.models.employee || mongoose.model("employee", employeeSchema);

export default employeeModel;
