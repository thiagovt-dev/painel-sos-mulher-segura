export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    roles: ("ADMIN" | "POLICE" | "CITIZEN")[];
    name: string | null;
  };
}

export interface PoliceLoginRequest {
  username: string;
  pin: string;
}
export type PoliceLoginResponse = LoginResponse;

export interface MeProfile {
  id: string;
  email: string;
  name: string | null;
  phone?: string;
  city?: string;
  state?: string;
  roles: ("ADMIN" | "POLICE" | "CITIZEN")[];
}
