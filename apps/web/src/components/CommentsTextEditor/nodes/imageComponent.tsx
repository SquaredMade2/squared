import Image from 'next/image';
import type React from 'react';

interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt }) => {
  return <Image src={src} alt={alt} style={{ maxWidth: '100%' }} />;
};

export default ImageComponent;
