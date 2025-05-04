const rightClickHandler = (e, node) => {
  if (e.currentTarget.getAttribute('todelete') == "delete") {
    e.currentTarget.style.backgroundColor = ''
    e.currentTarget.removeAttribute('todelete');
  } else {
    e.currentTarget.style.backgroundColor = 'pink'
    e.currentTarget.setAttribute('todelete', 'delete');
  }
  e.preventDefault();
  return false
}

//
const markToDelete = () => {
  const nodes = [...document.querySelectorAll('a[href^="/c/"]')]
  nodes.forEach(node => {
    node.style.backgroundColor = ''
    node.removeAttribute('todelete');
    node.removeEventListener('contextmenu', rightClickHandler);
  })
  nodes.forEach(node => {
    node.addEventListener('contextmenu', rightClickHandler)
  })  
}

//
const deleteMarked = async (jwtToken) => {
  const removeChat = (id) => {
    const url = `https://chatgpt.com/backend-api/conversation/${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }
    const body = JSON.stringify({ is_visible: false })
    return fetch(url, { method: 'PATCH', headers, body })
  }

  const list = [...document.querySelectorAll('[todelete="delete"]')]
    .map(e => e.getAttribute('href').slice(3))

  for (let id of list) {
    await removeChat(id)
    console.log(`deleting chat: ${id}`)
  }

  location.reload();
}

//
console.group(`Use right-mouse-button to mark chats to delete. Then`)
console.log(`- run "deleteMarked(jwtToken)"`)
console.groupEnd()
markToDelete()

