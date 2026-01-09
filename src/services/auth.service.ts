import api from "./api";
import type  { LoginRequest, LoginResponse } from "../types/auth";

const TOKEN_KEY = "ideal_token";
const USER_KEY = "ideal_user";

export const login = async (data: LoginRequest) => {
  const res = await api.post<LoginResponse>("/auth/login", data);

  localStorage.setItem(TOKEN_KEY, res.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

  return res.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
