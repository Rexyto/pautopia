import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  customLogo?: string;
  customTitle?: string;
  customSubtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
  className?: string;
}

export default function Layout({
  children,
  customLogo,
  customTitle,
  customSubtitle,
  showBackButton,
  backRoute,
  className = ''
}: LayoutProps) {
  return (
    <div className={`biblioteca-page ${className}`}>
      <div className="hero-background"></div>
      <Navbar
        customLogo={customLogo}
        customTitle={customTitle}
        customSubtitle={customSubtitle}
        showBackButton={showBackButton}
        backRoute={backRoute}
      />
      {children}
    </div>
  );
}