import React from "react";
import api from "../services/api";
import useAuth from "./useAuth";

// import useAxiosPrivate from "./useAxiosPrivate";
const useRefreshToken = () => {
    const {auth, setAuth} = useAuth();
    // const api_private = useAxiosPrivate();
    const refresh = async () => {
        try {
            const response = await api.post(
                '/token/refresh',
                {},
                {
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  withCredentials: true
                }
              );
            const newAuth = {
                ...auth,
                access_token: response.data.access_token
            };
            // console.log("newAuth: ", newAuth);
            setAuth(newAuth);
            
            return response.data.access_token;
        } catch (error) {
            console.error("Erro ao atualizar token de acesso:", error);
            return null;
        }
    };
    return refresh;
};

export default useRefreshToken;