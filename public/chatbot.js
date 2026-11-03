/**
 * Chatbot Bubble
 * Botón flotante que abre un panel con el chatbot cargado (en un iframe) desde CHATBOT_ENDPOINT.
 */
class ChatbotBubble {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.isOpen = false;
    this.isLoaded = false;
    this.render();
    this.bindEvents();
  }

  static createElement(tag, { id, className, html, attributes = {} } = {}) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (className) element.className = className;
    if (html) element.innerHTML = html;
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  }

  render() {
    this.button = ChatbotBubble.createElement('button', {
      id: 'chatbot-button',
      className: 'chatbot-bubble-button',
      html: '<i class="fas fa-comments" aria-hidden="true"></i>',
      attributes: { type: 'button', title: 'Abrir chat', 'aria-label': 'Abrir chat', 'aria-expanded': 'false' },
    });

    this.closeButton = ChatbotBubble.createElement('button', {
      id: 'chatbot-close-button',
      className: 'chatbot-close-btn',
      html: '<i class="fas fa-times" aria-hidden="true"></i>',
      attributes: { type: 'button', title: 'Cerrar', 'aria-label': 'Cerrar chat' },
    });

    const header = ChatbotBubble.createElement('div', { className: 'chatbot-bubble-header' });
    header.appendChild(this.closeButton);

    this.content = ChatbotBubble.createElement('div', { id: 'chatbot-content', className: 'chatbot-bubble-content' });

    this.container = ChatbotBubble.createElement('div', { id: 'chatbot-container', className: 'chatbot-bubble-container' });
    this.container.append(header, this.content);

    this.widget = ChatbotBubble.createElement('div', { id: 'chatbot-widget', className: 'chatbot-widget' });
    this.widget.append(this.button, this.container);

    document.body.appendChild(this.widget);
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.toggle());
    this.closeButton.addEventListener('click', () => this.close());
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.setOpen(true);
    this.widget.classList.add('has-opened');
    if (!this.isLoaded) {
      this.loadContent();
    }
  }

  close() {
    this.setOpen(false);
  }

  setOpen(isOpen) {
    this.isOpen = isOpen;
    this.button.classList.toggle('hidden', isOpen);
    this.button.setAttribute('aria-expanded', String(isOpen));
    this.container.classList.toggle('open', isOpen);
  }

  loadContent() {
    const iframe = ChatbotBubble.createElement('iframe', {
      className: 'chatbot-iframe',
      attributes: { src: this.endpoint, title: 'Chatbot Blindev' },
    });
    this.content.appendChild(iframe);
    this.isLoaded = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const endpoint = window.CHATBOT_ENDPOINT;
  if (endpoint) {
    window.chatbot = new ChatbotBubble(endpoint);
  }
});
