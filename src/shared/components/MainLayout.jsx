import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-primary">
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => {}}
        onOpenCart={() => {}}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 w-full store-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
