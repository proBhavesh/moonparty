export const calculateDailyChange = (previousValue, currentValue) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const generateInviteLink = (groupId) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/group/join/${groupId}`;
};
