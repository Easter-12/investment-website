export default function HowItWorks() {
  return (
    // This is the main container for the whole section
    <div style={{ backgroundColor: '#1e293b', padding: '4rem 2rem' }}>

      {/* This container centers the content and arranges the image and text side-by-side */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        {/* === Image Column === */}
        {/* This div holds the image */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img 
            src="/how-it-works.jpg" // This is the path to the image in your 'public' folder
            alt="Our investment process"
            style={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>

        {/* === Text Description Column === */}
        {/* This div holds all the text */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#22d3ee',
            marginBottom: '1.5rem'
          }}>
            A Data-Driven Approach to Your Success
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            At QuantumLeap, we don't rely on guesswork. Our methodology combines cutting-edge technology with the insights of seasoned financial experts to maximize your returns while managing risk.
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            lineHeight: '1.6'
          }}>
            We utilize AI-powered market analysis, rigorous back-testing of strategies, and continuous portfolio monitoring to ensure your investments are always optimized for growth. Your financial future is secured by a process built on precision and expertise.
          </p>
        </div>

      </div>
    </div>
  );
}