export class CommonUtilities {
  public static randomLogin(): string {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 5; i++) {
      text += possible[Math.floor(Math.random() * possible.length)];
    }

    return text;
  }

  public static hashCode(s: string) {
    return String(s.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0));
  }
}
