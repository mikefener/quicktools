export type CampaignStatus = "active" | "completed";
export type Campaign = { id: string; title: string; imageA: string; imageB: string; votesA: number; votesB: number; status: CampaignStatus };

export const STORAGE_KEY = "blind-ctr-campaigns";
export const mockCampaigns: Campaign[] = [
  { id: "1", title: "I Tried Waking Up at 5AM for 30 Days", imageA: "https://picsum.photos/id/1015/800/450", imageB: "https://picsum.photos/id/1016/800/450", votesA: 68, votesB: 32, status: "active" },
  { id: "2", title: "The Street Food Tour Nobody Talks About", imageA: "https://picsum.photos/id/292/800/450", imageB: "https://picsum.photos/id/488/800/450", votesA: 41, votesB: 59, status: "active" },
  { id: "3", title: "My $2,000 Creator Desk Setup", imageA: "https://picsum.photos/id/180/800/450", imageB: "https://picsum.photos/id/201/800/450", votesA: 73, votesB: 27, status: "active" },
  { id: "4", title: "I Made a Tiny Apartment Feel Huge", imageA: "https://picsum.photos/id/164/800/450", imageB: "https://picsum.photos/id/239/800/450", votesA: 35, votesB: 65, status: "active" },
  { id: "5", title: "The One-Pan Dinner I Keep Repeating", imageA: "https://picsum.photos/id/493/800/450", imageB: "https://picsum.photos/id/534/800/450", votesA: 56, votesB: 44, status: "active" },
  { id: "6", title: "What I Learned from a Month Offline", imageA: "https://picsum.photos/id/1036/800/450", imageB: "https://picsum.photos/id/1039/800/450", votesA: 52, votesB: 48, status: "active" },
  { id: "7", title: "The Simple Workout That Changed Everything", imageA: "https://picsum.photos/id/1059/800/450", imageB: "https://picsum.photos/id/1060/800/450", votesA: 64, votesB: 36, status: "active" },
  { id: "8", title: "I Built a Garden on My Balcony", imageA: "https://picsum.photos/id/146/800/450", imageB: "https://picsum.photos/id/152/800/450", votesA: 47, votesB: 53, status: "active" },
  { id: "9", title: "The Travel Mistake I Would Never Repeat", imageA: "https://picsum.photos/id/1036/800/450", imageB: "https://picsum.photos/id/1043/800/450", votesA: 58, votesB: 42, status: "active" },
  { id: "10", title: "A Better Morning Routine in 7 Minutes", imageA: "https://picsum.photos/id/1067/800/450", imageB: "https://picsum.photos/id/1069/800/450", votesA: 61, votesB: 39, status: "active" },
];

export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return mockCampaigns;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCampaigns)); return mockCampaigns; }
  try {
    const saved = JSON.parse(stored) as Campaign[];
    const merged = [...mockCampaigns.map((mock) => saved.find((campaign) => campaign.id === mock.id) ?? mock), ...saved.filter((campaign) => !mockCampaigns.some((mock) => mock.id === campaign.id))];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCampaigns)); return mockCampaigns; }
}

export function saveCampaigns(campaigns: Campaign[]) { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns)); }

export function recordVote(id: string, option: "A" | "B") {
  const updated = getCampaigns().map((campaign) => campaign.id === id ? { ...campaign, votesA: campaign.votesA + (option === "A" ? 1 : 0), votesB: campaign.votesB + (option === "B" ? 1 : 0) } : campaign);
  saveCampaigns(updated);
  return updated;
}