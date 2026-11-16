import { z } from 'zod';
import { validateName, validatePhone } from '../../shared/utils/validators';

export const DELIVERY_SCOPES = [
  { value: 'LOCAL', label: 'Local (Huánuco)' },
  { value: 'NACIONAL', label: 'Nacional (provincias)' },
];

export const PAYMENT_METHODS = [
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'EFECTIVO', label: 'Efectivo' },
];

export const checkoutSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .refine(validateName, 'Ingresa tu nombre completo (mínimo 3 letras, sin números).'),
    customerPhone: z
      .string()
      .trim()
      .refine(validatePhone, 'Ingresa un celular peruano válido (9 dígitos, empieza con 9).'),
    shippingAddress: z.string().trim().min(5, 'Ingresa una dirección de entrega válida.'),
    reference: z.string().trim().max(160, 'La referencia es demasiado larga.').optional(),
    deliveryScope: z.enum(['LOCAL', 'NACIONAL'], {
      errorMap: () => ({ message: 'Selecciona el ámbito de entrega.' }),
    }),
    paymentMethod: z.enum(['YAPE', 'PLIN', 'TARJETA', 'EFECTIVO'], {
      errorMap: () => ({ message: 'Selecciona un método de pago.' }),
    }),
  })
  .strict();

export const CHECKOUT_DEFAULT_VALUES = {
  customerName: '',
  customerPhone: '',
  shippingAddress: '',
  reference: '',
  deliveryScope: 'LOCAL',
  paymentMethod: 'YAPE',
};
