export const getTime = (messageTime?: number | string | null) => {
  if (!messageTime) {
    return 'unknown';
  }

  if (Number.isInteger(messageTime)) {
    const now = new Date(+messageTime * 1000);
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0
    );
    return (
      (d.getDate() < 10 ? "0" : "") +
      d.getDate() +
      "." +
      (d.getMonth() < 10 ? "0" : "") +
      d.getMonth() +
      "." +
      d.getFullYear() +
      ", " +
      d.getHours() +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes()
    );
  } else {
    const now = messageTime;
    const json = JSON.stringify(now);
    const dateStr = JSON.parse(json);
    const d = new Date(dateStr);

    return (
      (d.getDate() < 10 ? "0" : "") +
      d.getDate() +
      "." +
      (d.getMonth() < 10 ? "0" : "") +
      d.getMonth() +
      "." +
      d.getFullYear() +
      ", " +
      d.getHours() +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes()
    );
  }
};
