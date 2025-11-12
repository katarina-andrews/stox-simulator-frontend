import axios from "axios";

export const api = axios.create({
  baseURL: "https://ul4ag1di2b.execute-api.us-east-2.amazonaws.com/",
  timeout: 10000,
   headers: { "Content-Type": "application/json" }
});

export const authorizedApi = (token) => axios.create({
  baseURL: "https://ul4ag1di2b.execute-api.us-east-2.amazonaws.com/",
  timeout: 10000,
   headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
});