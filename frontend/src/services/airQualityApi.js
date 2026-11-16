
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/air-quality";

const airQualityApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMeasurements = async (filters = {}) => {
  const response = await airQualityApi.get("/", {
    params: filters,
  });

  return response.data.data;
};

export const createMeasurement = async (measurement) => {
  const response = await airQualityApi.post("/", measurement);
  return response.data.data;
};

export const updateMeasurement = async (id, measurement) => {
  const response = await airQualityApi.put(`/${id}`, measurement);
  return response.data.data;
};

export const deleteMeasurement = async (id) => {
  await airQualityApi.delete(`/${id}`);
};

export default airQualityApi;
