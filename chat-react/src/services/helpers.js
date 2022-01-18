export const getTime = (messageTime) => {
  if (Number.isInteger(messageTime)) {
    const now = new Date(messageTime * 1000);
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0
    );
    return (
      d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes()
    );
  } else {
    const now = messageTime;
    var json = JSON.stringify(now);
    var dateStr = JSON.parse(json);
    var d = new Date(dateStr);
    return (
      d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes()
    );
  }
};
