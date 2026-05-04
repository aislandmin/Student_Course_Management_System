import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const res = await api.get("/auth/me");
            const loggedInUser = {
                id: res.data._id,
                studentNumber: res.data.studentNumber,
                role: res.data.role
            };
            setUser(loggedInUser);
        } catch (err) {
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (studentNumber, password) => {
        const res = await api.post("/auth/login", { studentNumber, password });

        const loggedInUser = {
            id: res.data.id,
            studentNumber: res.data.studentNumber,
            role: res.data.role
        };

        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        return loggedInUser.role;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            // ignore
        }
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
