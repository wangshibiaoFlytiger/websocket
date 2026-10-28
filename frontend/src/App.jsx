import { useState, useEffect, useRef } from 'react'

function App() {
    const [username, setUsername] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const ws = useRef(null)

    const handleLogin = () => {
        if (!username.trim()) return
        // Connect to WebSocket
        ws.current = new WebSocket(`ws://localhost:8080/ws?username=${username}`)

        ws.current.onopen = () => {
            setIsLoggedIn(true)
            console.log('Connected')
        }

        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data])
        }

        ws.current.onclose = () => {
            setIsLoggedIn(false)
            console.log('Disconnected')
        }
    }

    const sendMessage = () => {
        if (ws.current && input.trim()) {
            ws.current.send(input)
            setInput('')
        }
    }

    return (
        <div className="container">
            {!isLoggedIn ? (
                <div className="login-box">
                    <h1>Welcome to Chat</h1>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin}>Join Chat</button>
                </div>
            ) : (
                <div className="chat-box">
                    <div className="header">
                        <h2>Logged in as: {username}</h2>
                        <button onClick={() => ws.current.close()} className="logout-btn">Leave</button>
                    </div>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="message">
                                {msg}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
