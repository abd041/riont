# Payment model (approved)

> **Client decision:** External payment + admin confirmation.  
> **Not planned:** Stripe, PayPal, Binance, Apple Pay, crypto gateways, or in-app “Pay now” buttons.

This document is the single place to explain how money and orders work in **riyont / RIONT**. It resolves the difference between “submit checkout” and “payment confirmed.”

---

## Summary

| Step | Who | What happens |
|------|-----|----------------|
| 1 | Customer | Submits checkout → **order request** is created (`pending_review`) |
| 2 | Admin | Reviews order → approves or cancels → may set `awaiting_payment` |
| 3 | Customer | Pays **outside** the website (bank transfer, WhatsApp, etc. per `site_settings`) |
| 4 | Admin | Confirms payment → status `payment_received` + timestamp |
| 5 | System | Fulfillment runs (auto inventory or manual service) |

**Submitting checkout does not charge a card and does not mean payment succeeded.**  
**Fulfillment and instant delivery start only after admin marks payment received** (then `processing`).

---

## Why orders appear before payment

With external payment, the store must record the **order request** first so that:

- The customer gets an order number and tracking page
- Required service fields (Instagram username, etc.) are stored securely
- Admin can send the correct amount and payment instructions
- Stock can be reserved/checked at submit time

Unpaid requests in the admin queue are **expected**, not bugs. Use **Payment** badge (Unpaid / Paid / Failed) and **Order status** together.

---

## Order status vs payment status

### Order status (`orders.status`)

Workflow for operations and customer timeline:

```
pending_review → awaiting_payment → payment_received → processing → delivered → completed
```

Also: `cancelled`, `needs_customer_response`, `on_hold`

### Payment status (derived in admin UI)

| Badge | Meaning |
|-------|---------|
| **Unpaid** | No `payment_received_at` and not in paid workflow |
| **Paid** | `payment_received_at` set and/or status is `payment_received`, `processing`, `delivered`, `completed` |
| **Failed** | Order `cancelled` |

Implementation: `src/lib/order/payment-status.ts`

---

## Customer-facing copy

- Checkout button: **Submit order request** (not “Pay now”)
- Terms: customer agrees payment happens **externally** after review
- Confirmation page: explains review + payment instructions next
- Order page: shows `site_settings` payment instructions when relevant

Configure payment text in **Admin → Settings** (`payment_instructions`, `support_whatsapp`, etc.).

---

## Admin workflow

1. **Orders** list — filter `Pending review` / `Awaiting payment`
2. Open order — read customer fields (decrypted for admins)
3. Transition to **Awaiting payment** when ready for customer to pay
4. After external transfer verified → **Payment received**
5. Start fulfillment (auto) or manual delivery / tickets

**Do not** mark `payment_received` until you have confirmed the transfer.

---

## Notifications & emails

| Event | When |
|-------|------|
| Customer confirmation email | On order **submit** (request received) |
| Admin email / queue alert | On order **submit** (new request to review) |
| Status / delivery emails | On status changes (e.g. after payment confirmed) |

Admin alerts on submit are intentional: they signal a **new request**, not a completed payment.

---

## Out of scope (permanent unless product scope changes)

- Payment SDKs in the repository
- Payment webhooks (`/api/webhooks/stripe`, etc.)
- `payments` / `payment_intents` tables
- Creating orders only inside a payment gateway callback
- PCI / card data handling in the app

See also: [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md), [MVP_ROADMAP.md](./MVP_ROADMAP.md)

---

## Instant delivery products

| Product type | When customer receives credentials |
|--------------|-------------------------------------|
| Auto (`delivery_mode = auto`) | After admin sets **payment received** → system allocates inventory on **processing** |
| Manual service | After admin completes manual fulfillment → **delivered** |

“Instant” means **fast automated delivery after payment is confirmed**, not payment inside checkout.

---

## Related docs

- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) — §4 order flows  
- [REQUIREMENTS_ALIGNMENT.md](./REQUIREMENTS_ALIGNMENT.md) — client checklist  
- [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) — platform scope  

---

## Change log

| Date | Decision |
|------|----------|
| 2026-05-25 | Client confirmed: **external pay + admin confirm** (documented here) |
