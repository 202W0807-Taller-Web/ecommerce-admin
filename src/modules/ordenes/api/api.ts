import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://orders-query-833583666995.us-central1.run.app"
    : "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_UPDATE = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://orders-command-833583666995.us-central1.run.app"
    : "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_RETURNS = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "URL_PROD_RETURNS"
    : "http://localhost:3003", // Puerto del servicio returns
  headers: {
    "Content-Type": "application/json",
  },
});