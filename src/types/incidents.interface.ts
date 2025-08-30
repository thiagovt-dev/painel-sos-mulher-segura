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
