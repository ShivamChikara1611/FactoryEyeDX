import { createContext} from "react";

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {

    const value = {
    }

    return (
        <EmployeeContext.Provider value={value}>
            {props.children}
        </EmployeeContext.Provider>
    );
};

export default EmployeeContextProvider;
