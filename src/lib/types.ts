export type UserRole = "player" | "spectator" | "organizer";
export type EventStatus = "draft" | "published" | "completed" | "cancelled";
export type RegistrationType = "participant" | "spectator";

export type Sport = {
  id: string;
  name: string;
  emoji: string;
  category: string;
};

export type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  avatarUrl?: string | null;
  region: string;
  bio: string;
  roles: UserRole[];
  favoriteSportIds: string[];
  xp: number;
  isPublic: boolean;
  joinedClubIds: string[];
  achievementIds: string[];
};

export type Club = {
  id: string;
  name: string;
  city: string;
  region: string;
  sportId: string;
  memberCount: number;
  description: string;
  isPublic: boolean;
  upcomingEventIds: string[];
};

export type Event = {
  id: string;
  title: string;
  sportId: string;
  organizerId: string;
  clubId?: string;
  city: string;
  region: string;
  venue: string;
  startsAt: string;
  status: EventStatus;
  eventType: "community" | "club" | "showcase";
  capacity: number;
  registeredCount: number;
  spectatorCount: number;
  description: string;
  entryFeeText: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export type Post = {
  id: string;
  authorId: string;
  sportId: string;
  body: string;
  createdAt: string;
};

export type Rating = {
  id: string;
  eventId: string;
  authorId: string;
  targetUserId?: string;
  score: number;
  comment: string;
};

export type XpEntry = {
  id: string;
  userId: string;
  reason: string;
  amount: number;
  createdAt: string;
};
