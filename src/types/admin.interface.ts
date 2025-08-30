export interface AdminUser {
    id: string;
    email: string;
    name?: string;
    username?: string;
    roles: ("ADMIN" | "POLICE" | "CITIZEN")[];
  }
  export interface CreateCitizenDTO {
    email: string; password: string; phone: string; roles: ("CITIZEN"|"POLICE"|"ADMIN")[];
  }
  