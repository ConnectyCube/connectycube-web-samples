import ConnectyCube from "connectycube";
import { Chat, Users } from "connectycube/dist/types/types";

export const isSessionExists = (): boolean => {
  return !!localStorage.getItem("connectycubeToken");
};
export const tryRestoreSession = (): boolean => {
  const sessionToken = localStorage.getItem("connectycubeToken");
  // const userIdString = localStorage.getItem("connectycubeUserId");
  // let currentUserId;
  if (sessionToken) {
    ConnectyCube.setSession({ token: sessionToken } as any);
    // currentUserId = parseInt(userIdString!);
    return true;
  }

  return false;
};

export const createUserSession = async (login: string, password: string) => {
  const session = await ConnectyCube.createSession({ login, password });
  localStorage.setItem("connectycubeToken", session.token);
  localStorage.setItem("connectycubeUserId", session.user_id + "");
  localStorage.setItem("connectycubeUser", JSON.stringify(session.user));
  return session;
};

export const destroyUserSession = async () => {
  try {
    await ConnectyCube.destroySession();
    localStorage.clear();
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
  const sessionToken = localStorage.getItem("connectycubeToken");
  const userIdString = localStorage.getItem("connectycubeUserId");

  if (sessionToken) {
    return { userId: parseInt(userIdString as string), password: sessionToken };
  }

  return null;
};

export const currentUser = (): Users.User | null => {
  const userString = localStorage.getItem("connectycubeUser");
  if (userString) {
    return JSON.parse(userString);
  }

  return null;
};
