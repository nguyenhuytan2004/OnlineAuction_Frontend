import { useEffect, useCallback } from "react";
import websocketService from "../services/websocketService";

export const useChat = (conversationId, connected, handleNewMessage) => {
  // Subscribe to chat messages when conversation loads
  useEffect(() => {
    if (conversationId && connected) {
      // console.log("Subscribing to chat for conversation:", conversationId);

      websocketService.subscribeToChat(conversationId, (data) => {
        handleNewMessage?.(data);
      });
    }

    // Cleanup on unmount or conversation change
    return () => {
      if (conversationId) {
        websocketService.unsubscribeFromChat(conversationId);
      }
    };
  }, [connected, conversationId, handleNewMessage]);

  // Send a chat message
  const sendMessage = useCallback(
    (senderId, messageText) => {
      if (!websocketService.isConnected()) {
        throw new Error("WebSocket chưa kết nối");
      }

      websocketService.sendMessage(conversationId, senderId, messageText);
    },
    [conversationId],
  );

  return {
    sendMessage,
  };
};
