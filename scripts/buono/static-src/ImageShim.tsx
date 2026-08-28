import type { ImgHTMLAttributes } from 'react';

type ImageShimProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  unoptimized?: boolean;
  priority?: boolean;
  fill?: boolean;
};

export default function ImageShim({ unoptimized: _unoptimized, priority: _priority, fill: _fill, alt, ...props }: ImageShimProps) {
  return <img alt={alt ?? ''} {...props} />;
}
