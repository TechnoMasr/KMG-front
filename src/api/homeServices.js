import api from "./api";

export const getHome = async () => {
  const { data } = await api.get("/home");
  return data?.data || {};
};

export const getGamesByService = async () => {
  const { data } = await api.get("/games-by-service");
  return data?.data || [];
};
