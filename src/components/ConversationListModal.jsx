import React, { useState, useEffect } from "react";
import { X, Loader, Search } from "lucide-react";

import chatService from "../services/chatService";
import { useAuth } from "../hooks/useAuth";

import formatters from "../utils/formatters";

const ConversationListModal = ({ isOpen, onClose, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getAllConversations();
      setConversations(data.filter((conv) => conv.isActive) || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser =
      conv.seller?.userId === user?.userId ? conv.buyer : conv.seller;
    const productName = conv.product?.productName || "";
    const userName = otherUser?.fullName || "";

    const query = searchQuery.toLowerCase();
    return (
      productName.toLowerCase().includes(query) ||
      userName.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  const handleSelectConversation = (conversation) => {
    onSelectConversation(conversation);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Conversation List Window */}
      <div className="relative w-full sm:w-96 h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl shadow-amber-500/20 border border-slate-700/50 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-orange-600 rounded-t-2xl p-5 flex items-center justify-between border-b border-slate-700/50 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"></div>
          </div>

          <div className="relative z-10 ml-2">
            <h3 className="font-black text-lg text-white">Tin Nhắn</h3>
            <p className="text-xs text-amber-100">
              {filteredConversations.length || conversations.length} cuộc hội
              thoại
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-700/30 bg-slate-800/50 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người hoặc sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 hover:border-slate-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-400">Đang tải...</p>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">
                  {searchQuery
                    ? "Không tìm thấy kết quả"
                    : "Chưa có cuộc hội thoại nào"}
                </p>
                {searchQuery && (
                  <p className="text-xs text-slate-500">
                    Thử tìm kiếm từ khóa khác
                  </p>
                )}
              </div>
            </div>
          ) : (
            filteredConversations.map((conv, index) => {
              const otherUser =
                conv.seller?.userId === user?.userId ? conv.buyer : conv.seller;

              return (
                <button
                  key={conv.conversationId}
                  onClick={() => handleSelectConversation(conv)}
                  className="w-full text-left p-4 bg-gradient-to-r from-slate-700/40 to-slate-600/20 hover:from-slate-700/80 hover:to-slate-600/60 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-amber-500/60 group hover:shadow-lg hover:shadow-amber-500/10 animate-in slide-in-from-left-2 fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">
                        {(otherUser?.fullName || "U")[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors duration-200 truncate">
                        {otherUser?.fullName || "Người dùng"}
                      </p>
                      <p className="text-xs text-slate-400 group-hover:text-slate-300 truncate transition-colors duration-200">
                        {conv.product?.productName}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-200 mt-1">
                        {formatters.getRelativeTimeFromNow(conv.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationListModal;
