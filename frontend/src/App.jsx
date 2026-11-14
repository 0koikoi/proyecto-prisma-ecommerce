import { CartProvider } from './core/context/CartContext';
import { ToastProvider } from './core/context/ToastContext';
import { AppRouter } from './core/routes/AppRouter';

export function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
