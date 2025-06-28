import { useMessageStore } from '../../../stores/messageStore';
import { MessageToast } from '../MessageToast/MessageToast';

export const MessageContainer = () => {
  const { messages, removeMessage } = useMessageStore();

  return (
    <>
      {messages.map((msg, index) => (
        <MessageToast
          key={msg.id}
          message={msg.message}
          type={msg.type}
          isVisible={true}
          onClose={() => removeMessage(msg.id)}
          duration={msg.duration}
          style={{ top: `${20 + (index * 80)}px` }}
        />
      ))}
    </>
  );
}; 