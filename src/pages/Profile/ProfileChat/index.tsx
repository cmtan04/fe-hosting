import { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "antd";
import { ChatPanel } from "./components/ChatPanel";
import { ConversationList } from "./components/ConversationList";
import { useChatConversations } from "./hooks/useChatConversations";
import "./style.scss";

export const ProfileChat = () => {
  const {
    activeConversation,
    activeConversationId,
    conversationViews,
    currentUserId,
    isLoading,
    isMobile,
    locationConversationId,
    selectConversation,
  } = useChatConversations();
  const [mobileView, setMobileView] = useState<"list" | "content">("list");
  const hasInitializedMobileViewRef = useRef(false);

  const shouldShowMobileContent = useMemo(
    () => isMobile && mobileView === "content",
    [isMobile, mobileView],
  );

  useEffect(() => {
    if (!isMobile) {
      hasInitializedMobileViewRef.current = false;
      setMobileView("content");
      return;
    }

    if (!hasInitializedMobileViewRef.current) {
      hasInitializedMobileViewRef.current = true;

      if (
        locationConversationId &&
        activeConversationId === locationConversationId
      ) {
        setMobileView("content");
        return;
      }

      setMobileView("list");
    }
  }, [isMobile, activeConversationId, locationConversationId]);

  useEffect(() => {
    if (!isMobile || mobileView !== "content") {
      return;
    }

    if (!activeConversation) {
      setMobileView("list");
    }
  }, [activeConversation, isMobile, mobileView]);

  useEffect(() => {
    if (
      isMobile &&
      locationConversationId &&
      activeConversationId === locationConversationId
    ) {
      setMobileView("content");
    }
  }, [activeConversationId, isMobile, locationConversationId]);

  const handleSelectConversation = (conversationId: number) => {
    selectConversation(conversationId);

    if (isMobile) {
      setMobileView("content");
    }
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  return (
    <div className="profile__chat">
      <section
        className={`chat-shell ${isMobile ? "is-mobile" : ""} ${
          shouldShowMobileContent ? "is-mobile-content" : "is-mobile-list"
        }`}
      >
        <div
          className={`chat-shell__header ${
            shouldShowMobileContent ? "is-hidden-on-mobile" : ""
          }`}
        >
          <Typography.Title level={2}>Doan chat</Typography.Title>
        </div>

        <div className="chat-shell__body">
          <aside className="chat-shell__sidebar">
            <ConversationList
              activeConversationId={activeConversationId}
              conversations={conversationViews}
              isLoading={isLoading}
              onSelectConversation={handleSelectConversation}
            />
          </aside>

          <section className="chat-shell__content">
            <ChatPanel
              data={activeConversation}
              currentUserId={currentUserId}
              onBack={handleBackToList}
              showBackButton={shouldShowMobileContent}
            />
          </section>
        </div>
      </section>
    </div>
  );
};
