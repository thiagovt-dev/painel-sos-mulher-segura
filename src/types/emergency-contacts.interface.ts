export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relation?: string;
    priority?: number;
    isFavorite?: boolean;
  }
  export interface CreateEmergencyContactDTO extends Omit<EmergencyContact, "id"> {}
  export type UpdateEmergencyContactDTO = Partial<CreateEmergencyContactDTO>;

  