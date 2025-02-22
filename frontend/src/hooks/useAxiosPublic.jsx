import axios from "axios";

//const local = "http://localhost:5000";
const heroku = "https://task-management-backend-wheat.vercel.app";

const axiosPublic = axios.create({
  baseURL: `${heroku}`,
});

export const useAxiosPublic = () => {
  return axiosPublic;
};
