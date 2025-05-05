import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
});

export default client;
