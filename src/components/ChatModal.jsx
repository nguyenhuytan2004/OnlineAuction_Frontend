import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader, ArrowLeft, ChevronDown } from "lucide-react";
import chatService from "../services/chatService";
import { useChat } from "../hooks/useChat";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "../hooks/useAuth";

const ChatModal = ({ isOpen, onClose, conversation, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const latestMessageSimulationRef = useRef(null);
  const inputMessageRef = useRef(null);

  const { user } = useAuth();
  const { connected } = useWebSocket();

  // Handle new message from WebSocket
  const handleNewMessage = useCallback((newMsg) => {
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setIsSending(false);
    setIsAtBottom(true);
  }, []);

  // Use WebSocket chat hook
  const { sendMessage } = useChat(
    conversation?.conversationId,
    connected,
    handleNewMessage,
  );

  const handSendMessage = () => {
    setIsSending(true);
    sendMessage(user.userId, newMessage);
    setNewMessage("");
    inputMessageRef.current?.focus();
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await chatService.getMessages(conversation.conversationId);
        setMessages(data);
        setIsAtBottom(true);
        setHasMore(data.length >= 20);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && conversation) {
      fetchMessages();
    }
  }, [isOpen, conversation]);

  // Auto-scroll to bottom when new message comes
  useEffect(() => {
    if (isAtBottom && latestMessageSimulationRef.current) {
      latestMessageSimulationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isAtBottom]);

  // Handle scroll to detect if at bottom
  const handleScroll = useCallback(
    (e) => {
      const container = e.target;
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        20;
      setIsAtBottom(atBottom);

      // Load older messages
      const handleLoadMore = async () => {
        if (!hasMore || messages.length === 0 || isLoadingMore) return;

        try {
          setIsLoadingMore(true);
          const oldestMessageId = messages[0]?.messageId;
          const moreMessages = await chatService.getMessages(
            conversation.conversationId,
            oldestMessageId,
            20,
          );

          if (moreMessages.length === 0) {
            setHasMore(false);
          } else {
            if (moreMessages.length < 20) {
              setHasMore(false);
            }
            setMessages((prev) => [...moreMessages, ...prev]);
          }
        } catch (error) {
          console.error("Failed to load more messages:", error);
        } finally {
          setIsLoadingMore(false);
        }
      };

      // Load more messages when scrolled to top
      if (container.scrollTop < 10 && hasMore && !isLoadingMore && !isLoading) {
        console.log("Loading more messages...");
        handleLoadMore();
      }
    },
    [hasMore, isLoadingMore, isLoading, messages, conversation.conversationId],
  );

  // Scroll to bottom
  const scrollToBottom = () => {
    setIsAtBottom(true);
    if (latestMessageSimulationRef.current) {
      latestMessageSimulationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  const otherUser =
    conversation.seller.userId !== conversation.buyer.userId
      ? conversation.buyer
      : conversation.seller;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full sm:w-96 h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl shadow-amber-500/20 border border-slate-700/50 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-orange-600 rounded-t-2xl p-5 flex items-center justify-between border-b border-slate-700/50 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"></div>
          </div>

          <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">
                {otherUser?.fullName || "Chat"}
              </h3>
              <p className="text-xs text-amber-100 truncate">
                {conversation.product?.productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages Container */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-800/50 to-slate-900/50 relative"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full pointer-events-none z-10"></div>

          {/* Load more indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-2">
              <Loader className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="ml-2 text-xs text-slate-400">
                Đang tải tin nhắn cũ...
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-400">Đang tải tin nhắn...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-slate-400 text-sm">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOther = msg.sender?.userId !== user.userId;
              return (
                <div
                  key={msg.messageId}
                  className={`flex ${
                    !isOther ? "justify-end" : "justify-start"
                  } animate-in slide-in-from-bottom-2 fade-in duration-300`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      !isOther
                        ? "bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                        : "bg-slate-700/60 text-slate-100 shadow-lg shadow-slate-950/20 hover:bg-slate-700/80"
                    }`}
                  >
                    <p className="break-words">{msg.messageText}</p>
                    <p className="text-xs opacity-70 mt-1.5 leading-tight">
                      {new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={latestMessageSimulationRef} />
        </div>

        {/* Scroll to bottom button */}
        {!isAtBottom && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={scrollToBottom}
              className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
              title="Cuộn xuống"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-700/30 p-4 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              ref={inputMessageRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? handSendMessage() : null)}
              placeholder="Nhập tin nhắn..."
              disabled={isSending}
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 hover:border-slate-500"
            />
            <button
              onClick={handSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
            >
              {isSending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
