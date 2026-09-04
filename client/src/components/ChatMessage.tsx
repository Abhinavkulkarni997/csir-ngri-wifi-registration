import type { ChatMessage as ChatMessageType } from '../chatbot/questionTypes';
import { Bot, User, Pencil } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit?: (messageId: string) => void;
}

export default function ChatMessage({
  message,
  onEdit,
}: ChatMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <div
      className={`flex w-full mb-4 ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`flex items-end gap-2 max-w-[90%] sm:max-w-[75%] ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        }`}
      >

        {/* AVATAR */}
        <div
          className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
            isBot
              ? 'bg-slate-900 text-white'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isBot ? <Bot size={19} /> : <User size={19} />}
        </div>

        {/* MESSAGE + EDIT */}
        <div
          className={`flex items-center gap-2 ${
            isBot ? 'flex-row' : 'flex-row-reverse'
          }`}
        >

          {/* MESSAGE BUBBLE */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
              isBot
                ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                : 'bg-indigo-600 text-white rounded-br-md'
            }`}
          >
            {message.content}
          </div>

          {/* EDIT BUTTON OUTSIDE BUBBLE */}
          {!isBot && message.questionId && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(message.questionId!)}
              className="
                flex
                items-center
                gap-1
                shrink-0
                text-xs
                font-medium
                text-slate-500
                hover:text-indigo-600
                transition
              "
            >
              <Pencil size={14} />
              <span>Edit</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}