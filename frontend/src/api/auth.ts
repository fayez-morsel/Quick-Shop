import { http } from "./http";

export const apiLogin = (email: string, password: string) =>
  http.post("/auth/login", { email, password });

export const apiRegister = (data: {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
}) => http.post("/auth/register", data);
