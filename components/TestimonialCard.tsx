// This component will display a single testimonial card.
// It receives data like name, country, comment, etc., as 'props'.
export default function TestimonialCard({ name, country, comment, imageUrl, flag }) {
  return (
    <div style={{
      backgroundColor: '#1e293b', // A dark slate color
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #334155',
      width: '100%',
      maxWidth: '350px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={imageUrl} alt={name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        <div>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{name}</p>
          <p style={{ color: '#94a3b8', margin: 0 }}>{country} {flag}</p>
        </div>
      </div>
      <div style={{ color: '#facc15' }}>
        ★★★★★
      </div>
      <p style={{ color: '#cbd5e1', margin: 0 }}>
        "{comment}"
      </p>
    </div>
  );
}