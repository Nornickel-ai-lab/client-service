import { defineStore } from 'pinia';
import { ref } from 'vue';

import { fetchMe, postLogin } from '@/entities/user/api/userApi';
import type { LoginPayload, UserProfile } from '@/entities/user/model/types';

const TOKEN_KEY = 'access_token';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) ?? '');
  const user = ref<UserProfile | null>(null);

  const setToken = (value: string): void => {
    token.value = value;
    localStorage.setItem(TOKEN_KEY, value);
  };

  const clearSession = (): void => {
    token.value = '';
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  };

  const login = async (payload: LoginPayload): Promise<void> => {
    const response = await postLogin(payload);
    setToken(response.access_token);
    user.value = await fetchMe();
  };

  const acceptToken = async (accessToken: string): Promise<void> => {
    setToken(accessToken);
    user.value = await fetchMe();
  };

  const loadProfile = async (): Promise<void> => {
    if (!token.value) {
      return;
    }
    user.value = await fetchMe();
  };

  const logout = (): void => {
    clearSession();
  };

  const isAuthenticated = (): boolean => {
    return token.value.length > 0;
  };

  return {
    token,
    user,
    login,
    acceptToken,
    loadProfile,
    logout,
    clearSession,
    isAuthenticated,
  };
});
