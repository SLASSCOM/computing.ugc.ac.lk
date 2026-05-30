import React, { useEffect, useState } from 'react';

interface UniversityLogoProps {
  universityHei: string;
  image?: string | null;
  className?: string;
  textClassName?: string;
}

const UniversityLogo: React.FC<UniversityLogoProps> = ({
  universityHei,
  image,
  className = 'w-16 h-16 rounded-full bg-gray-100',
  textClassName = 'text-xl font-bold text-gray-600',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const initial = universityHei.charAt(0).toUpperCase();
  const showFallback = !image || imageError;

  if (showFallback) {
    return (
      <div className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}>
        <span className={textClassName}>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex-shrink-0 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}images/${image}`}
        alt={`${universityHei} logo`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default UniversityLogo;
