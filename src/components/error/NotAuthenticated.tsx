import Link from 'next/link';

const NotAuthenticated = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Not Authenticated</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back to the homepage</Link>
    </div>
  );
};

export default NotAuthenticated;
