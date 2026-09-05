export const guesthouseLabels = {
  IICT_PRAGYAN_HOSTEL: "IICT Pragyan Hostel",
  IICT_GUEST_HOUSE: "IICT Guest House",
  NGRI: "NGRI Guest House",
  CCMB: "CCMB Guest House",
} as const;

export type GuesthouseName = keyof typeof guesthouseLabels;

export const getGuesthouseLabel = (
  name?: GuesthouseName,
) => {
  if (!name) {
    return "";
  }

  return guesthouseLabels[name];
};