import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  customLogo?: string;
  customTitle?: string;
  customSubtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
}

export default function Navbar({
  customLogo = '/logo.png',
  customTitle = 'PAUtopía',
  customSubtitle = 'Tu espacio de estudio perfecto',
  showBackButton = false,
  backRoute = '/'
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/lecturas', label: 'Lecturas' },
    { path: '/apuntes', label: 'Apuntes' },
    { path: '/frases', label: 'Frases' },
    { path: '/apps', label: 'Apps' },
    { path: '/examinate', label: 'Examínate' },
    { path: '/ranking', label: 'Ranking' },
    { path: '/creditos', label: 'Créditos' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header Móvil */}
      <header className="mobile-header">
        <div className="mobile-header-top">
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" />
              )}
            </svg>
          </button>
          <div className="mobile-logo">
            <img src={customLogo} alt={customTitle} className="logo-image" />
            <span className="app-title">{customTitle}</span>
          </div>
          <div className="mobile-nav">
            <button 
              className="nav-button" 
              onClick={() => navigate(showBackButton ? backRoute : '/')}
            >
              {showBackButton ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú Lateral Móvil */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h2>Navegación</h2>
              <button
                className="close-menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <nav className="mobile-nav-menu">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Header Desktop */}
      <header className="desktop-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <img src={customLogo} alt={`${customTitle} Logo`} className="logo-image" />
              </div>
              <div>
                <h1 className="app-title">{customTitle}</h1>
                <p className="app-subtitle">{customSubtitle}</p>
              </div>
            </div>
            <nav className="nav-buttons">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`nav-button ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}