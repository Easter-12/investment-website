import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import Picker from 'emoji-picker-react';
import supportAvatar from '../public/support-avatar.jpg';
// The broken import for 'logo.gif' has been completely removed.

type Message = { id: number; content: string | null; sent_by_admin: boolean; user_id: string; };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => { setShowWelcome(true); }, 3000);
    const hideTimer = setTimeout(() => { setShowWelcome(false); }, 10000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const setupChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUser(session.user);
      const fetchMessages = async () => {
        if (!session.user) return;
        const { data } = await supabase.from('messages').select('*').eq('user_id', session.user.id).order('created_at');
        setMessages(data || []);
      };
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    };
    setupChat();
    return () => { if (interval) clearInterval(interval); };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const onEmojiClick = (emojiObject: any) => { setNewMessage(prev => prev + emojiObject.emoji); setShowPicker(false); };
  const handleDeleteMessage = async (messageId: number) => {
    setMessages(currentMessages => currentMessages.filter(msg => msg.id !== messageId));
    await supabase.from('messages').delete().eq('id', messageId);
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (messageContent === '' || !user) return;
    const optimisticMessage = { id: Date.now(), content: messageContent, sent_by_admin: false, user_id: user.id, created_at: new Date().toISOString() };
    setMessages(currentMessages => [...currentMessages, optimisticMessage]);
    setNewMessage('');
    setShowPicker(false);
    await supabase.from('messages').insert({ user_id: user.id, content: messageContent, sent_by_admin: false });
  };

  if (!user) return null;

  return (
    <>
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header" style={{ borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: '#1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Image src={supportAvatar} alt="Support" width={40} height={40} style={{ borderRadius: '50%' }} />
            <div>
              <h3 style={{ margin: 0, color: 'white' }}>Support Team</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.8rem' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></div>Online
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        <div className="chat-messages-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.map(msg => (<div key={msg.id} className={`message-wrapper ${msg.sent_by_admin ? 'admin-message-wrapper' : 'user-message-wrapper'}`}><div className={`chat-bubble-content ${msg.sent_by_admin ? 'admin-bubble' : 'user-bubble'}`}>{msg.content}</div>{!msg.sent_by_admin && <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem'}}>×</button>}</div>))}
          <div ref={messagesEndRef} />
        </div>
        {showPicker && <div style={{position: 'absolute', bottom: '70px', right: '10px', zIndex: 1001}}><Picker onEmojiClick={onEmojiClick} /></div>}
        <form onSubmit={handleSendMessage} className="chat-form" style={{ borderTop: '1px solid #334155', flexShrink: 0, backgroundColor: '#1e293b' }}>
          <button type="button" onClick={() => setShowPicker(val => !val)} className="chat-button" style={{ background: 'none', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>😊</button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="chat-input" style={{ flex: 1, border: 'none', borderRadius: '8px', backgroundColor: '#374151', color: 'white' }} />
          <button type="submit" disabled={!newMessage.trim()} className="chat-send-button" style={{ border: 'none', borderRadius: '8px', backgroundColor: '#22d3ee', color: '#111827', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
        </form>
      </div>

      {showWelcome && !isOpen && (
        <div style={{ position: 'fixed', bottom: '100px', right: '20px', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, transition: 'opacity 0.5s' }}>
          We are online! How can we help?
        </div>
      )}

      {!isOpen && (
        // --- THIS IS THE CORRECTED PART ---
        // We are back to using the simple SVG icon
        <button onClick={() => setIsOpen(true)} className="chat-bubble" style={{backgroundColor: '#22d3ee'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </>
  );
}