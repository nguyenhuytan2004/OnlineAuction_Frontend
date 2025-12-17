import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatModal from "./ChatModal";
import ConversationListModal from "./ConversationListModal";

const ChatFloatingButton = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenConversationList = () => {
    setIsConversationListOpen(true);
  };

  const handleCloseConversationList = () => {
    setIsConversationListOpen(false);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setIsConversationListOpen(false);
    setIsChatOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatOpen(false);
  };

  const handleBackFromChat = () => {
    setIsChatOpen(false);
    setIsConversationListOpen(true);
  };

  return (
    <>
      {/* Main Float Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleOpenConversationList}
          className="relative w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-full shadow-lg shadow-amber-500/50 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
        >
          <MessageCircle className="w-7 h-7" />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Chat với người mua/bán
          </div>
        </button>
      </div>

      {/* Conversation List Modal */}
      <ConversationListModal
        isOpen={isConversationListOpen}
        onClose={handleCloseConversationList}
        onSelectConversation={handleSelectConversation}
      />

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChatModal}
          conversation={selectedConversation}
          onBack={handleBackFromChat}
        />
      )}
    </>
  );
};

export default ChatFloatingButton;
