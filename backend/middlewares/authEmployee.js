import jwt from "jsonwebtoken";

// employee authentication middleware

const authEmployee = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Please Login First!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employeeId = decoded.id; // <-- Ensure this line exists
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid employee" });
    }
};

export default authEmployee;