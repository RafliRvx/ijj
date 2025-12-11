const chatBox = document.getElementById('chat-box')
const form = document.getElementById('chat-form')
const input = document.getElementById('user-input')
const themeBtn = document.getElementById('theme-toggle')
const newBtn = document.getElementById('new-chat')

const chatId = location.pathname.split('/').pop() || Math.random().toString(36).slice(2)

let isFirst = chatBox.querySelector('.start-text')

form.addEventListener('submit', async e => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return

  if (isFirst) {
    chatBox.innerHTML = ''
    isFirst = false
  }

  addMessage(text, 'user')
  input.value = ''

  const aiMsg = addMessage('', 'ai')
  aiMsg.innerHTML = `<div class="name">Kimi AI</div><span style="opacity:0.7">kimi lagi ngetik<span class="dots">...</span></span>`

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: text })
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let result = ''

    aiMsg.innerHTML = '<div class="name">Kimi AI</div>'

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      result += chunk
      aiMsg.innerHTML = `<div class="name">Kimi AI</div>${result.replace(/\n/g, '<br>')}`
      chatBox.scrollTop = chatBox.scrollHeight
    }
  } catch {
    aiMsg.innerHTML = '<div class="name">Kimi AI</div>yahh error nihh, coba lagi yaa ᡣ𐭩'
  }
})

function addMessage(text, sender) {
  const div = document.createElement('div')
  div.className = `message ${sender}`
  if (sender === 'ai') {
    div.innerHTML = `<div class="name">Kimi AI</div>${text}`
  } else {
    div.textContent = text
  }
  chatBox.appendChild(div)
  chatBox.scrollTop = chatBox.scrollHeight
  return div
}

// Theme toggle
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
})

// New chat = buka tab baru
newBtn.addEventListener('click', () => {
  const newId = Math.random().toString(36).slice(2)
  window.open(`/${newId}`, '_blank')
})
