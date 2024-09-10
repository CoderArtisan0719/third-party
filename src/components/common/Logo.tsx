type LogoProps = {
  xl?: boolean;
};

const Logo = (props: LogoProps) => {
  const size = props.xl ? '44' : '32';
  const fontStyle = props.xl
    ? 'font-semibold text-3xl'
    : 'font-semibold text-xl';

  return (
    <span className={`inline-flex items-center text-gray-900 ${fontStyle}`}>
      <img src="/logo.png" width={216} height={size} alt="logo" />
    </span>
  );
};

export default Logo;
