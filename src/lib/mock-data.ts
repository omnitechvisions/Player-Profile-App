import { getLevelFromXp } from "@/lib/xp";
import type {
  Achievement,
  Club,
  Event,
  Post,
  Rating,
  Sport,
  UserProfile,
  XpEntry,
} from "@/lib/types";

export const sports: Sport[] = [
  { id: "basketball", name: "Basketball", emoji: "🏀", category: "Court" },
  { id: "football", name: "Football", emoji: "⚽", category: "Field" },
  { id: "tennis", name: "Tennis", emoji: "🎾", category: "Racquet" },
  { id: "volleyball", name: "Volleyball", emoji: "🏐", category: "Court" },
  { id: "running", name: "Running", emoji: "🏃", category: "Endurance" },
  { id: "boxing", name: "Boxing", emoji: "🥊", category: "Combat" },
  { id: "cycling", name: "Cycling", emoji: "🚴", category: "Endurance" },
  { id: "badminton", name: "Badminton", emoji: "🏸", category: "Racquet" },
];

export const achievements: Achievement[] = [
  { id: "first-event", title: "First Whistle", description: "Joined your first event." },
  { id: "club-starter", title: "Club Starter", description: "Joined two clubs." },
  { id: "community-core", title: "Community Core", description: "Earned 1,000 XP." },
  { id: "top-ten", title: "Top 10", description: "Reached the top 10 leaderboard." },
];

export const users: UserProfile[] = [
  {
    id: "user-1",
    username: "mayaedge",
    fullName: "Maya Thompson",
    avatar: "MT",
    region: "Halifax",
    bio: "Weekend organizer and basketball guard who likes simple, well-run community events.",
    roles: ["player", "organizer"],
    favoriteSportIds: ["basketball", "volleyball"],
    xp: 1420,
    isPublic: true,
    joinedClubIds: ["club-1", "club-3"],
    achievementIds: ["first-event", "community-core", "top-ten"],
  },
  {
    id: "user-2",
    username: "liamserve",
    fullName: "Liam Carter",
    avatar: "LC",
    region: "Toronto",
    bio: "Football midfielder, dependable teammate, always in for pickup and club nights.",
    roles: ["player", "spectator"],
    favoriteSportIds: ["football", "running"],
    xp: 1180,
    isPublic: true,
    joinedClubIds: ["club-2"],
    achievementIds: ["first-event", "club-starter"],
  },
  {
    id: "user-3",
    username: "zoepeak",
    fullName: "Zoe Martin",
    avatar: "ZM",
    region: "Vancouver",
    bio: "Competitive runner, part-time cycling coach, and event volunteer.",
    roles: ["player", "organizer"],
    favoriteSportIds: ["running", "cycling"],
    xp: 1680,
    isPublic: true,
    joinedClubIds: ["club-4", "club-5"],
    achievementIds: ["first-event", "community-core", "top-ten"],
  },
  {
    id: "user-4",
    username: "noahnet",
    fullName: "Noah Patel",
    avatar: "NP",
    region: "Montreal",
    bio: "Tennis player, low-key competitor, and fan of clean event logistics.",
    roles: ["player"],
    favoriteSportIds: ["tennis", "badminton"],
    xp: 930,
    isPublic: true,
    joinedClubIds: ["club-6"],
    achievementIds: ["first-event"],
  },
];

for (let i = 5; i <= 20; i += 1) {
  users.push({
    id: `user-${i}`,
    username: `member${i}`,
    fullName: `Community Member ${i}`,
    avatar: `M${i}`,
    region: ["Calgary", "Ottawa", "Halifax", "Toronto"][i % 4],
    bio: "Active across local leagues, club sessions, and social sport nights.",
    roles: i % 3 === 0 ? ["player", "spectator"] : ["player"],
    favoriteSportIds: [sports[i % sports.length].id],
    xp: 320 + i * 48,
    isPublic: true,
    joinedClubIds: [`club-${(i % 10) + 1}`],
    achievementIds: i % 2 === 0 ? ["first-event"] : [],
  });
}

