import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import Picker from 'emoji-picker-react';
import supportAvatar from '../public/support-avatar.jpg';

type Message = { id: number; content: string | null; sent_by_admin: boolean; user_id: string; };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  useEffect(() => {
    let channel: any;
    const setupChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUser(session.user);

      const { data: initialMessages } = await supabase.from('messages').select('*').eq('user_id', session.user.id).order('created_at');
      setMessages(initialMessages || []);

      channel = supabase.channel(`public:messages:user_id=eq.${session.user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${session.user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMessages(current => [...current, payload.new as Message]);
            }
            if (payload.eventType === 'DELETE') {
              setMessages(current => current.filter(msg => msg.id !== (payload.old as { id: number }).id));
            }
          }
        ).subscribe();
    };
    setupChat();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const onEmojiClick = (emojiObject: any) => { setNewMessage(prev => prev + emojiObject.emoji); setShowPicker(false); };

  const handleDeleteMessage = async (messageId: number) => { await supabase.from('messages').delete().eq('id', messageId); };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    await supabase.from('messages').insert({ user_id: user.id, content: newMessage, sent_by_admin: false });
    setNewMessage('');
    setShowPicker(false);
  };

  if (!user) return null;

  return (
    <>
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
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

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sent_by_admin ? 'flex-start' : 'flex-end', marginBottom: '0.5rem' }}>
              <div style={{ backgroundColor: msg.sent_by_admin ? '#374151' : '#22d3ee', color: msg.sent_by_admin ? 'white' : 'black', padding: '0.5rem 1rem', borderRadius: '12px', maxWidth: '80%' }}>
                {msg.content}
              </div>
              {!msg.sent_by_admin && <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem'}}>×</button>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* --- THIS IS THE FIXED LINE --- */}
        {showPicker && <div style={{position: 'absolute', bottom: '70px', right: '10px', zIndex: 1001}}><Picker onEmojiClick={onEmojiClick} /></div>}

        <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #334155', gap: '0.5rem', flexShrink: 0 }}>
          <button type="button" onClick={() => setShowPicker(val => !val)} style={{ padding: '0.5rem', border: 'none', borderRadius: '8px', background: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>😊</button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', backgroundColor: '#374151', color: 'white' }} />
          <button type="submit" disabled={!newMessage.trim()} style={{ padding: '0.75rem 1rem', border: 'none', borderRadius: '8px', backgroundColor: '#22d3ee', color: '#111827', cursor: 'pointer' }}>Send</button>
        </form>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="chat-bubble">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </>
  );
}