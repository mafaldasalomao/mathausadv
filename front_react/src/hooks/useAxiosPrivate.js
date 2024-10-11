import { api_private } from "../services/api";

import { useEffect, useState } from "react";

import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {

    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = api_private.interceptors.request.use(
            config => {
                
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = api_private.interceptors.response.use(
            response => response,
            async (error) => {

                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api_private(prevRequest);
                }
                return Promise.reject(error);
            }
        )
        return () => {
            api_private.interceptors.request.eject(requestIntercept);
            api_private.interceptors.response.eject(responseIntercept);
        }
    }, [ auth, refresh])

    return api_private;
}

export default useAxiosPrivate;