import { useEffect, useRef, useState } from "react";

function ImageWithPlaceholder({ src, alt, size }) {
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    const imgEl = imgRef.current;
    if (!imgEl) return;

    if (imgEl.complete && imgEl.naturalHeight !== 0) {
      setLoading(false);
      return;
    }

    const handleLoad = () => setLoading(false);
    imgEl.addEventListener("load", handleLoad);

    return () => {
      imgEl.removeEventListener("load", handleLoad);
    };
  }, [src]);

  const sizeStyles = size
    ? { width: size, height: size }
    : { width: "100%", height: "100%" };

  return (
    <div
      style={sizeStyles}
      className="relative bg-zinc-700 rounded-md overflow-hidden"
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
      />
    </div>
  );
}

export default ImageWithPlaceholder;
