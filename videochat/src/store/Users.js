const buttonsStyles = [
  "from-emerald-500 via-emerald-600 to-emerald-700 focus:ring-emerald-300 dark:focus:ring-emerald-800",
  "from-teal-600 via-teal-700 to-teal-800 focus:ring-teal-400 dark:focus:ring-emerald-900",
  "from-cyan-500 via-cyan-600 to-cyan-700 focus:ring-cyan-300 dark:focus:ring-cyan-800",
  "from-sky-600 via-sky-700 to-sky-800 focus:ring-sky-400 dark:focus:ring-sky-900"
];

export default class Users {
  current = { id: 0, name: '' };
  users = [];
  toSelect = [];
  selected = [];
  opponents = new Map();

  constructor(users) {
    this.users = users.map((user, index) => ({ ...user, buttonStyle: buttonsStyles[index] }));
  }

  setCurrentUser(user) {
    this.current = user;
    this.toSelect = this.users.filter(({ id }) => id !== user.id);
  };

  getUser(id, key) {
    const user = this.users.find((u) => u.id === id);
    return key ? user[key] : user;
  };

  createOpponent(id) {
    return { id, name: this.getUser(id, 'name'), stream: null };
  };

  initOpponents(usersIds) {
    usersIds.forEach((id) => {
      this.opponents.set(id, this.createOpponent(id));
    });
  };

  addOpponent(userId) {
    if (!this.opponents.has(userId)) {
      this.opponents.set(userId, this.createOpponent(userId));
    }
  };

  updateOpponent(userId, props = {}) {
    if (this.opponents.has(userId)) {
      this.opponents.set(userId, { ...this.opponents.get(userId), ...props });
    }
  };

  removeOpponent(userId) {
    this.opponents.delete(userId);
  };

  clearOpponents() {
    this.opponents.clear();
  };

  get opponentsArray() {
    return Array.from(this.opponents.values());
  }

  get opponentsSize() {
    return this.opponents.size;
  }

  get opponentsIds() {
    return Array.from(this.opponents.keys());
  }

  get opponentsIdsString() {
    return this.opponentsIds.join(',');
  }
};