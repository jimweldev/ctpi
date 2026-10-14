import axios from "axios";

export const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github+json" },
  timeout: 15_000,
});
