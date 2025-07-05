import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/salary",
});

export const addSalary = (data) => API.post("/add", data);
export const getSalaryList = () => API.get("/list");
export const getSalaryDetails = (id) => API.get(`/details/${id}`);
export const editSalary = (id, data) => API.put(`/edit/${id}`, data);
export const deleteSalary = (id) => API.delete(`/delete/${id}`);
export const getDashboardData = () => API.get("/dashboard");
export const processPayments = (ids) => API.post("/process", { ids });