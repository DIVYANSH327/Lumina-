
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string; // Stored in plain text for this local-only mock app
  city: 'Bhopal' | 'Indore';
  profilePic?: string; // Base64 data URL
}

export interface RunEvent {
  id: string;
  title: string;
  location: string;
  meetingPoint: string;
  raveLocation: string;
  city: 'Bhopal' | 'Indore';
  day: string;
  date: string;
  image: string;
  description: string;
  distance: string;
  startTime: string;
  basePrice: number;
}

export interface UserTicket {
  id: string;
  runId: string;
  userId: string;
  runnerName: string;
  runnerPhone: string;
  checkInStatus: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  day: string;
}
