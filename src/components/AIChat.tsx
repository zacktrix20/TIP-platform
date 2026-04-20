import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Bot, User, X, Minimize2, Maximize2, MessageSquare, ChevronLeft } from 'lucide-react';
import { sendMessageStream, ChatMessage } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newHistory: ChatMessage[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    let aiResponse = '';
    const updatedMessages: ChatMessage[] = [...newHistory, { role: 'model', parts: [{ text: '' }] }];
    setMessages(updatedMessages);

    try {
      const stream = sendMessageStream(messages, userMessage);
      for await (const chunk of stream) {
        aiResponse += chunk.text;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'model') {
            return [...prev.slice(0, -1), { role: 'model', parts: [{ text: aiResponse }] }];
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-accent text-bg shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[60]",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-card border border-border flex flex-col shadow-2xl z-[70] overflow-hidden"
          >
            <div className="tech-grid-header flex justify-between items-center bg-black/60">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-accent hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Back</span>
                </button>
                <div className="h-3 w-px bg-border/40 mx-1" />
                <Bot className="w-3 h-3 text-accent" />
                <span>TIP_AI // Analyst_Lab</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-accent transition-colors p-1"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-bg/50"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8">
                  <Terminal className="w-8 h-8 mb-4" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em]">
                    Standby for input...<br/>
                    AI_SUBSYSTEM_READY
                  </p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {m.role === 'user' ? (
                       <span className="text-[9px] font-mono text-text-secondary opacity-40 uppercase">Operator</span>
                    ) : (
                       <span className="text-[9px] font-mono text-accent uppercase font-bold tracking-widest">TIP_AI</span>
                    )}
                  </div>
                  <div className={cn(
                    "p-3 text-xs font-mono leading-relaxed prose prose-invert prose-xs max-w-none",
                    m.role === 'user' ? "bg-accent/10 border border-accent/20 text-text-primary" : "bg-white/[0.03] border border-border text-text-secondary"
                  )}>
                    <ReactMarkdown>{m.parts[0].text || "..."}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-accent p-1">
                  <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-black/20">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Query Subsystem..."
                  className="w-full bg-bg border border-border py-2 px-4 pr-10 text-[11px] font-mono focus:outline-none focus:border-accent transition-all placeholder:opacity-20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent disabled:opacity-20 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
