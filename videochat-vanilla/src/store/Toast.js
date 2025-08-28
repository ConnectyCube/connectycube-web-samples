export default class Toast {
  visible = false;
  message = "";

  show(message) {
    this.message = message;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
      this.message = "";
    }, 3000);
  }
};