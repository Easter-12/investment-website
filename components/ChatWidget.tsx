import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import Picker from 'emoji-picker-react';

type Message = {
  id: number;
  created_at: string;
  content: string | null;
  image_url: string | null;
  sent_by_admin: boolean;
  is_deleted: boolean;
  user_id: string;
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

  // --- THIS IS THE NEW, CORRECT REALTIME LOGIC ---
  useEffect(() => {
    // 1. Get the current user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // 2. Fetch the initial messages for this user
        const { data: initialMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });
        setMessages(initialMessages || []);
      }
    };
    getCurrentUser();

    // 3. Set up the Realtime subscription
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          // Check if the new message belongs to the current user's conversation
          if ((payload.new as Message).user_id === user?.id) {
            // Use a function to safely update state based on the previous state
            setMessages((prevMessages) => {
              // Check if the message is already in the list to avoid duplicates
              if (prevMessages.find(msg => msg.id === (payload.new as Message).id)) {
                // If it exists, update it (for deletions)
                return prevMessages.map(msg => msg.id === (payload.new as Message).id ? (payload.new as Message) : msg);
              }
              // If it's a new message, add it to the end
              return [...prevMessages, payload.new as Message];
            });
          }
        }
      )
      .subscribe();

    // 4. Cleanup function to remove the subscription when the component is no longer on screen
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]); // Rerun this effect only if the user ID changes

  useEffect(scrollToBottom, [messages]);

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
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('chat-images').getPublicUrl(filePath);
    if (data?.publicUrl) {
      await supabase.from('messages').insert({ user_id: user.id, image_url: data.publicUrl, sent_by_admin: false });
    }
    setUploading(false);
  };

  const handleDeleteMessage = async (messageId: number) => {
    await supabase.from('messages').update({ is_deleted: true, content: 'Message deleted' }).eq('id', messageId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    // We don't need to manually add the message here, the realtime subscription will do it for us.
    await supabase.from('messages').insert({ user_id: user.id, content: newMessage, sent_by_admin: false });
    setNewMessage('');
  };

  if (!user) return null;

  // The rest of the component (the JSX) is mostly the same
  return (
    <>
      <div style={{ position: 'fixed', bottom: '100px', right: '20px', width: '350px', height: '500px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, opacity 0.3s', transform: isOpen ? 'translateY(0)' : 'translateY(20px)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', zIndex: 1000 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}><h3 style={{ margin: 0, color: 'white' }}>Chat with Support</h3></div>
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sent_by_admin ? 'flex-start' : 'flex-end', marginBottom: '0.5rem', flexShrink: 0 }}>
              <div style={{ backgroundColor: msg.sent_by_admin ? '#374151' : '#22d3ee', color: msg.sent_by_admin ? 'white' : 'black', padding: msg.image_url ? '0.25rem' : '0.5rem 1rem', borderRadius: '12px', maxWidth: '80%' }}>
                {msg.is_deleted ? <em style={{fontSize: '0.9rem', opacity: 0.7}}>Message deleted</em> : msg.image_url ? <Image src={msg.image_url} alt="Chat image" width={200} height={200} style={{borderRadius: '10px', objectFit: 'cover'}} /> : msg.content}
              </div>
              {!msg.sent_by_admin && !msg.is_deleted && <button onClick={() => handleDeleteMessage(msg.id)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '1.2rem', padding: '0 5px'}}>×</button>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {showPicker && <div style={{position: 'absolute', bottom: '60px', right: '20px', zIndex: 1001}}><Picker onEmojiClick={onEmojiClick} /></div>}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #334155', gap: '0.5rem' }}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ padding: '0.5rem', border: 'none', borderRadius: '8px', background: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>📎</button>
          <button type="button" onClick={() => setShowPicker(val => !val)} style={{ padding: '0.5rem', border: 'none', borderRadius: '8px', background: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>😊</button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={uploading ? "Uploading..." : "Type a message..."} disabled={uploading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', backgroundColor: '#374151', color: 'white' }} />
          <button type="submit" disabled={!newMessage.trim() || uploading} style={{ padding: '0.75rem 1rem', border: 'none', borderRadius: '8px', backgroundColor: '#22d3ee', color: '#111827', cursor: 'pointer' }}>Send</button>
        </form>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#22d3ee', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </>
  );
}