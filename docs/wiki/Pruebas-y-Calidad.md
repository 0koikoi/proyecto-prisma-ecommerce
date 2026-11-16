# Pruebas y calidad

Cómo probamos el proyecto, qué mide la cobertura y cómo escribir una prueba que de verdad proteja algo.

**En esta página:** [Herramientas](#herramientas) · [Qué se prueba](#qué-se-prueba) · [Cobertura](#cobertura) · [Cómo escribir una prueba](#cómo-escribir-una-prueba) · [Ejemplos reales](#ejemplos-reales-del-proyecto) · [Lint](#lint)

---

## Herramientas

| Herramienta | Para qué |
| :--- | :--- |
| **Vitest** | Ejecutar las pruebas unitarias |
| **`@vitest/coverage-v8`** | Medir la cobertura |
| **oxlint** | Revisar el código (rápido, sin configuración) |

Comandos (dentro de `frontend/`):

```bash
npm test                # corre las pruebas una vez
npm run test:coverage   # con reporte de cobertura
npm run test:ci         # lo que corre el CI: cobertura + reporte JUnit
npm run lint
```

## Qué se prueba

La filosofía es **probar la lógica, no los píxeles**. Las pruebas se concentran en lo que se rompe en silencio:

| Se prueba | Ejemplos |
| :--- | :--- |
| **Validaciones** | Teléfono peruano, nombre con tildes, esquema del checkout |
| **Reglas de negocio** | Creación de pedido, cálculo de precios, códigos correlativos |
| **Servicios** | Qué devuelve `getOrderByCode`, errores 404 |
| **Utilidades** | Formato de moneda y fechas, sanitización de entradas |

Las pruebas viven junto al código que prueban, en una carpeta `__tests__`:

```text
frontend/src/
├── feature/checkout/__tests__/
│   ├── checkoutSchema.test.js
│   └── orderService.test.js
└── shared/utils/__tests__/
    ├── validators.test.js
    └── formatters.test.js
```

## Cobertura

La cobertura mide qué porcentaje del código ejecutan las pruebas. El CI **falla si baja de los umbrales**:

| Métrica | Mínimo |
| :--- | :-: |
| Líneas | 80 % |
| Funciones | 80 % |
| Sentencias | 80 % |
| Ramas | 70 % |

Hoy se mide solo la lógica que ya tiene pruebas: validadores, formateadores, el resolver de Zod, el esquema del checkout y el servicio de pedidos (configurado en `frontend/vitest.config.js`).

> [!IMPORTANT]
> **Cuando agregas un archivo de lógica, súmalo a la cobertura junto con su prueba.** Si lo agregas sin pruebas, baja el promedio. Si lo agregas a la cobertura sin pruebas, el CI se pone rojo, y eso es lo que queremos que pase.

> [!NOTE]
> **Cobertura no es calidad.** Un 100 % con pruebas que no comprueban nada es peor que un 80 % que sí protege. Mira qué afirma cada prueba, no solo el número.

## Cómo escribir una prueba

**1. Un nombre que cuente una historia.** Quien lea un fallo debe entender qué se rompió sin abrir el código.

```js
it('rechaza un teléfono que no empieza con 9', () => { ... });
```

**2. Una sola razón para fallar.** Una prueba, una regla.

**3. Prueba el borde, no solo el caso feliz.** Vacío, demasiado corto, demasiado largo, tipo equivocado, caracteres raros.

**4. Que no dependa del orden ni del reloj.** Cada prueba debe poder correr sola y dar el mismo resultado siempre.

**5. Prueba por la puerta pública.** Llama a la función como lo haría el resto de la app, no a sus detalles internos.

**6. Cuando corrijas un bug, escribe primero la prueba que lo reproduce.** Así no vuelve.

## Ejemplos reales del proyecto

### Casos límite con `it.each`

Una tabla de entradas evita repetir la misma prueba cinco veces:

```js
it.each(['887654321', '98765432', '9876543210', 'abc'])('rechaza el teléfono %s', (telefono) => {
  expect(checkoutSchema.safeParse({ ...valido, customerPhone: telefono }).success).toBe(false);
});
```

### Probar el error esperado

Los fallos también son comportamiento:

```js
it('lanza un 404 para códigos desconocidos', async () => {
  await expect(orderService.getOrderByCode('WEB-2026-99999')).rejects.toMatchObject({ status: 404 });
});
```

### Una prueba nacida de una alerta de seguridad

CodeQL marcó que buscar un pedido demo con un nombre controlado por el usuario podía alcanzar miembros heredados del objeto. Se corrigió con un `Map` y se dejó una prueba que lo vigila:

```js
it.each(['constructor', '__proto__', 'toString'])('no resuelve el nombre heredado %s', async (nombre) => {
  await expect(orderService.getOrderByCode(nombre)).rejects.toMatchObject({ status: 404 });
});
```

## Lint

`oxlint` revisa `frontend/src` en cada PR. Reglas prácticas:

- **Cero advertencias.** No las acumules: se vuelven ruido y esconden problemas reales.
- No dejes importaciones o variables sin usar.
- Si una regla te estorba en un caso puntual, desactívala **en esa línea** y deja un comentario con el motivo; nunca de forma global.

---

Siguiente: [Buenas prácticas](Buenas-Practicas)
