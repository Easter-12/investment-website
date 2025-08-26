import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import Picker from 'emoji-picker-react';
import supportAvatar from '../public/support-avatar.jpg';
import Portal from './Portal';
import Link from 'next/link'; // Import the Link component

type Message = { id: number; content: string | null; sent_by_admin: boolean; user_id: string; };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const fetchMessages = async () => {
          if (!session.user) return;
          const { data } = await supabase.from('messages').select('*').eq('user_id', session.user.id).order('created_at');
          setMessages(data || []);
        };
        fetchMessages();
        interval = setInterval(fetchMessages, 3000);
      } else { if (interval) clearInterval(interval); }
    });
    return () => { subscription.unsubscribe(); if (interval) clearInterval(interval); };
  }, []);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const onEmojiClick = (emojiObject: any) => { setNewMessage(prev => prev + emojiObject.emoji); setShowPicker(false); };
  const handleDeleteMessage = async (messageId: number) => { setMessages(current => current.filter(msg => msg.id !== messageId)); await supabase.from('messages').delete().eq('id', messageId); };
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

  const loggedOutView = (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p>Please log in or sign up to start a conversation.</p>
      {/* --- THIS IS THE CORRECTED LINK --- */}
      <Link href="/login" className="pro-button" style={{marginTop: '1rem'}}>
        Login
      </Link>
    </div>
  );

  const loggedInView = ( <> <div className="chat-messages-area"> {messages.map(msg => ( <div key={msg.id} className={`message-wrapper ${msg.sent_by_admin ? 'admin-message-wrapper' : 'user-message-wrapper'}`}><div className={`chat-bubble-content ${msg.sent_by_admin ? 'admin-bubble' : 'user-bubble'}`}>{msg.content}</div>{!msg.sent_by_admin && <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem'}}>×</button>}</div> ))} <div ref={messagesEndRef} /> </div> {showPicker && <div style={{position: 'absolute', bottom: '70px', right: '10px', zIndex: 1001}}><Picker onEmojiClick={onEmojiClick} /></div>} <form onSubmit={handleSendMessage} className="chat-form"> <button type="button" onClick={() => setShowPicker(val => !val)} className="chat-button">😊</button> <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="chat-input" /> <button type="submit" disabled={!newMessage.trim()} className="chat-send-button">Send</button> </form> </> );

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
        {user ? loggedInView : loggedOutView}
      </div>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-bubble" style={{backgroundColor: '#22d3ee'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      )}
    </Portal>
  );
}