import Image from 'next/image';
import Link from 'next/link';

interface SocialsLinkProps {
  alt: string;
  src: string;
  href: string;
}

const SocialsLink = ({ alt, src, href }: SocialsLinkProps) => {
  return (
    <Link className='p-2' href={href} target='_blank'>
      <Image
        className="hover:opacity-80 active:opacity-50"
        alt={alt}
        src={src}
        width={30}
        height={30}
      ></Image>
    </Link>
  );
};

export default SocialsLink;
