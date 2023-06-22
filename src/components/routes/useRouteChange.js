import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetGlobalStore } from "../../store";

export const UseRouteChange = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname !== '/result') {
            sessionStorage.clear();
        }
        resetGlobalStore();
    }, [location]);
}