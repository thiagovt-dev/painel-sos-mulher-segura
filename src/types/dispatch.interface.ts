import { ISODate } from "./common.interface";
export type DispatchStatus = "PENDING" | "ACCEPTED" | "RESOLVED" | "CANCELED";

export interface Dispatch {
  id: string;
  incidentId: string;
  unitId: string;
  status: DispatchStatus;
  createdAt: ISODate;
}

export interface CreateDispatchDTO { incidentId: string; unitId: string }
export interface ResolveOrCancelDTO { reason: string }
