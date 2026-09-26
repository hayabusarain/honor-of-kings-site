import NextImage, { type ImageProps } from 'next/image';
import { withBasePath } from '@/lib/basePath';

/**
 * next/image の薄い包み。src が文字列のルート相対パス（/images/…）なら前置き（統合後は /hok）を付ける。
 *
 * next/image は basePath を src に付けない。サイト統合で前置きが付くと、データの "/images/…"（274件）が
 * そのままではポータルの領域を指して全部 404 になる。データと呼び出しを直す代わりに、読み込み元をここに一本化した。
 * next/image を直接 import しない。audit の検査が止める（MLBB の試作と同じ形）。
 *
 * 読み込み失敗時に e.target.src へ代わりの画像を入れる所は、この包みを通らないので withBasePath を自分で通す。
 */
export default function Image({ src, alt, ...rest }: ImageProps) {
  return <NextImage {...rest} alt={alt} src={typeof src === 'string' ? withBasePath(src) : src} />;
}
