import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
// import generateFakeData from "./utils/generateFakeData.js";
// import generateFakeEmployees from "./utils/generateFakeEmployees.js";


// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRoute);

app.get("/", (req, res) => {
    res.send("API WORKING");
});


// listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// initialize fake data generation
// setInterval(generateFakeData, 100);

// initialize fake employees
// generateFakeEmployees()