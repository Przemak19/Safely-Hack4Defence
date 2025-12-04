import axios from "axios";

export const getAirThreatCommand = () => {
    return axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/StrategicObject`).then((response) => {return response.data;});
}