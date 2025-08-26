import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import Picker from 'emoji-picker-react';
import supportAvatar from '../public/support-avatar.jpg';
import Portal from './Portal';

type Message = { id: number; content: string | null; sent_by_admin: boolean; user_id: string; };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // This hook correctly checks for the user and listens for login/logout changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMessages(session.user.id);
      } else {
        setMessages([]); // Clear messages on logout
      }
    });
    // Also check for user on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMessages(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async (userId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('user_id', userId).order('created_at');
    setMessages(data || []);
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const onEmojiClick = (emojiObject: any) => { setNewMessage(prev => prev + emojiObject.emoji); setShowPicker(false); };

  const handleDeleteMessage = async (messageId: number) => {
    setMessages(current => current.filter(msg => msg.id !== messageId));
    await supabase.from('messages').delete().eq('id', messageId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (messageContent === '' || !user) return;
    const optimisticMessage = { id: Date.now(), content: messageContent, sent_by_admin: false, user_id: user.id, created_at: new Date().toISOString() };
    setMessages(current => [...current, optimisticMessage]);
    setNewMessage('');
    setShowPicker(false);
    await supabase.from('messages').insert({ user_id: user.id, content: messageContent, sent_by_admin: false });
  };

  return (
    <Portal>
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header-container">
          <div className="chat-header-profile">
            <Image src={supportAvatar} alt="Support" width={40} height={40} style={{ borderRadius: '50%' }} />
            <div>
              <h3 style={{ margin: 0, color: 'white' }}>Support Team</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.8rem' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></div>Online
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="chat-header-close-btn">×</button>
        </div>

        {/* --- THIS IS THE GUARANTEED FIX --- */}
        {/* The logic is now inside the main component, not separated */}
        <div className="chat-messages-area">
          {user ? (
            messages.map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.sent_by_admin ? 'admin-message-wrapper' : 'user-message-wrapper'}`}>
                <div className={`chat-bubble-content ${msg.sent_by_admin ? 'admin-bubble' : 'user-bubble'}`}>{msg.content}</div>
                {!msg.sent_by_admin && <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem'}}>×</button>}
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p>Please log in or sign up to start a conversation.</p>
              <a href="/login" className="pro-button" style={{marginTop: '1rem'}}>Login</a>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showPicker && <div style={{position: 'absolute', bottom: '70px', right: '10px', zIndex: 1001}}><Picker onEmojiClick={onEmojiClick} /></div>}

        {/* The form is now only visible if the user is logged in */}
        {user && (
          <form onSubmit={handleSendMessage} className="chat-form">
            <button type="button" onClick={() => setShowPicker(val => !val)} className="chat-button">😊</button>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="chat-input" />
            <button type="submit" disabled={!newMessage.trim()} className="chat-send-button">Send</button>
          </form>
        )}
      </div>

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-bubble">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      )}
    </Portal>
  );
}