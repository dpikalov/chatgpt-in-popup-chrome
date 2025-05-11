;(function () {
  let httpAuthHeader = undefined;

  // Custom CSS styles
  const style = document.createElement('style');
  style.textContent = ``;
  style.textContent = `
    .hw-marked {
      background-color: rgba(255, 192, 203, 0.4) !important;
    }
    #hw-delete-btn {
      outline: 1px solid grey;
      margin-left: 8px;
    }`;
  document.head.appendChild(style)

  //
  const updateDeleteButton = (forElement) => {
      document.querySelector('#hw-delete-btn')?.remove()

      const chatIds = () =>
        [...document.querySelectorAll('.hw-marked')].map(e => e.getAttribute('href').split('/').pop())

      const count = chatIds().length
      if (!count || !forElement) return;

      const tooltip = document.createElement('div');
      tooltip.setAttribute('id', 'hw-delete-btn');
      tooltip.textContent = `Click HERE to delete ${count} chats`;
      tooltip.style.position = 'absolute';
      tooltip.style.top = (forElement.getBoundingClientRect().bottom - 32) + 'px';
      tooltip.style.left = forElement.getBoundingClientRect().right + 'px';
      tooltip.style.background = '#000';
      tooltip.style.color = '#fff';
      tooltip.style.padding = '5px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.zIndex = 10_000;
      tooltip.style.fontSize = '12px';
      tooltip.style.cursor = 'pointer';

      tooltip.onclick = async () => {
        for (let id of chatIds()) {
          tooltip.textContent = `Deleting chat... ${id}`
          await deleteChat(id);
        }
        location.reload();
      }

      document.body.style.pointerEvents = 'unset';
      document.body.appendChild(tooltip);
  }

  //
  const deleteChat = async (id) => {
    const url = `https://chatgpt.com/backend-api/conversation/${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${httpAuthHeader}`
    }
    const body = JSON.stringify({ is_visible: false })
    return fetch(url, { method: 'PATCH', headers, body })
  }

  // Toggle chat by right-click
  document.body.addEventListener('contextmenu', function(e) {
    const a = e.target.parentElement;
    if (!a.matches('a[href*="/c/"]')) return true;

    a.classList.toggle('hw-marked');
    updateDeleteButton(a);

    e.preventDefault();
    return false;
  }, true);

  // Unmark chats and hide bitton on click
  document.body.addEventListener('click', function(e) {
    [...document.querySelectorAll('.hw-marked')].map(e => e.classList.toggle('hw-marked'))
    updateDeleteButton();
  });

  // Override fetch()
  (function() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      const url = args?.[0];
      const options = args?.[1] || {};
      const headers = options.headers || {};

      if (headers.Authorization || headers.authorization) {
        httpAuthHeader = headers.Authorization || headers.authorization;
      }
      return response;
    };
  })();
})();
