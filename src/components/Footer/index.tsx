import Link from 'next/link';
import Image from 'next/image';
import SocialsLink from '../SocialsLink';

const Footer = () => {
  return (
    <div className="flex h-16 justify-between bg-masca-100 p-4">
      <div className="self-center align-middle">
        <p className="">Blockchain Lab:UM</p>
        <Link href="mailto:blockchain-lab@um.si">
          <p className="text-slate-400">blockchain-lab@um.si</p>
        </Link>
      </div>
      <div className="flex items-center">
        <SocialsLink
          alt="Discord Logo"
          src="images/discord.svg"
          href="https://discord.gg/M5xgNz7TTF"
        />
        <SocialsLink
          alt="GitHub Logo"
          src="images/github.svg"
          href="https://github.com/blockchain-lab-um"
        />
        <SocialsLink
          alt="Twitter Logo"
          src="images/twitter.svg"
          href="https://twitter.com/@blockchainlabum"
        />
        <SocialsLink
          alt="Medium Logo"
          src="images/medium.svg"
          href="https://medium.com/@blockchainlabum"
        />
      </div>
    </div>
  );
};
export default Footer;
