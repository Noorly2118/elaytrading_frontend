import api from "./api";

export const startPayment = async (orderId) => {
  const res = await api.post(`/payment/${orderId}`);
  return res.data.checkoutUrl;
};