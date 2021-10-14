import React, { createContext, useState } from "react";

export const UsersContext = createContext();

export const UsersProvider = (props) => {
  const [users, setUsers] = useState([
    {
      id: 72780,
      name: "Alice",
      login: "videouser1",
      password: "videouser1",
      color: "#34ad86",
    },
    {
      id: 72781,
      name: "Bob",
      login: "videouser2",
      password: "videouser2",
      color: "#077988",
    },
    {
      id: 590565,
      name: "Ciri",
      login: "videouser3",
      password: "videouser3",
      color: "#13aaae",
    },
    {
      id: 590583,
      name: "Dexter",
      login: "videouser4",
      password: "videouser4",
      color: "#056a96",
    },
  ]);

  return (
    <UsersContext.Provider value={[users, setUsers]}>
      {props.children}
    </UsersContext.Provider>
  );
};
