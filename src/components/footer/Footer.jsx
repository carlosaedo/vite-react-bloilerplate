import './Footer.css';
import { appVersion, appBuildVersion } from '../../appVersion';

const Footer = () => {
  return (
    <>
      <div>
        <p className='systemVersionInfo'>
          Torrestir Shipping Portal v{appVersion} build {appBuildVersion}
        </p>
      </div>
    </>
  );
};

export default Footer;
