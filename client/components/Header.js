import Link from 'next/link';
import { useMemo } from 'react';

const Header = ({ currentUser }) => {
  const links = useMemo(() => [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/create' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ], [currentUser])
    .filter(Boolean);

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">TixMaster</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map(({ label, href }) => (
            <li key={href} className="nav-item">
              <Link href={href}>
                <a className="nav-link">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
