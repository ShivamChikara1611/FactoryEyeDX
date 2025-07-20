import employeeModel from "../models/employeeModel.js";
import { faker } from "@faker-js/faker";


faker.locale = "ja";

const generateFakeEmployees = async () => {
    const employees = [];

    for (let i = 0; i < 50; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] });
        const password = faker.internet.password({ length: 10 });
        const experience = faker.helpers.arrayElement(["1 Year", "2 Years", "3 Years", "5 Years", "10+ Years"]);
        const available = faker.datatype.boolean();
        const date = Math.floor(Date.now() / 1000);
        const slots_booked = {};

        employees.push({
            name,
            email,
            password,
            experience,
            available,
            date,
            slots_booked
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
