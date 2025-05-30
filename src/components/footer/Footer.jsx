import './Footer.css';
import { appVersion, appBuildVersion } from '../../appVersion';

const Footer = () => {
  return (
    <>
      <div style={{ marginBottom: '80px' }}>
        <p className='systemVersionInfo'>
          Torrestir Shipping Portal v{appVersion} build {appBuildVersion}
        </p>
      </div>
    </>
  );
};

export default Footer;
