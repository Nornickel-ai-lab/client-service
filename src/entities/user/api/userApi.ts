import { apiClient } from '@/shared/api/client';
import type { LoginPayload, TokenResponse, UserProfile } from '@/entities/user/model/types';

export const postLogin = async (payload: LoginPayload): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/login', payload);
  return response.data;
};

export const fetchMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/auth/me');
  return response.data;
};
