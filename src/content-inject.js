const hw = {
  originalFetch : window.fetch.bind(window),
  httpAuthHeader: undefined
}

hw.wait = async (ms) => {
  return new Promise(done => setTimeout(done, ms))
}

hw.scrollContainer = () => {
  return document.querySelector('article')?.parentElement?.parentElement
}

hw.onReady = (handler) => {
  const cb = async () => {
    while (!document.body) { await hw.wait(100); };
    handler();
  }
  const loading = (document.readyState == 'loading') 
  loading ? document.addEventListener("DOMContentLoaded", cb) : cb()
}

// Override fetch()
;(function() {
  window.fetch = async function(input, init) {
    let request;

    if (input instanceof Request) {
      request = input;
    } else {
      request = new Request(input, init);
    }

    hw.httpAuthHeader ??= request?.headers?.get('authorization');
    return hw.originalFetch.call(this, request);
  };
})();

// Open the most recent chat if needed. Set location.pathname listener
(() => {
  const getChatUrl = ( ) => localStorage.getItem(`hw-chaturl`)
  const setChatUrl = (v) => localStorage.setItem(`hw-chaturl`, v)

  // Handle URL /#last - load most recent chat if any 
  if (getChatUrl() && location.pathname != getChatUrl() && location.hash == '#last')
    location.pathname = getChatUrl();

  // Listen location.pathname change
  let pathname = location.pathname;
  setInterval(async () => {
    if (location.pathname != pathname) {
      setChatUrl(pathname = location.pathname)
    }
  }, 500);

})();

// Restore scroll position. Set scroll listener
hw.onReady(async () => {
  const getChatTop = ( ) => localStorage.getItem(`hw-top`)
  const setChatTop = (v) => localStorage.setItem(`hw-top`, v)

  while (!hw.scrollContainer()) { await hw.wait(500) };
  const container = hw.scrollContainer()
  // give bit more time to the page
  await hw.wait(500)
  container.scrollTo({ top: getChatTop() ?? container.scrollTop, behavior: 'smooth' })
  await hw.wait(500)
  // 
  hw.scrollContainer().addEventListener('scroll', () =>
    setChatTop(hw.scrollContainer().scrollTop)
  );
})

//
hw.onReady(function() {
  // Custom CSS styles
  const style = document.createElement('style');
  style.textContent = ``;
  style.textContent = `
    .hw-marked {
      background: linear-gradient(to bottom,
        transparent 0px,
        rgba(255, 192, 203, 0.4) 2px,
        rgba(255, 192, 203, 0.4) calc(100% - 2px),
        transparent 100%) !important;
    }
    #hw-delete-btn {
      outline: 1px solid grey;
      margin-left: 8px;
    }
    .hw-blur {
      filter: blur(4px);
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
      'Authorization': `${hw.httpAuthHeader}`
    }
    const body = JSON.stringify({ is_visible: false })
    const resp = await hw.originalFetch(url, { method: 'PATCH', headers, body })
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
        button.style.cssText = `
          position: absolute;
          background: #000;
          color: #fff;
          padding: 5px;
          border-radius: 4px;
          z-index: 10000;
          font-size: 12px;
          cursor: pointer;
        `;
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

  // Unmark all chats and updateDeleteButton on click
  document.body.addEventListener('click', e => {
    [...document.querySelectorAll('.hw-marked')].map(e => e.classList.toggle('hw-marked'))
    updateDeleteButton();
  });

  // Toggle chat selection by right-click
  document.body.addEventListener('contextmenu', e => {
    const a = e.target.closest('a');
    if (!a || !a.matches('a[href*="/c/"]')) {
      return
    }
    e.preventDefault();
    e.stopPropagation()

    a.classList.toggle('hw-marked');
    const count = getMarkedChatIds().length;
    const title = count ? `Click HERE to delete ${count} chats` : undefined
    updateDeleteButton(a, title);
  });

  // Toggle blur on ctrl + right-click
  document.body.addEventListener('contextmenu', e => {
    if (!e.ctrlKey/* || e.altKey || e.shiftKey*/) {
      return
    }
    document.body.parentElement.classList.toggle('hw-blur')
    e.preventDefault();
    e.stopPropagation()
  });

});
