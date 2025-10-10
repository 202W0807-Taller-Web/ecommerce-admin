import axios from "axios";

const API = axios.create({
  baseURL: "https://store-service-814404078279.us-central1.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
