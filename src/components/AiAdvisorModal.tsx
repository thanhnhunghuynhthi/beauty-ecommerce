'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles, Send, User, ShoppingBag, Check, Key, Cpu, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  products?: Product[];
  isGemini?: boolean;
  timestamp: string;
}

export default function AiAdvisorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Gemini AI của GlowBeauty.\n\nTôi sẵn sàng lắng nghe mọi thắc mắc của bạn về chăm sóc da, tư vấn mỹ phẩm hay mẹo trang điểm. Bạn muốn tư vấn vấn đề gì hôm nay?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGemini: true,
    },
  ]);

  useEffect(() => {
    const savedKey = localStorage.getItem('glowbeauty_gemini_key') || '';
    setGeminiApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('glowbeauty_gemini_key', key);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      // Build history for Gemini
      const historyPayload = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (geminiApiKey.trim()) {
        headers['x-gemini-api-key'] = geminiApiKey.trim();
      }

      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: query, history: historyPayload }),
      });

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Cảm ơn bạn đã đặt câu hỏi! Tôi có thể tư vấn thêm điều gì cho bạn?',
        products: data.recommendedProducts || [],
        isGemini: data.isGemini,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleAddToCartFromAi = (product: Product) => {
    if (!user) {
      alert('Vui lòng đăng nhập tài khoản khách hàng để thêm vào giỏ hàng!');
      return;
    }
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Cuộc trò chuyện đã được làm mới. Hãy nhập thắc mắc của bạn để Gemini AI tư vấn nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGemini: true,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] max-h-[720px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in overflow-hidden border border-purple-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-500 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Sparkles size={22} className="text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                Tư Vấn
                <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold border border-white/30 flex items-center gap-1">
                  <Cpu size={12} /> Gemini AI
                </span>
              </h2>
              <p className="text-[11px] text-purple-100">Hỏi đáp & Trò chuyện trực tiếp cùng Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition flex items-center gap-1 text-xs font-semibold"
              title="Làm mới cuộc trò chuyện"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition flex items-center gap-1 text-xs font-semibold"
              title="Cấu hình Gemini API Key"
            >
              <Key size={16} />
              <span className="hidden sm:inline">API Key</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Input Drawer */}
        {showKeyInput && (
          <div className="px-6 py-3 bg-purple-50 border-b border-purple-100 flex flex-col sm:flex-row gap-2 items-center text-xs animate-in slide-in-from-top duration-200">
            <span className="font-bold text-purple-900 flex items-center gap-1 whitespace-nowrap">
              <Key size={14} className="text-purple-600" /> Gemini API Key:
            </span>
            <input
              type="password"
              placeholder="Dán Gemini API Key của bạn từ Google AI Studio..."
              value={geminiApiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 w-full font-mono"
            />
            {geminiApiKey && (
              <button
                onClick={() => saveApiKey('')}
                className="text-rose-600 font-bold hover:underline whitespace-nowrap px-2"
              >
                Xóa Key
              </button>
            )}
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-rose-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] space-y-3 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-purple-100 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                      <Sparkles size={12} className="text-amber-500" />
                      Gemini AI
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-rose-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Recommended Products Cards inside AI message */}
                {msg.products && msg.products.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-extrabold text-purple-900 flex items-center gap-1">
                      <Sparkles size={13} className="text-amber-500" /> Mỹ phẩm gợi ý từ kho hàng:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.products.map((p) => {
                        const imgs = parseImages(p.images);
                        return (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs flex gap-2 items-center hover:border-purple-300 transition"
                          >
                            <img
                              src={imgs[0]}
                              alt=""
                              className="w-12 h-12 object-cover rounded-lg bg-rose-50 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[11px] font-bold text-gray-800 line-clamp-1">
                                {p.name}
                              </h5>
                              <div className="text-[10px] text-rose-600 font-bold">
                                {formatVND(p.price)}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToCartFromAi(p)}
                              className={`p-2 rounded-lg transition text-xs flex-shrink-0 cursor-pointer ${
                                addedProductId === p.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white'
                              }`}
                              title="Thêm vào giỏ"
                            >
                              {addedProductId === p.id ? <Check size={14} /> : <ShoppingBag size={14} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center text-xs">
                <Bot size={16} className="animate-bounce text-amber-300" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-purple-100 text-xs text-purple-700 italic font-semibold animate-pulse flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 animate-spin" />
                Gemini AI đang trả lời...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex overflow-x-auto gap-2 text-[11px] flex-shrink-0">
          <span className="text-gray-400 font-bold self-center flex-shrink-0">Gợi ý:</span>
          {[
            'Tư vấn chu trình dưỡng da ban đêm',
            'Da dầu nên chọn loại kem chống nắng nào?',
            'Thành phần Niacinamide có công dụng gì?',
            'Cách phân biệt da nhạy cảm và da khô',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full font-semibold whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-gray-200 flex gap-2 flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Hỏi Gemini AI bất kỳ điều gì..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
