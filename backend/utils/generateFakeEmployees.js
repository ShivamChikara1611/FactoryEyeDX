import employeeModel from "../models/employeeModel.js";
import { faker } from "@faker-js/faker";

faker.locale = "ja";

const generateFakeEmployees = async () => {
    const employees = [];

    for (let i = 0; i < 50; i++) {
        const name = faker.person.fullName();
        const empId = `emp${10000 + i}`;
        const email = faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] });
        const password = faker.internet.password({ length: 10 });
        const experience = faker.helpers.arrayElement(["1 Year", "2 Years", "3 Years", "5 Years", "10+ Years"]);
        const available_status = faker.datatype.boolean();
        const taskAssignedId = "";
        const tasksCompleted = faker.number.int({ min: 0, max: 20 });
        const deskAccepted = faker.datatype.boolean();

        employees.push({
            name,
            empId,
            email,
            password,
            experience,
            available_status,
            taskAssignedId,
            tasksCompleted,
            deskAccepted
        });
    }

    try {
        await employeeModel.insertMany(employees);
        console.log("50 fake employees added successfully!");
    } catch (error) {
        console.error("Failed to generate fake employees:", error);
    }
};

export default generateFakeEmployees;