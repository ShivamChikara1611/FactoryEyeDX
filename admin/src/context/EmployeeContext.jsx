import React, { useState } from "react";
import { createContext} from "react";

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {
    const [eToken, setEToken] = useState(localStorage.getItem('eToken') ? localStorage.getItem('eToken') : "");
    const [employeeProfile, setEmployeeProfile] = useState(null);

    const value = {
        eToken,
        setEToken,
        employeeProfile,
        setEmployeeProfile,
    }

    return (
        <EmployeeContext.Provider value={value}>
            {props.children}
        </EmployeeContext.Provider>
    );
};

export default EmployeeContextProvider;