export const clubs: Club[] = Array.from({ length: 10 }, (_, index) => ({
  id: `club-${index + 1}`,
  name: [
    "Harbour Hoops",
    "Northside FC",
    "Metro Volley",
    "Pacific Stride",
    "Coastline Cycling",
    "Rally House",
    "East End Boxing",
    "River Racquets",
    "Summit Badminton",
    "City Lights Run Club",
  ][index],
  city: ["Halifax", "Toronto", "Halifax", "Vancouver", "Victoria", "Montreal", "Calgary", "Ottawa", "Toronto", "Edmonton"][index],
  region: ["Atlantic", "Ontario", "Atlantic", "BC", "BC", "Quebec", "Alberta", "Ontario", "Ontario", "Alberta"][index],
  sportId: sports[index % sports.length].id,
  memberCount: 48 + index * 11,
  description:
    "Community-first club with weekly sessions, social events, and beginner-friendly access.",
  isPublic: true,
  upcomingEventIds: [`event-${index + 1}`, `event-${index + 11}`],
}));

export const events: Event[] = Array.from({ length: 24 }, (_, index) => {
  const sport = sports[index % sports.length];
  const startsAt = new Date(Date.now() + (index - 6) * 86400000).toISOString();
  return {
    id: `event-${index + 1}`,
    title: `${sport.name} ${index < 6 ? "Classic" : index < 14 ? "Open Night" : "Community Session"}`,
    sportId: sport.id,
    organizerId: users[index % users.length].id,
    clubId: index % 2 === 0 ? clubs[index % clubs.length].id : undefined,
    city: ["Halifax", "Toronto", "Montreal", "Vancouver"][index % 4],
    region: ["Atlantic", "Ontario", "Quebec", "BC"][index % 4],
    venue: ["Harbour Centre", "North Court", "Summit Dome", "City Park"][index % 4],
    startsAt,
    status: index < 6 ? "completed" : index === 6 ? "draft" : "published",
    eventType: index % 3 === 0 ? "club" : index % 3 === 1 ? "community" : "showcase",
    capacity: 24 + (index % 4) * 8,
    registeredCount: 10 + (index % 5) * 4,
    spectatorCount: 8 + (index % 4) * 3,
    description:
      "A polished local event with simple registration, room for both competitors and spectators, and a welcoming community atmosphere.",
    entryFeeText: index % 3 === 0 ? "$10 drop-in" : "Free community access",
  };
});

export const posts: Post[] = [
  {
    id: "post-1",
    authorId: "user-1",
    sportId: "basketball",
    body: "Opened three extra spectator spots for Friday's night run. Bring a friend if you want the full atmosphere.",
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: "post-2",
    authorId: "user-3",
    sportId: "running",
    body: "Pacific Stride is adding a beginner pace group this weekend. Low pressure, all welcome.",
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
  },
];

export const ratings: Rating[] = [
  {
    id: "rating-1",
    eventId: "event-1",
    authorId: "user-2",
    score: 5,
    comment: "Easy check-in, good pacing, and the organizer kept everything moving.",
  },
  {
    id: "rating-2",
    eventId: "event-2",
    authorId: "user-1",
    targetUserId: "user-4",
    score: 4,
    comment: "Very fair player and easy to compete with.",
  },
];

export const xpLedger: XpEntry[] = users.flatMap((user, index) => [
  {
    id: `xp-${user.id}-1`,
    userId: user.id,
    reason: "Event registration",
    amount: 40,
    createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: `xp-${user.id}-2`,
    userId: user.id,
    reason: "Club membership streak",
    amount: 60,
    createdAt: new Date(Date.now() - (index + 2) * 1000 * 60 * 60 * 48).toISOString(),
  },
]);

export const leaderboard = [...users]
  .sort((a, b) => b.xp - a.xp)
  .map((user, index) => ({
    rank: index + 1,
    user,
    level: getLevelFromXp(user.xp),
    sports: user.favoriteSportIds.map((sportId) =>
      sports.find((sport) => sport.id === sportId)?.name,
    ),
  }));

export const currentUser = users[0];

export function getSportById(id: string) {
  return sports.find((sport) => sport.id === id);
}

export function getUserByUsername(username: string) {
  return users.find((user) => user.username === username);
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}

export function getClubById(id: string) {
  return clubs.find((club) => club.id === id);
}
