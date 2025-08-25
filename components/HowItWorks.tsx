import Image from 'next/image';
import howItWorksFile from '../public/how-it-works.jpg';

export default function HowItWorks() {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '4rem 2rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '3rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <Image 
            src={howItWorksFile}
            alt="Our investment process"
            style={{
              width: '100%',
              height: 'auto', // Important for responsiveness
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
            placeholder="blur"
          />
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22d3ee', marginBottom: '1.5rem' }}>
            A Data-Driven Approach to Your Success
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
            At QuantumLeap, we don't rely on guesswork. Our methodology combines cutting-edge technology with the insights of seasoned financial experts to maximize your returns while managing risk.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            We utilize AI-powered market analysis, rigorous back-testing of strategies, and continuous portfolio monitoring to ensure your investments are always optimized for growth. Your financial future is secured by a process built on precision and expertise.
          </p>
        </div>
      </div>
    </div>
  );
}