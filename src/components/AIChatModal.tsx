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
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';

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
      <div className="relative w-full max-w-2xl h-[620px] max-h-[92vh] flex flex-col rounded-3xl bg-[#12042b] border border-cyan-400/40 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-indigo-950 to-cyan-950 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#14062f] rounded-[14px] flex items-center justify-center text-cyan-300">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Nana's AI Care Concierge
                </h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-cyan-300">
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
              className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-slate-400 hover:text-white border border-purple-500/30 transition-all"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-slate-300 hover:text-white border border-purple-500/30 transition-all"
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
                  <div className="w-8 h-8 rounded-full bg-purple-900 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-purple-950/70 border border-purple-500/30 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}

                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? 'text-slate-800 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-cyan-300 text-xs text-left">
              <div className="w-8 h-8 rounded-full bg-purple-900 border border-cyan-400/40 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <span className="italic">Nana Concierge is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-purple-500/20 bg-[#0e0224] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-purple-950 hover:bg-purple-900 text-cyan-300 border border-purple-500/30 transition-all hover:scale-105"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-purple-500/30 bg-[#0f0326] space-y-2">
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all"
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
              className="text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <Calendar className="w-3 h-3" />
              <span>Open Online Booking</span>
            </button>
            <a
              href="tel:3054096788"
              className="text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Call: 305-409-6788</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
