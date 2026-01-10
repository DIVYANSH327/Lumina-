
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface User {
  id: string;
  name: string;
  phone: string;
  city: 'Bhopal' | 'Indore';
}

export interface RunEvent {
  id: string;
  title: string;
  location: string;
  city: 'Bhopal' | 'Indore';
  day: string;
  date: string;
  image: string;
  description: string;
  distance: string;
  startTime: string;
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

/**
 * Artist interface added to resolve import error in ArtistCard.tsx
 */
export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  day: string;
}
