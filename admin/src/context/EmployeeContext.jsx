import React, { useState } from "react";
import { createContext} from "react";

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {

    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"");

    const value = {
        dToken,
        setDToken,
    }

    return (
        <EmployeeContext.Provider value={value}>
            {props.children}
        </EmployeeContext.Provider>
    );
};

export default EmployeeContextProvider;
