import Image from 'next/image';
// For local images, we import them directly
import techImageFile from '../public/tech-image.jpg';

export default function TechImage() {
  return (
    <div style={{ padding: '4rem 2rem 0 2rem', textAlign: 'center' }}>
      <Image 
        src={techImageFile} // Use the imported image file
        alt="Trading Technology" 
        style={{
          maxWidth: '100%',
          height: 'auto', // Important for responsiveness
          width: '900px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        }}
        placeholder="blur" // Optional: shows a blurry version while loading
      />
    </div>
  );
}