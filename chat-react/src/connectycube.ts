import type { Auth, Chat, Users } from "@connectycube/react";
import { ConnectyCube } from "@connectycube/react";

export const SESSION_KEY = `@connectycube:session`;
export const PWD_KEY = `@connectycube:pwd`;

export const isSessionExists = (): boolean => {
  return !!getSessionFromLocalStorage();
};

export const isSessionExpired = (): boolean => {
  const session = getSessionFromLocalStorage();
  const updatedAt = session?.updated_at ?? new Date(0).toISOString();
  const updatedTime = new Date(updatedAt).getTime();
  const currentTime = Date.now();
  const elapsedTime = currentTime - updatedTime;
  const lifetime = 120 * 60 * 1000 - 1000; // 120 minutes
  return elapsedTime > lifetime;
};

export const tryReuseSession = async (): Promise<boolean> => {
  const isReusable = !isSessionExpired();
  if (isReusable) {
    const session = getSessionFromLocalStorage();

    if (!session) {
      return false;
    }

    ConnectyCube.setSession(session);
  }
  return isReusable;
};

export const tryRestoreSession = async (): Promise<Auth.Session | null> => {
  const session = getSessionFromLocalStorage();
  const login = session?.user?.login
  const password = getPwdFromLocalStorage();

  if (login && password) {
    return await createUserSession(login, password);
  }
  
  return null;
};

export const createUserSession = async (login: string, password: string) => {
  const session = await ConnectyCube.createSession({ login, password });
  setSessionToLocalStorage(session);
  setPwdToLocalStorage(password);
  return session;
};

export const destroyUserSession = async () => {
  try {
    clearSessionInLocalStorage();
    clearPwdInLocalStorage();
    await ConnectyCube.destroySession();
  } catch (error) {
    console.error(error);
  }
};

export const userSignup = async (
  fullName: string,
  login: string,
  password: string
) => {
  await ConnectyCube.users.signup({ login, full_name: fullName, password });
  return createUserSession(login, password);
};

export const chatCredentials = (): Chat.ConnectionParams | null => {
  const token = getSessionToken();
  const userId = getSessionUserId();
  if (userId && token) {
    return { userId, password: token };
  }
  return null;
};

export const getCurrentUser = (): Users.User | null | undefined => {
  const session = getSessionFromLocalStorage();
  return session ? session.user : null;
};

export const setSessionToLocalStorage = (session: Auth.Session): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSessionFromLocalStorage = (): Auth.Session | null => {
  const jsonSession = localStorage.getItem(SESSION_KEY);
  return jsonSession ? (JSON.parse(jsonSession) as Auth.Session) : null;
};

export const clearSessionInLocalStorage = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSessionToken = (): string | null => {
  const session = getSessionFromLocalStorage();
  return session ? session.token : null;
};

export const getSessionUserId = (): number | null => {
  const session = getSessionFromLocalStorage();
  return session ? session.user_id : null;
};

export const setPwdToLocalStorage = (pwd: string): void => {
  localStorage.setItem(PWD_KEY, pwd);
};

export const getPwdFromLocalStorage = (): string | null => {
  return localStorage.getItem(PWD_KEY);
};

export const clearPwdInLocalStorage = (): void => {
  localStorage.removeItem(PWD_KEY);
};
