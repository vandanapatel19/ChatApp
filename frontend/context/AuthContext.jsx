import axios from "axios";
import { io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    //check if the user is authenticated if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/checkAuth');
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    //Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        socket?.disconnect();

    }
    const updateProfile = async (body) => {
        console.log("UPDATE PROFILE FUNCTION CALLED");
        console.log("BODY:", body);

        try {
            console.log("BEFORE AXIOS");

            const { data } = await axios.put(
                '/api/auth/update-profile',
                body
            );

            console.log("AFTER AXIOS:", data);

            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return true;
            }

            toast.error(data.message);
            return false;

        } catch (error) {
            console.log("INSIDE CATCH");
            console.log("ERROR:", error);
            console.log("RESPONSE:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );

            return false;
        }
    };

    //connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });
        setSocket(newSocket);

        newSocket.on("onlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    }


    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
        return () => socket?.disconnect();
    }, [token]);


    const value = { axios, authUser, onlineUsers, socket, login, logout, updateProfile };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};