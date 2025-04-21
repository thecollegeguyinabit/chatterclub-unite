
import React from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/context/ClubifyContext";

// The grouping function for messages
function groupMessages(messages: Message[]) {
  const groups: Array<{ senderId: string; messages: Message[] }> = [];
  messages.forEach((message, index, array) => {
    const prevMessage = index > 0 ? array[index - 1] : null;
    const isSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const isCloseTime =
      prevMessage &&
      message.timestamp.getTime() - prevMessage.timestamp.getTime() <
        5 * 60 * 1000;
    if (isSameSender && isCloseTime) {
      groups[groups.length - 1].messages.push(message);
    } else {
      groups.push({
        senderId: message.senderId,
        messages: [message],
      });
    }
  });
  return groups;
}

type MessageListProps = {
  messages: Message[];
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const grouped = groupMessages(messages);
  return (
    <>
      {grouped.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="w-full">
          {group.messages.map((message, messageIndex) => (
            <ChatMessage
              key={message.id}
              message={message}
              showAvatar={messageIndex === 0}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default MessageList;
