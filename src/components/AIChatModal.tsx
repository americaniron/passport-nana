import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/index.ts';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  Calendar,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello and welcome to **Kweenz Dream💭**! I'm Nana's AI Care Concierge. Whether you need 24/7 emergency babysitting, flight accompaniment with our signature Passport Nanny service, school pickup, or a gentle wash & retwist for locs, I'm here to help. What questions can I answer for your family today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'How does Passport Nanny work for flights?',
    'What is your hourly babysitting rate?',
    'What is included in the Locs Wash & Retwist?',
    'Do you pick up kids from school?',
    'Book a free Meet-N-Greet',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userMessage: text.trim(),
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          data.text ||
          data.fallbackText ||
          "Ken'nyzhae is on-call 24/7! You can reach her directly at 305-409-6788 or schedule online right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm temporarily having a connection hiccup, but Ken'nyzhae is always available 24/7 on call! Please call or text (305) 409-6788 or click below to book.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-2xl h-[620px] max-h-[92vh] flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#041226] border-[#d4af37]/60 text-white'
            : 'bg-white border-[#d4af37]/50 text-[#04142b]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark
              ? 'bg-gradient-to-r from-[#020813] via-[#071c38] to-[#020813] border-[#d4af37]/30 text-white'
              : 'bg-gradient-to-r from-[#faf8f5] via-white to-[#faf8f5] border-[#d4af37]/30 text-[#04142b]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f3d078] to-[#c59b27] flex items-center justify-center p-0.5 shadow-md shadow-amber-500/20">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  isDark ? 'bg-[#041226]' : 'bg-white'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#dfb75c]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display">
                  Nana's AI Care Concierge
                </h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#dfb75c]">
                24/7 Assistance • Booking & Hair Consultation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'welcome',
                    role: 'assistant',
                    content:
                      "Conversation refreshed. How can Ken'nyzhae support your childcare or locs needs today?",
                    timestamp: 'Just now',
                  },
                ])
              }
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                  : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/35'
              }`}
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                  : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/35'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#061833] border border-[#d4af37]/40 flex items-center justify-center text-[#dfb75c] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] font-semibold rounded-tr-none'
                      : isDark
                      ? 'bg-[#061833] border border-[#d4af37]/30 text-slate-200 rounded-tl-none whitespace-pre-line'
                      : 'bg-[#faf8f5] border border-[#d4af37]/35 text-[#04142b] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}

                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? 'text-[#041226]/80 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#041226] shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-[#dfb75c] text-xs text-left">
              <div className="w-8 h-8 rounded-full bg-[#061833] border border-[#d4af37]/40 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-[#dfb75c]" />
              </div>
              <span className="italic">Nana Concierge is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div
          className={`px-4 py-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar ${
            isDark ? 'border-[#d4af37]/20 bg-[#030e22]' : 'border-[#d4af37]/25 bg-[#faf8f5]'
          }`}
        >
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all hover:scale-105 cursor-pointer ${
                isDark
                  ? 'bg-[#071c38] text-[#f3d078] border-[#d4af37]/30 hover:bg-[#0c2a52]'
                  : 'bg-white text-[#04142b] border-[#d4af37]/35 hover:bg-[#faf8f5]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className={`p-3 sm:p-4 border-t space-y-2 ${
            isDark ? 'border-[#d4af37]/30 bg-[#030d1e]' : 'border-[#d4af37]/30 bg-[#fbf9f5]'
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about babysitting, passport travel, or locs..."
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                isDark
                  ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                  : 'bg-white border-[#d4af37]/35 text-[#04142b]'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick links footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="text-[#dfb75c] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Calendar className="w-3 h-3" />
              <span>Open Online Booking</span>
            </button>
            <a
              href="tel:3054096788"
              className="opacity-90 hover:opacity-100 flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#dfb75c]" />
              <span>Call: 305-409-6788</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
