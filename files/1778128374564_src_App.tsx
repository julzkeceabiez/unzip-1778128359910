import { useState, useEffect } from 'react';
import { StoreConfig, PanelPrice, PanelRole, BotRentalPackage } from './types/store';
import { INITIAL_STORE_CONFIG, DEFAULT_PANEL_PRICES, DEFAULT_PANEL_ROLES, DEFAULT_BOT_RENTAL_PACKAGES } from './constants/defaultStore';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { PanelSection } from './components/PanelSection';
import { SewaBotSection } from './components/SewaBotSection';
import { InfoBotSection } from './components/InfoBotSection';
import { AIChat } from './components/AIChat';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { Footer } from './components/Footer';

export default function App() {
  // Load configuration from local storage or defaults
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const stored = localStorage.getItem('NJ_STORE_CONFIG');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return INITIAL_STORE_CONFIG;
  });

  const [panelPrices, setPanelPrices] = useState<PanelPrice[]>(() => {
    try {
      const stored = localStorage.getItem('NJ_STORE_PANEL_PRICES');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_PANEL_PRICES;
  });

  const [panelRoles, setPanelRoles] = useState<PanelRole[]>(() => {
    try {
      const stored = localStorage.getItem('NJ_STORE_PANEL_ROLES');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_PANEL_ROLES;
  });

  const [rentalPackages, setRentalPackages] = useState<BotRentalPackage[]>(() => {
    try {
      const stored = localStorage.getItem('NJ_STORE_BOT_PACKAGES');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_BOT_RENTAL_PACKAGES;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('NJ_STORE_CONFIG', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('NJ_STORE_PANEL_PRICES', JSON.stringify(panelPrices));
  }, [panelPrices]);

  useEffect(() => {
    localStorage.setItem('NJ_STORE_PANEL_ROLES', JSON.stringify(panelRoles));
  }, [panelRoles]);

  useEffect(() => {
    localStorage.setItem('NJ_STORE_BOT_PACKAGES', JSON.stringify(rentalPackages));
  }, [rentalPackages]);

  // Handler to clear session/logout admin
  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} config={config} />

      {/* Main Contents Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 animate-fade-in select-none">
        {activeTab === 'home' && <Home config={config} setActiveTab={setActiveTab} />}

        {activeTab === 'panel' && (
          <PanelSection config={config} panelPrices={panelPrices} panelRoles={panelRoles} />
        )}

        {activeTab === 'sewa-bot' && (
          <SewaBotSection config={config} rentalPackages={rentalPackages} />
        )}

        {activeTab === 'ai-chat' && (
          <AIChat config={config} />
        )}

        {activeTab === 'info-bot' && <InfoBotSection config={config} />}

        {activeTab === 'admin' && (
          <div>
            {!isAdminLoggedIn ? (
              <AdminLogin config={config} onLoginSuccess={() => setIsAdminLoggedIn(true)} />
            ) : (
              <AdminPanel
                config={config}
                panelPrices={panelPrices}
                panelRoles={panelRoles}
                rentalPackages={rentalPackages}
                setConfig={setConfig}
                setPanelPrices={setPanelPrices}
                setPanelRoles={setPanelRoles}
                setRentalPackages={setRentalPackages}
                onLogout={handleLogoutAdmin}
              />
            )}
          </div>
        )}
      </main>

      {/* Modern Signature Footer */}
      <Footer config={config} />
    </div>
  );
}
