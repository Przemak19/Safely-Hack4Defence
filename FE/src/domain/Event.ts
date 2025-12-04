export interface ApiEventResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetName: string;
  city: string;
  state: string;
  eventDescription: string;
  incidentStatus: number;
  eventCategory: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos: { id: string }[]; 
  createdDate: string;
}

export interface Event {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetName: string;
  city: string;
  state: string;
  eventDescription: string;
  incidentStatus: number;
  eventCategory: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  photos: string[];
  createdAt: string;
}

export const mapCategoryFromApi = (categoryId: number): string => {
  switch (categoryId) {
    case 1: return 'Pożar';
    case 2: return 'Powódź';
    case 3: return 'Niebezpieczny incydent';
    case 4: return 'Zagrożenie powietrzne';
    case 5: return 'Zagrożenie cybernetyczne';
    default: return 'Zagrożenie';
  }
};