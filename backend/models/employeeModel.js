import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    date: {
        type: Number,
        required: true,
    },
    slots_booked: {
        type: Object,
        default: {},
    },
    
}, {minimize:false});

const employeeModel = mongoose.models.employee || mongoose.model("employee", employeeSchema);

export default employeeModel;
