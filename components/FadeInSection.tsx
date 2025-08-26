import { useInView } from 'react-intersection-observer';

export default function FadeInSection(props) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  return (
    <div
      ref={ref}
      style={{
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(50px)',
      }}
    >
      {props.children}
    </div>
  );
}