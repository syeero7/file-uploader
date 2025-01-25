export const getShareFolderLink = (headerOrigin, userId, folderId) => {
  const epoch = Date.now() / 1000;
  const uniqueSuffix = `${epoch.toFixed(0)}-${Math.floor(Math.random() * 1e6)}`;
  return `${headerOrigin}/share/u${userId}-f${folderId}-${uniqueSuffix}`;
};

export const isExpired = (expireAt) => {
  const expireDate = new Date(expireAt).getTime() / 1000;
  const today = new Date().getTime() / 1000;
  return expireDate < today;
};

const { TOMORROW, MONTH, TWENTY_FOUR_HOURS } = {
  TOMORROW: 1,
  MONTH: 30,
  TWENTY_FOUR_HOURS: 1000 * 60 * 60 * 24,
};
export const getDateMinmax = () => {
  const date = new Date();
  const min = new Date(date.getTime() + TOMORROW * TWENTY_FOUR_HOURS);
  const max = new Date(date.getTime() + MONTH * TWENTY_FOUR_HOURS);
  return {
    min: min.toISOString().split("T")[0],
    max: max.toISOString().split("T")[0],
  };
};
