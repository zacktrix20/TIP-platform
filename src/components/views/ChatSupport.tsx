import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Bot, User, MessageSquare, Shield, Activity, Zap, ChevronLeft } from 'lucide-react';
import { sendMessageStream, ChatMessage } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ChatSupportProps {
  onBack?: () => void;
}

export function ChatSupport({ onBack }: ChatSupportProps) {
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
      // Use the actual previous messages for history to match the documented pattern
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
    <div className="h-full w-full flex flex-col bg-bg overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      
      {/* Header Info */}
      <div className="p-8 border-b border-border bg-card/50 backdrop-blur-md z-10 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-accent hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase hidden sm:inline">Back</span>
              </button>
            )}

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                  AI_SUPPORT_HUB // ACTIVE
                </h2>
                <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 mt-1">
                  <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> Neural_Link: Stable</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-accent" /> Privacy: Encrypted</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-1 bg-accent/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Message Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-8"
      >
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center opacity-30 px-8"
            >
              <Terminal className="w-16 h-16 mb-6 text-accent" />
              <h3 className="text-lg font-bold uppercase tracking-[0.4em] mb-2">Initialize_Direct_Link</h3>
              <p className="text-xs font-mono max-w-xs leading-relaxed">
                Awaiting mission-critical queries. TIP_AI is standing by to assist with intel analysis, system diagnostics, or tactical advisory.
              </p>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col gap-3 max-w-[85%]",
                m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 opacity-40">
                {m.role === 'user' ? (
                  <>
                    <span className="text-[10px] font-mono uppercase">Operator</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-mono uppercase text-accent font-bold">TIP_AI</span>
                  </>
                )}
              </div>
              <div className={cn(
                "p-6 text-[11px] font-mono leading-relaxed prose prose-invert prose-sm max-w-none shadow-xl",
                m.role === 'user' 
                  ? "bg-accent/10 border border-accent/20 text-text-primary rounded-l-2xl rounded-tr-2xl" 
                  : "bg-white/[0.03] border border-border text-text-secondary rounded-r-2xl rounded-tl-2xl"
              )}>
                <ReactMarkdown>{m.parts[0].text || "..."}</ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-accent p-2 ml-4">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest animate-pulse">Processing_Query...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-border bg-card/80 backdrop-blur-xl shrink-0 z-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-accent/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-lg" />
            <div className="relative flex items-center bg-black/40 border border-border focus-within:border-accent transition-all overflow-hidden rounded-sm">
              <input 
                type="text"
                placeholder="Query TIP AI Intelligence Sublayer..."
                className="flex-1 bg-transparent py-4 px-6 text-sm font-mono text-white focus:outline-none placeholder:text-white/10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 flex items-center justify-center bg-accent text-bg hover:bg-white hover:text-bg disabled:opacity-20 transition-all shrink-0 border-l border-border"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 px-1">
            <p className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em]">
              Encryption_Active // Signal_Stability: 100%
            </p>
            <p className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em]">
              TIP_AI v2.5.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
