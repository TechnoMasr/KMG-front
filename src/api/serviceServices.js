import api from "./api";

export const getAllGamesByService = async (service, search, page) => {
  const { data } = await api.get(`/all-games-by-service`, {
    params: {
      service,
      search,
      page: page || 1,
    },
  });

  return data?.data || null;
};

export const getProductsByGameAndService = async (payload) => {
  const { data } = await api.get(
    `/products/by-game-and-service/${payload.game_slug}`,
    {
      params: {
        service: payload.service,
        country_id: payload.country_id,
        platform_id: payload.platform_id,
        page: payload.page || 1,
      },
    },
  );

  return data;
};

export const getProductsDetails = async (id) => {
  const { data } = await api.get(`/products/details/${id}`);
  return data?.data || {};
};
