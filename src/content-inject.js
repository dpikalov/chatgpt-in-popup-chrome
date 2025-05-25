const originalFetch = window.fetch;
let httpAuthHeader = undefined;

// Override fetch()
;(function() {

  window.fetch = async function(input, init) {
    let request;

    if (input instanceof Request) {
      request = input;
    } else {
      request = new Request(input, init);
    }

    httpAuthHeader ??= request?.headers?.get('authorization');
    return originalFetch.call(this, request);
  };

})();

/**/
document.addEventListener("DOMContentLoaded", function() {
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
  const getMarkedChatIds = () => {
    return [...document.querySelectorAll('.hw-marked')].map(e =>
      e.getAttribute('href').split('/').pop()
    )
  }

  //
  const deleteMarkedChats = async () => {
    for (let id of getMarkedChatIds()) {
      updateDeleteButton(undefined, `Deleting chat: ${id}`)
      await deleteChat(id);
    }
    location.reload();
  }

  //
  const deleteChat = async (id) => {
    const url = `https://chatgpt.com/backend-api/conversation/${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${httpAuthHeader}`
    }
    const body = JSON.stringify({ is_visible: false })
    const resp = await originalFetch(url, { method: 'PATCH', headers, body })
    return resp;
  }

  //
  const updateDeleteButton = (forElement, title) => {
      if (!title) {
        document.querySelector('#hw-delete-btn')?.remove()
        return;
      }

      let button = document.querySelector('#hw-delete-btn')
      if (button == undefined) {
        button = document.createElement('div');
        button.setAttribute('id', 'hw-delete-btn');
        button.style.position = 'absolute';
        button.style.background = '#000';
        button.style.color = '#fff';
        button.style.padding = '5px';
        button.style.borderRadius = '4px';
        button.style.zIndex = 10_000;
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', function(e) {
          deleteMarkedChats();
          e.stopPropagation()
        })

        document.body.style.pointerEvents = 'unset';
        document.body.appendChild(button);
      }

      if (forElement) {
        button.style.top = (forElement.getBoundingClientRect().bottom - 32) + 'px';
        button.style.left = forElement.getBoundingClientRect().right + 'px';
      }

      button.textContent = title;
  }

  // Toggle chat by right-click
  document.body.addEventListener('contextmenu', function(e) {
    const a = e.target.closest('a');
    if (!a || !a.matches('a[href*="/c/"]')) {
      return
    }

    a.classList.toggle('hw-marked');
    const count = getMarkedChatIds().length;
    const title = count ? `Click HERE to delete ${count} chats` : undefined
    updateDeleteButton(a, title);

    e.preventDefault();
  });

  // Unmark all chats and updateDeleteButton on click
  document.body.addEventListener('click', function(e) {
    [...document.querySelectorAll('.hw-marked')].map(e => e.classList.toggle('hw-marked'))
    updateDeleteButton();
  });
});
