import { Link } from 'react-router-dom';
import { CreditCard, Instagram, MapPin, MessageCircle } from 'lucide-react';
import { STORE_CONTACT, STORE_LINES } from '../constants/storeLines';

export function Footer() {
  return (
    <footer className="bg-primary text-gray-300 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-secondary text-primary flex items-center justify-center font-extrabold text-sm">
                P
              </span>
              <span className="text-white font-extrabold tracking-tight text-base">
                TIENDA PRISMA
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Moda Femenina, Moda Urbana y accesorios para Mascotas. Envíos locales en
              Huánuco y a nivel nacional en todo el Perú.
            </p>
          </div>

          {/* Líneas */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Colecciones
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/catalogo"
                  className="hover:text-secondary transition-colors"
                >
                  Catálogo completo
                </Link>
              </li>
              {STORE_LINES.map((line) => (
                <li key={line.id}>
                  <Link
                    to={`/catalogo/${line.slug}`}
                    className="hover:text-secondary transition-colors"
                  >
                    {line.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y ubicación */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Contacto y tienda
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MessageCircle
                  className="w-4 h-4 text-secondary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href={STORE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  WhatsApp: {STORE_CONTACT.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram
                  className="w-4 h-4 text-secondary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href={STORE_CONTACT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  Instagram: {STORE_CONTACT.instagram}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 text-secondary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{STORE_CONTACT.address}</span>
              </li>
            </ul>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Métodos de pago
            </h3>
            <p className="text-xs text-gray-300">
              Coordinamos tu pedido de forma rápida y segura:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {STORE_CONTACT.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold"
                >
                  <CreditCard className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Tienda Prisma. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/checkout" className="hover:text-white transition-colors">
              Ir a pagar
            </Link>
            <Link
              to="/pedido/WEB-2026-00001"
              className="hover:text-white transition-colors"
            >
              Seguimiento de pedido
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
