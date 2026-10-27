import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateServicePrice,
  formatCurrency,
  generateBookingReference,
  validateBookingForm,
} from './pricing.ts';

test('Nanny pricing enforces 4-hour minimum and calculates extra child fee', () => {
  // Base $30/hr, +$5 each additional child, min 4 hrs
  const result = calculateServicePrice({
    basePrice: 30,
    priceType: 'hourly',
    hours: 2, // Less than minimum
    minHours: 4,
    childrenCount: 3, // 1 base + 2 additional ($10 extra/hr -> $40/hr)
    additionalChildRate: 5,
  });

  assert.equal(result.effectiveHours, 4, 'Should enforce min 4 hours');
  assert.equal(result.ratePerHour, 40, 'Hourly rate should be $30 + (2 * $5) = $40');
  assert.equal(result.total, 160, 'Total should be 4 * $40 = $160');
  assert.equal(result.deposit, 40, 'Deposit should be 25% of $160 = $40');
});

test('Free Meet-N-Greet returns 0 total and 0 deposit', () => {
  const result = calculateServicePrice({
    basePrice: 0,
    priceType: 'free',
    hours: 0.5,
  });

  assert.equal(result.total, 0);
  assert.equal(result.deposit, 0);
});

test('Deposit services charge flat deposit amount', () => {
  const result = calculateServicePrice({
    basePrice: 25,
    priceType: 'deposit',
  });

  assert.equal(result.total, 25);
  assert.equal(result.deposit, 25);
});

test('Flat rate hair services set expected deposit', () => {
  const result = calculateServicePrice({
    basePrice: 100,
    priceType: 'flat',
  });

  assert.equal(result.total, 100);
  assert.equal(result.deposit, 25);
});

test('Currency formatter outputs clean dollar format', () => {
  assert.equal(formatCurrency(150), '$150');
  assert.equal(formatCurrency(0), '$0');
});

test('Booking reference has KD- prefix and correct length', () => {
  const ref = generateBookingReference();
  assert.match(ref, /^KD-[A-Z0-9]{6}$/);
});

test('Booking validation correctly catches missing or invalid fields', () => {
  const invalid = validateBookingForm({
    clientName: 'A',
    clientPhone: '123',
    clientEmail: 'notanemail',
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.clientName);
  assert.ok(invalid.errors.clientPhone);
  assert.ok(invalid.errors.clientEmail);
  assert.ok(invalid.errors.serviceDate);

  const valid = validateBookingForm({
    clientName: 'Jane Doe',
    clientPhone: '305-409-6788',
    clientEmail: 'jane@example.com',
    serviceDate: '2026-11-01',
    startTime: '10:00 AM',
    hours: 5,
    minHours: 4,
  });

  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
