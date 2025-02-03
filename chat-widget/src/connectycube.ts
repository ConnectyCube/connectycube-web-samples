import ConnectyCube from "connectycube";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Chat, Users, Auth } from "@connectycube/types";

export const SESSION_KEY = "@connectycube:session";

export const isSessionExists = (): boolean => {
  return !isSessionExpired();
};

export const tryRestoreSession = (): boolean => {
  const canRestore = isSessionExists();

  if (canRestore) {
    const session = getSessionFromLocalStorage();
    ConnectyCube.setSession(session); 
  }

  return canRestore;
};

export const generateFingerprint = async (): Promise<string> => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

export const createUserSession = async (login: string, password: string) => {
  const session = await ConnectyCube.createSession({ login, password });
  setSessionToLocalStorage(session);
  return session;
};

export const createFingerprintSession = async (userFullName?: string, userId?: string): Promise<Auth.Session | null> => {
  const fp = await generateFingerprint();
  const lgn = userFullName ?? `User_${fp.slice(0, 6)}${fp.slice(-6)}`;
  const pwd = userId ?? fp;

  let session: Auth.Session | null = null;

  try {
    session = await createUserSession(lgn, pwd);
  } catch (error: any) {
    if (error.code === 404) {
      session = await userSignup(lgn, pwd);
    }
  }

  return session;
}

export const destroyUserSession = async () => {
  try {
    await ConnectyCube.destroySession();
    localStorage.clear();
  } catch (error) {
    console.error(error);
  }
};

export const userSignup = async (
  login: string,
  password: string
) => {
  await ConnectyCube.users.signup({ login, full_name: login, password });
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

export const setSessionToLocalStorage = (session: Auth.Session): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSessionFromLocalStorage = (): Auth.Session | null => {
  const jsonSession = localStorage.getItem(SESSION_KEY);
  return jsonSession ? JSON.parse(jsonSession) as Auth.Session : null;
};

export const getCurrentUser = (): Users.User | null | undefined => {
  const session = getSessionFromLocalStorage();
  return session ? session.user : null;
};

export const getSessionToken = (): string | null => {
  const session = getSessionFromLocalStorage();
  return session ? session.token : null;
};

export const getSessionUserId = (): number | null => {
  const session = getSessionFromLocalStorage();
  return session ? session.user_id : null;
};

export const isSessionExpired = (): boolean => {
  const session = getSessionFromLocalStorage();
  const updatedAt = session?.updated_at ?? new Date(0).toISOString();
  const updatedTime = new Date(updatedAt).getTime();
  const currentTime = Date.now();
  const elapsedTime = currentTime - updatedTime;
  const lifetime = (120 * 60 * 1000) - 1000; // 120 minutes

  return elapsedTime > lifetime;
}



