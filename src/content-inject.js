/*
  blur chat titles
  const style = document.createElement('style');
  style.textContent = `
    a[href^="/c/"] {
      filter: blur(2px);
    }
  `;
  document.head.appendChild(style)
*/

(function () {

  let myAuthHeader = undefined;

  //
  const getMarkedChatIds = () => {
    return [...document.querySelectorAll('[marked-to-delete=yes]')]
      .map(e => e.getAttribute('href')?.split('/').pop())
  }

  //
  const resetMarkedChats = () => {
    [...document.querySelectorAll('[marked-to-delete=yes]')]
      .map(e => e.setAttribute('marked-to-delete', ''))
    tobleDeleteButton(undefined, 0)
  }

  //
  const deleteChats = async (chatIds) => {
    if (!confirm('Delete marked chats?')) {
      resetMarkedChats();
      return;
    }

    const deleteOne = (id) => {
      const url = `https://chatgpt.com/backend-api/conversation/${id}`
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${myAuthHeader}`
      }
      const body = JSON.stringify({ is_visible: false })
      //alert(`deleting chat: ${id}`)
      return fetch(url, { method: 'PATCH', headers, body })
    }

    for (let id of chatIds) {
      await deleteOne(id)
    }

    location.reload();
  }

  //
  function tobleDeleteButton(forElement, count) {
      document.querySelector('#bulk-delete-button')?.remove()

      if (!count || !forElement) return;

      const tooltip = document.createElement('div');
      tooltip.setAttribute('id', 'bulk-delete-button');
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
      tooltip.onclick = () => deleteChats(getMarkedChatIds());

      document.body.style.pointerEvents = 'unset';
      document.body.appendChild(tooltip);
  }

  // mark/unmark chat
  document.body.addEventListener('contextmenu', function(e) {
    const a = e.target.parentElement;
    if (!a.matches('a[href*="/c/"]')) {
      return true;
    }

    if (a.getAttribute('marked-to-delete') !== 'yes') {
      a.style.backgroundColor = 'rgba(255, 192, 203, 0.4)';
      a.setAttribute('marked-to-delete', 'yes');
    } else {
      a.style.backgroundColor = ''
      a.removeAttribute('marked-to-delete');
    }

    tobleDeleteButton(a, getMarkedChatIds().length)

    e.preventDefault();
    return false;
  }, true);

  // override fetch()
  (function() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      const url = args?.[0];
      const options = args?.[1] || {};
      const headers = options.headers || {};

      if (headers.Authorization || headers.authorization) {
        myAuthHeader = headers.Authorization || headers.authorization;
      }

      return response;
    };
  })();
})();

