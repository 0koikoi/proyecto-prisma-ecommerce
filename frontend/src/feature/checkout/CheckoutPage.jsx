import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../../core/context/CartContext';
import { useToast } from '../../core/context/ToastContext';
import { Button, Input } from '../../shared/components';
import { sanitizePhone } from '../../shared/utils/validators';
import { zodResolver } from '../../shared/utils/zodResolver';
import {
  checkoutSchema,
  CHECKOUT_DEFAULT_VALUES,
  DELIVERY_SCOPES,
  PAYMENT_METHODS,
} from './checkoutSchema';
import { OrderSummary } from './components/OrderSummary';
import { orderService } from './services/orderService';

function generateRequestKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function ChoiceChips({ legend, name, options, register, error }) {
  return (
    <fieldset className="space-y-2">
      <legend className="input-label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              value={option.value}
              className="peer sr-only"
              {...register(name)}
            />
            <span className="inline-flex min-h-11 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-secondary">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <span className="text-xs font-medium text-rose" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const toast = useToast();
  const [submitError, setSubmitError] = useState(null);

  // One key per checkout session: a retry of the same order reuses it so the
  // backend can detect duplicates.
  const requestKeyRef = useRef(generateRequestKey());
  const completedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: CHECKOUT_DEFAULT_VALUES,
    mode: 'onTouched',
  });

  // Route guard: nothing to check out. Skipped right after a successful order,
  // because clearing the cart must not bounce the user to the catalog.
  if (items.length === 0 && !completedRef.current) {
    return <Navigate to="/catalogo" replace />;
  }

  const phoneField = register('customerPhone');

  async function onSubmit(values) {
    setSubmitError(null);

    try {
      const order = await orderService.createOrder({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        shippingAddress: values.shippingAddress,
        reference: values.reference,
        deliveryScope: values.deliveryScope,
        requestedPaymentMethod: values.paymentMethod,
        requestKey: requestKeyRef.current,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          salePrice: item.salePrice,
        })),
      });

      completedRef.current = true;
      clear();
      navigate(`/checkout/confirmacion?codigo=${encodeURIComponent(order.code)}`, {
        replace: true,
        state: { code: order.code },
      });
    } catch (error) {
      const message = error?.message || 'No pudimos registrar tu pedido. Inténtalo nuevamente.';
      setSubmitError(message);
      toast.error(message);
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Completa tus datos para registrar el pedido.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Mobile: summary first (collapsible). Desktop: right column (5/12). */}
        <div className="order-first lg:order-last lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <OrderSummary items={items} subtotal={subtotal} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="content-card space-y-5 lg:col-span-7"
          aria-busy={isSubmitting}
        >
          <Input
            label="Nombre completo"
            icon={User}
            autoComplete="name"
            placeholder="Ej. María Pérez"
            error={errors.customerName?.message}
            {...register('customerName')}
          />

          <Input
            label="Teléfono celular"
            icon={Phone}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="9XXXXXXXX"
            maxLength={9}
            error={errors.customerPhone?.message}
            {...phoneField}
            onChange={(event) => {
              event.target.value = sanitizePhone(event.target.value);
              return phoneField.onChange(event);
            }}
          />

          <Input
            label="Dirección de entrega"
            icon={MapPin}
            autoComplete="street-address"
            placeholder="Calle, número, distrito"
            error={errors.shippingAddress?.message}
            {...register('shippingAddress')}
          />

          <Input
            label="Referencia (opcional)"
            placeholder="Ej. Frente a la plazuela"
            error={errors.reference?.message}
            {...register('reference')}
          />

          <ChoiceChips
            legend="Ámbito de entrega"
            name="deliveryScope"
            options={DELIVERY_SCOPES}
            register={register}
            error={errors.deliveryScope?.message}
          />

          <ChoiceChips
            legend="Método de pago"
            name="paymentMethod"
            options={PAYMENT_METHODS}
            register={register}
            error={errors.paymentMethod?.message}
          />

          {submitError && (
            <p
              className="rounded-xl border border-rose-border bg-rose-soft p-3 text-sm text-rose"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando pedido...
              </>
            ) : (
              'Confirmar pedido'
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
