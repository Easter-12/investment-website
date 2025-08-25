import { useState, useEffect } from 'react';
// We need to import the Supabase client here too
import { supabase } from '../lib/supabaseClient';

export default function Footer() {
  // State to hold our settings data
  const [address, setAddress] = useState('Loading address...');
  const [phone, setPhone] = useState('Loading phone...');

  // This will run when the footer first appears on the screen
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch the single row of data from our settings table
        const { data, error } = await supabase
          .from('settings')
          .select('company_address, company_phone')
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setAddress(data.company_address);
          setPhone(data.company_phone);
        }
      } catch (error) {
        // If there's an error, show the original placeholder text
        setAddress('123 Innovation Drive, Tech City, 10101');
        setPhone('(555) 123-4567');
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSettings();
  }, []); // The empty array means this runs only once

  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#1a2233',
      color: '#a0aec0',
      borderTop: '1px solid #334155'
    }}>
      <p>QuantumLeap Investments</p>
      {/* Now, we display the data from our state variables */}
      <p>{address}</p>
      <p>{phone}</p>
    </footer>
  );
}