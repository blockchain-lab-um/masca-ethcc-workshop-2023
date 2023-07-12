import Link from 'next/link';
import SocialsLink from '../SocialsLink';

const Footer = () => {
  return (
    <div className="flex h-20 bg-masca-100 p-4">
      <div className="flex-1 self-center align-middle">
        <p className="">Blockchain Lab:UM</p>
        <Link
          className="hover:underline active:opacity-50"
          href="mailto:blockchain-lab@um.si"
        >
          <p className="text-slate-400">blockchain-lab@um.si</p>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center self-center">
        <Link
          className="hover:opacity-80 active:opacity-50"
          href="https://docs.masca.io/"
          target="_blank"
        >
          <p className="text-lg font-bold text-slate-400 hover:underline">
            Integrate now
          </p>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end">
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
