export type SpecialistGender = 'man' | 'woman';

export interface Specialist {
  id: string;
  name: string;
  avatar: string;
  pricePerSession: number;
  sessionDurationMinutes: number;
  rating: number;
  reviewsCount: number;
  description: string;
  age: number;
  gender: SpecialistGender;
  countryCode?: string;
  experienceYears?: number;
  clientsCount?: number;
  sessionsCount?: number;
  availabilitySlots?: string[];
}

