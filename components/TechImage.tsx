export default function TechImage() {
  return (
    <div style={{ padding: '4rem 2rem 0 2rem', textAlign: 'center' }}>
      <img 
        src="/tech-image.jpg" 
        alt="Trading Technology" 
        style={{
          maxWidth: '100%',
          width: '900px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  );
}