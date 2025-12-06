const API_URL = `${import.meta.env.VITE_AUTH_BACKEND}/api/auth`;

export interface User {
  id: number;
  nombres: string;
  apellido_p: string;
  apellido_m?: string;
  correo: string;
  created_at: string;
  celular: string;
  rolInt: string | number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  user?: User;
  isAuthenticated?: boolean;
}

export interface LoginData {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombres: string;
  apellido_p: string;
  apellido_m?: string;
  correo: string;
  contraseña: string;
  tipo_documento: string;
  nro_documento: string;
  rolInt: number;
}

export const register = async (data: RegisterData): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({...data, rolInt: data.rolInt ? Number(data.rolInt) : 2}),
    credentials: "include",
  });
  return res.json();
};

export const login = async (data: LoginData): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const logout = async (): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const checkAuth = async (): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/check`, {
    credentials: "include",
  });
  return res.json();
};

export const getCurrentUser = async (): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });
  return res.json();
};
