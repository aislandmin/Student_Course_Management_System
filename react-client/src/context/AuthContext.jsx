import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const isAuthenticated = !!user;

    // REAL login: call backend, save user, return role
    const login = async (studentNumber, password) => {
        const res = await api.post("/auth/login", { studentNumber, password });

        const loggedInUser = {
            id: res.data.id,
            studentNumber: res.data.studentNumber,
            role: res.data.role
        };

        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        console.log(loggedInUser);

        return loggedInUser.role; // so Login page knows where to navigate
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout"); // your backend logout route
        } catch (e) {
            // ignore errors here
        }
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
