import api from "./api";

export const sendMsg = async (formData) => {
  const { data } = await api.post("/chats/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data?.data || {};
};

export const getMsgs = async ({ page = 1, per_page = 20 }) => {
  const { data } = await api.get(`/chats/messages`, {
    params: {
      page,
      per_page,
    },
  });

  return {
    messages: data?.data?.items || [],
    meta: data?.data?.meta || {},
  };
};

export const getNewMsgs = async (last_id) => {
  const { data } = await api.get(
    `/chats/messages/new-messages?last_id=${last_id}`,
  );
  return data?.data;
};
