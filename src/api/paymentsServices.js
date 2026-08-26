import api from "./api";

export const getPaymentSettings = async () => {
  const { data } = await api.get("/payment-settings");
  return data?.data || [];
};

export const createOrder = async (formData) => {
  const { data } = await api.post("/orders/confirm", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data?.data;
};

export const getOrders = async ({ queryKey }) => {
  const [, status, page] = queryKey;

  const { data } = await api.get("/orders/my-orders", {
    params: {
      status: status === "all" ? undefined : status,
      page: page || 1,
    },
  });

  return data;
};


export const getSingleOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data?.data;
};
