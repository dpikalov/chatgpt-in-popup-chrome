let myAuthHeader = undefined;

//
const deleteMarked = async () => {
  if (!confirm('Delete marked chats?')) {
    return;
  }

  const removeChat = (id) => {
    const url = `https://chatgpt.com/backend-api/conversation/${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${myAuthHeader}`
    }
    const body = JSON.stringify({ is_visible: false })
    return fetch(url, { method: 'PATCH', headers, body })
  }

  const list = [...document.querySelectorAll('[marked-to-delete=yes]')]
    .map(e => e.getAttribute('href').slice(3))

  for (let id of list) {
    await removeChat(id)
    console.log(`deleting chat: ${id}`)
  }

  location.reload();
}

//
document.body.addEventListener('contextmenu', function(e) {
  const a = e.target.parentElement;
  if (!a.matches('a[href^="/c/"]')) {
    return true;
  }

  if (a.getAttribute('marked-to-delete') !== 'yes') {
    a.style.backgroundColor = 'rgba(255, 192, 203, 0.4)';
    a.setAttribute('marked-to-delete', 'yes');
    showDeleteButton(a)
  } else {
    a.style.backgroundColor = ''
    a.removeAttribute('marked-to-delete');
    showDeleteButton(document.querySelector('[marked-to-delete]') ? a : undefined)
  }

  e.preventDefault();
  return false;
}, true);


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
function showDeleteButton(el) {
    //const el = document.querySelector(selector);
    //const title = el.getAttribute('title');
    //el.removeAttribute('title');

    const btn = document.querySelector('#bulk-delete-button')
    btn?.remove()

    if (!el) return;

    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'bulk-delete-button');
    tooltip.textContent = 'Click HERE to delete marked chats';
    tooltip.style.position = 'absolute';
    tooltip.style.top = (el.getBoundingClientRect().bottom - 32) + 'px';
    tooltip.style.left = el.getBoundingClientRect().right + 'px';
    tooltip.style.background = '#000';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = 1000;
    tooltip.style.fontSize = '12px';
    tooltip.style.cursor = 'pointer';
    tooltip.onclick = deleteMarked;

    document.body.appendChild(tooltip);
}

// Redefine fetch
//document.addEventListener('DOMContentLoaded', function () {
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

