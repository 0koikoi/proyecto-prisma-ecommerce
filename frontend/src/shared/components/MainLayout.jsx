import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { SearchPalette } from './SearchPalette';
import { CartDrawer } from '../../feature/cart/CartDrawer';
import { useCart } from '../../core/context/CartContext';

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-primary">
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={openCart}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <SearchPalette
        isOpen={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
      />
      <main className="flex-1 w-full store-container">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
