export default class NotificationMessage {
  static displayNotification;

  constructor(string = '', { duration = 0, type = '' }) {
    this.string = string;
    this.duration = duration;
    this.type = type;
  }

  show(sub = document.body) {
    if (NotificationMessage.displayNotification) {
      NotificationMessage.displayNotification.remove();
    }
    sub.append(this.render());
    setTimeout(() => this.destroy(), this.duration);
  }

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.string}
        </div>
      </div>
    </div>`;
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;
    NotificationMessage.displayNotification = this.element;

    return NotificationMessage.displayNotification;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
