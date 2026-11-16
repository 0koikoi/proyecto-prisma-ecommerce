import { useState } from 'react';
import { Package } from 'lucide-react';

export function ProductImage({ src, alt, className = '', loading = 'lazy' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  return (
    <div className={`bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}>
      {src && failedSrc !== src ? <img src={src} alt={alt} loading={loading} onError={() => setFailedSrc(src)} className="w-full h-full object-cover" />
        : <Package className="w-10 h-10 text-gray-400" role="img" aria-label={`Sin imagen: ${alt}`} />}
    </div>
  );
}
