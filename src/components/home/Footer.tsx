import Logo from '@/components/common/Logo';

import { Button } from '../ui/button';

const Footer = () => (
  <div className="grid gap-4 border-t-2 border-primary-azureBlue bg-blue-100 py-8 text-primary-azureBlue">
    <div className="flex justify-center">
      <Logo xl />
    </div>

    <div className="flex justify-center gap-8">
      <Button variant="link" className="text-xl">
        Privacy Policy
      </Button>

      <Button variant="link" className="text-xl">
        Terms and Conditions
      </Button>

      <Button variant="link" className="text-xl">
        Contact Support
      </Button>
    </div>
  </div>
);

export default Footer;
