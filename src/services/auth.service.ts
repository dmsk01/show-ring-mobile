import axios from 'axios';

import { type LoginResponse } from '../types/auth';

const AUTH_URL = 'https://dummyjson.com';

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await axios.post<LoginResponse>(
      AUTH_URL,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  },
};
