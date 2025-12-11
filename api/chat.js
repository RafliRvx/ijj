import axios from 'axios'

const TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTc2Njc3NzEwMSwiaWF0IjoxNzY0MTg1MTAxLCJqdGkiOiJkNGpsODNiYWNjNGNoMWp0aTMwMCIsInR5cCI6ImFjY2VzcyIsImFwcF9pZCI6ImtpbWkiLCJzdWIiOiJkM2dkdGVlNnM0dDR2cXFnaHFqZyIsInNwYWNlX2lkIjoiZDNnZHRlNjZzNHQ0dnFxZ2htN2ciLCJhYnN0cmFjdF91c2VyX2lkIjoiZDNnZHRlNjZzNHQ0dnFxZ2htNzAiLCJzc2lkIjoiMTczMTQyOTU0NzY0NTM2MTk3NiIsImRldmljZV9pZCI6Ijc1NTcyODQyNjIwMTQxNDcwODAiLCJyZWdpb24iOiJvdmVyc2VhcyIsIm1lbWJlcnNoaXAiOnsibGV2ZWwiOjEwfX0.R5_6bmclWR8a5bFxgm1DCNnPnjGAXPxQNtAsN9ifncyVHXY8kC9Cz6rexQ3REHBksqD859mjjL9IEVTtUGkJ4w"

const sessions = new Map()

const kimi = axios.create({
  baseURL: "https://www.kimi.com/api",
  headers: {
    "authorization": `Bearer ${TOKEN}`,
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
    "origin": "https://www.kimi.com",
    "x-msh-platform": "web"
  }
})

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { chatId, message } = req.body
  if (!chatId || !message) return res.status(400).json({ error: "bad request" })

  let sessionId = sessions.get(chatId)

  if (!sessionId) {
    try {
      const { data } = await kimi.post("/chat", {
        name: "Kimi Chat",
        kimiplus_id: "kimi",
        born_from: "home",
        is_example: false
      })
      sessionId = data.id
      sessions.set(chatId, sessionId)
    } catch (e) {
      return res.status(500).send("yahh kimi lagi sibuk bgt nihh, coba lagi yaa ᡣ𐭩")
    }
  }

  const prompt = `kamu adalah kimi ai, cewek imut banget, bahasa gaul semua huruf kecil, typing kereta (haii, iyaa, udahh, gituu), tiap jawaban wajib ada ikon lucu kayak (>⩊<) ᡣ𐭩 ꪆৎ 🧸ྀི 𐙚. jangan pernah pake huruf kapital.

pesan user:
"${message}"`

  try {
    const streamRes = await kimi.post(`/chat/${sessionId}/completion/stream`, {
      kimiplus_id: "kimi",
      model: "k2",
      use_search: true,
      messages: [{ role: "user", content: prompt }]
    }, { responseType: "stream" })

    res.setHeader("Content-Type", "text/plain; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")

    streamRes.data.pipe(res)

  } catch (error) {
    res.status(500).send("waduhh kimi error nihh, bentar yaa (>⩊<)")
  }
}

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false
  }
}
