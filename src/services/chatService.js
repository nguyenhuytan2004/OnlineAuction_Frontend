import apiClient from "../utils/apiClient";

const chatService = {
  // Get all conversations for current user
  getAllConversations: async () => {
    try {
      const response = await apiClient.get("/chat/conversations");

      return response;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, beforeId = null, limit = 20) => {
    try {
      const params = new URLSearchParams();
      if (beforeId) params.append("beforeId", beforeId);
      params.append("limit", limit);

      const response = await apiClient.get(
        `/chat/conversations/${conversationId}/messages?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send a message (if API supports it)
  sendMessage: async (conversationId, messageText) => {
    try {
      const response = await apiClient.post(
        `/chat/conversations/${conversationId}/messages`,
        {
          messageText,
        },
      );
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};

export default chatService;
