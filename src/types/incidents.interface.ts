import { ISODate } from "./common.interface";

export type IncidentStatus = "OPEN" | "IN_DISPATCH" | "RESOLVED" | "CANCELED";

export interface Incident {
  id: string;
  code?: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  status: IncidentStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateIncidentDTO {
  lat: number;
  lng: number;
  address?: string;
  description?: string;
}

export interface CloseIncidentDTO {
  as: "RESOLVED" | "UNFOUNDED" | "TRANSFERRED";
  reason: string;
}
export interface CancelIncidentDTO {
  reason: string;
}

// Extended incident shape returned by some endpoints with citizen/dispatch info
export type IncidentWithCitizen = Incident & {
  audioRoomId?: string | null;
  citizenId?: string;
  closedAt?: string | null;
  closedById?: string | null;
  closedReason?: string | null;
  dispatches?: unknown[];
  citizen?: {
    userId?: string;
    name?: string;
    phone?: string;
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
    zip?: string;
    lat?: string | null;
    lng?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};
