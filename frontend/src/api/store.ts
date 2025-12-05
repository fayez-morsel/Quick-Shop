import { http } from "./http";

export const apiGetMyStore = () => http.get("/stores/me");

export const apiApproveStore = (storeId: string) =>
  http.patch(`/stores/${storeId}/approve`);
