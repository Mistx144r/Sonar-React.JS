import { useEffect, useRef, useState } from "react";

function ImageWithPlaceholder({ src, alt, size }) {
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [src]);

  return (
    <div
      className={`relative ${
        size ? `size-${size}` : "size-full"
      } bg-zinc-700 rounded-md overflow-hidden`}
    >
      {loading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default ImageWithPlaceholder;
