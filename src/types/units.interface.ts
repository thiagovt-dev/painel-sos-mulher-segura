export type Platform = "ANDROID" | "IOS" | "WEB";

export interface Unit {
  id: string;
  name: string;
  plate?: string;
  fcmToken?: string;
  lat?: number;
  lng?: number;
  username: string;
  active: boolean;
  createdAt: string;
}
