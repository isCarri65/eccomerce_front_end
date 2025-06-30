// src/utils/tokenManager.ts
let accessToken: string | null = null;

export const tokenManager = {
  getToken: () => accessToken,
  setToken: (token: string | null) => {
    accessToken = token;
  },
};
