// components/pfpcard.jsx
export default function PFPCard({ src, alt }) {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-300 to-cyan-300 shadow-lg">
      <img
        src={src}
        alt={alt}
        className="w-5/6 h-5/6 object-contain rounded-full"
      />
    </div>
  );
}