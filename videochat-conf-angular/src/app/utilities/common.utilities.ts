import * as html from "html-escaper";

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

  public static urlify(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url: string) => {
      return '<a target="_blank" href="' + url + '">' + url + '</a>';
    })
  }

  static escapeHTMLString(unescapedString: string): string {
    if (!unescapedString) {
      return "";
    }
    const escaped = html.escape(unescapedString);
    return this.urlify(escaped);
  }
}

