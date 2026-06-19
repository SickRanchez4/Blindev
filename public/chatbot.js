/**
 * Chatbot Bubble Container
 * Contenedor flotante vacío que muestra el chatbot desde el endpoint
 * 
 */

class ChatbotBubble {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createBubble();
    this.attachEvents();
  }

  createBubble() {
    // Botón flotante
    const button = document.createElement('button');
    button.id = 'chatbot-button';
    button.className = 'chatbot-bubble-button';
    button.innerHTML = '<i class="fas fa-comments"></i>';
    button.title = 'Abrir chat';

    // Contenedor
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.className = 'chatbot-bubble-container';

    // Header con botón cerrar
    const header = document.createElement('div');
    header.className = 'chatbot-bubble-header';
    header.innerHTML = '<button id="chatbot-close-button" class="chatbot-close-btn" title="Cerrar"><i class="fas fa-times"></i></button>';

    // Área de contenido (vacía, se llena desde el endpoint)
    const content = document.createElement('div');
    content.id = 'chatbot-content';
    content.className = 'chatbot-bubble-content';

    container.appendChild(header);
    container.appendChild(content);

    // Widget wrapper
    const widget = document.createElement('div');
    widget.id = 'chatbot-widget';
    widget.className = 'chatbot-widget';
    widget.appendChild(button);
    widget.appendChild(container);

    document.body.appendChild(widget);

    this.button = button;
    this.container = container;
    this.content = content;
  }

  attachEvents() {
    this.button.addEventListener('click', () => this.toggle());
    document.getElementById('chatbot-close-button').addEventListener('click', () => this.close());
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.button.classList.add('hidden');
    this.container.classList.add('open');
    
    // Cargar contenido del endpoint si aún no está cargado
    if (this.content.innerHTML.trim() === '') {
      this.loadContent();
    }
  }

  close() {
    this.isOpen = false;
    this.button.classList.remove('hidden');
    this.container.classList.remove('open');
  }

  loadContent() {
    const iframe = document.createElement('iframe');
    iframe.src = this.endpoint;
    iframe.frameborder = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.borderRadius = '0';
    this.content.appendChild(iframe);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const endpoint = window.CHATBOT_ENDPOINT;
  if (!endpoint) {
    return;
  }
  window.chatbot = new ChatbotBubble(endpoint);
});
