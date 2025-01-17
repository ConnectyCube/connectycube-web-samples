import ConnectyCube from "connectycube";

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
