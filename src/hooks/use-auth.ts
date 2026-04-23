import { useSetAtom } from 'jotai';

import { userAtom } from '../store/auth';
import { authService } from '../services/auth.service';
import { secureStorage, setCachedToken, SECURE_KEYS } from '../lib/secure-storage';

export function useAuth() {
  const setUser = useSetAtom(userAtom);

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);

      const { accessToken, refreshToken, ...user } = data;

      // 1. Сохраняем токены в безопасное хранилище
      await secureStorage.setItem(SECURE_KEYS.accessToken, accessToken);
      await secureStorage.setItem(SECURE_KEYS.refreshToken, refreshToken);

      // 2. Обновляем синхронный кеш для Axios интерцептора
      setCachedToken(accessToken);

      // 3. Сохраняем данные юзера в Jotai (уйдет в MMKV)
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await secureStorage.removeItem(SECURE_KEYS.accessToken);
    await secureStorage.removeItem(SECURE_KEYS.refreshToken);
    setCachedToken(null);
    setUser(null);
  };

  return { login, logout };
}
