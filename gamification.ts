export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  totalPoints: number;
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  return currentLevel * 100;
}

export function awardXp(action: string): number {
  const xpMap: Record<string, number> = {
    mood_check: 10,
    assignment_complete: 15,
    event_attend: 20,
    internship_apply: 25,
    daily_login: 5,
  };
  return xpMap[action] || 0;
}
