import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image'; // For optimized images
import Picker from 'emoji-picker-react'; // The emoji picker

// Update the type to include our new fields
type Message = {
  id: number;
  created_at: string;
  content: string | null; // Content can be null if it's an image message
  image_url: string | null; // The URL for the image
  sent_by_admin: boolean;
  is_deleted: boolean; // To check if a message is "soft deleted"
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- DATA FETCHING AND REALTIME ---
  useEffect(() => {
    const setupChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: initialMessages } = await supabase
          .from('messages').select('*').eq('user_id', session.user.id).order('created_at');
        setMessages(initialMessages || []);
      }
    };
    setupChat();
  }, []);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`chat:${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${user.id}`}, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(current => [...current, payload.new as Message]);
          }
          if (payload.eventType === 'UPDATE') {
            setMessages(current => current.map(msg => msg.id === payload.new.id ? (payload.new as Message) : msg));
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(scrollToBottom, [messages]);

  // --- NEW FEATURE FUNCTIONS ---
  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    setUploading(true);

    const { error: uploadError } = await supabase.storage.from('chat-images').upload(filePath, file);
    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('chat-images').getPublicUrl(filePath);
    if (data) {
      await supabase.from('messages').insert({
        user_id: user.id,
        image_url: data.publicUrl,
        sent_by_admin: false,
      });
    }
    setUploading(false);
  };

  const handleDeleteMessage = async (messageId: number) => {
    await supabase.from('messages').update({ is_deleted: true, content: 'Message deleted' }).eq('id', messageId);
  };

  // --- SEND MESSAGE ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    await supabase.from('messages').insert({
      user_id: user.id,
      content: newMessage,
      sent_by_admin: false
    });
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <>
      <div style={{ position: 'fixed', bottom: '100px', right: '20px', width: '350px', height: '500px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, opacity 0.3s', transform: isOpen ? 'translateY(0)' : 'translateY(20px)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', zIndex: 1000 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}><h3 style={{ margin: 0, color: 'white' }}>Chat with Support</h3></div>

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sent_by_admin ? 'flex-start' : 'flex-end', marginBottom: '0.5rem' }}>
              <div style={{
                backgroundColor: msg.sent_by_admin ? '#374151' : '#22d3ee',
                color: msg.sent_by_admin ? 'white' : 'black',
                padding: msg.image_url ? '0.25rem' : '0.5rem 1rem',
                borderRadius: '12px',
                maxWidth: '80%',
              }}>
                {msg.is_deleted ? (
                  <em style={{fontSize: '0.9rem', opacity: 0.7}}>Message deleted</em>
                ) : msg.image_url ? (
                  <Image src={msg.image_url} alt="Chat image" width={200} height={200} style={{borderRadius: '10px', objectFit: 'cover'}} />
                ) : (
                  msg.content
                )}
              </div>
              {/* Delete Button for user's own, non-deleted messages */}
              {!msg.sent_by_admin && !msg.is_deleted && (
                <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem'}}>X</button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showPicker && <Picker onEmojiClick={onEmojiClick} />}

        <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #334155', gap: '0.5rem' }}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ padding: '0.5rem', border: 'none', borderRadius: '8px', background: 'none', color: 'white', cursor: 'pointer' }}>📎</button>
          <button type="button" onClick={() => setShowPicker(val => !val)} style={{ padding: '0.5rem', border: 'none', borderRadius: '8px', background: 'none', color: 'white', cursor: 'pointer' }}>😊</button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={uploading ? "Uploading..." : "Type a message..."} disabled={uploading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', backgroundColor: '#374151', color: 'white' }} />
          <button type="submit" disabled={uploading} style={{ padding: '0.75rem 1rem', border: 'none', borderRadius: '8px', backgroundColor: '#22d3ee', color: '#111827', cursor: 'pointer' }}>Send</button>
        </form>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#22d3ee', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </>
  );
}