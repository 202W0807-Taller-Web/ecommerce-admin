import { createContext } from "react";
import type { AuthContextProps } from "./AuthContext";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
