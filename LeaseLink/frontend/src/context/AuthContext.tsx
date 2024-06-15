import {ReactNode, createContext, useCallback, useContext, useEffect, useState} from "react";
import { checkAuthStatus, loginUser } from "../helpers/api-communicator";

// defined user type
type User = {
    name: string;
    email: string;

}

//define what we need for user authentication
type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email:string, password:string) => Promise<void>;
    signup: (name:string, email:string, password:string) => Promise<void>;
    logout: () => Promise<void>;
}

// create context for login state
const AuthContext = createContext<UserAuth | null>(null);

// auth provider will provide authentication i think
export const AuthProvider = ({children}: {children: ReactNode}) => {

    // set user and logged in state
    const[user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setisLoggedIn] = useState(false);

    // use this to check for cookies
    useEffect(()=>{
        // fetch if the users cookies are valied, then skip login
        async function checkStatus() {
            const data = await checkAuthStatus();
            if (data) {
                setUser({email:data.email, name:data.name});
                setisLoggedIn(true);
            }
        }
        checkStatus();
    }, []);

    //login function
    const login = async (email:string, password:string) => {
        const data = await loginUser(email, password);
        if (data) {
            setUser({email:data.email, name:data.name});
            setisLoggedIn(true);
        }
        
    };

    //signup function
    const signup = async (name:string, email:string, password:string) => {

    };

    //logout function
    const logout = async () => {
        
    }

    // value for the children of the provider
    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
    }

    // return the provider with the value and the contained children
    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}

//create contxt that should be used by the children
export const useAuth = () => useContext(AuthContext);