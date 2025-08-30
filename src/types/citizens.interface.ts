export type CitizenProfile = {
  name?: string;
  phone?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type CitizenRow = {
  id: string;
  email: string;
  createdAt?: string;
  profile?: CitizenProfile;
};

