import type { Campaign } from "@/lib/data";

export type UserState = {
  userCredits: number;
  votedTestIds: string[];
  userTests: Campaign[];
  totalVotesCast: number;
};

export const USER_STATE_KEY = "blind-ctr-user-state";
export const USER_STATE_EVENT = "blind-ctr-user-state-changed";
const defaultUserState: UserState = { userCredits: 0, votedTestIds: [], userTests: [], totalVotesCast: 0 };

export function getUserState(): UserState {
  if (typeof window === "undefined") return defaultUserState;
  try {
    const saved = JSON.parse(window.localStorage.getItem(USER_STATE_KEY) ?? "null") as Partial<UserState> | null;
    return {
      userCredits: typeof saved?.userCredits === "number" ? saved.userCredits : 0,
      votedTestIds: Array.isArray(saved?.votedTestIds) ? saved.votedTestIds.map(String) : [],
      userTests: Array.isArray(saved?.userTests) ? saved.userTests : [],
      totalVotesCast: typeof saved?.totalVotesCast === "number" ? saved.totalVotesCast : 0,
    };
  } catch {
    return defaultUserState;
  }
}

export function saveUserState(state: UserState) {
  window.localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(USER_STATE_EVENT));
}

export function updateUserState(update: Partial<UserState>) {
  const next = { ...getUserState(), ...update };
  saveUserState(next);
  return next;
}

export function addUserCredit() {
  return updateUserState({ userCredits: getUserState().userCredits + 1 });
}

export function redeemUserCredit() {
  const state = getUserState();
  if (state.userCredits < 1) return null;
  return updateUserState({ userCredits: state.userCredits - 1 });
}

export function addUserTest(test: Campaign) {
  const state = getUserState();
  return updateUserState({ userTests: [...state.userTests, test] });
}

export function recordUserVote(testId: string) {
  const state = getUserState();
  if (state.votedTestIds.includes(String(testId))) return state;
  return updateUserState({
    votedTestIds: [...state.votedTestIds, String(testId)],
    totalVotesCast: state.totalVotesCast + 1,
  });
}
