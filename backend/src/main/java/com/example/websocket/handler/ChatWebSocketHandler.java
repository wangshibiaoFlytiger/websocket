package com.example.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Store active sessions. Key is session ID, Value is the session object.
    // In a real app, you might map User ID to Session.
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> userNames = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        // Extract username from query, e.g., ws://localhost:8080/ws?username=Alice
        String query = session.getUri().getQuery();
        String username = "Anonymous";
        if (query != null && query.contains("username=")) {
            username = query.split("username=")[1];
        }
        userNames.put(session.getId(), username);

        broadcast("System", username + " joined the chat");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = userNames.get(session.getId());
        sessions.remove(session.getId());
        userNames.remove(session.getId());
        broadcast("System", username + " left the chat");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String username = userNames.get(session.getId());
        broadcast(username, message.getPayload());
    }

    private void broadcast(String sender, String message) {
        String payload = sender + ": " + message;
        sessions.values().forEach(s -> {
            try {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(payload));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
