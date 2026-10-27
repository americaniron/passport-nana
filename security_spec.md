# Security Specification — Passport Nana Production Firestore

## 1. Data Invariants
1. **Booking Ownership & Isolation**: A `Booking` document can only be read (`get`/`list`) by its creator (`resource.data.clientUid == request.auth.uid`) or a verified administrator (`isAdmin()`).
2. **CareProfile PII Isolation**: A `CareProfile` document at `/careProfiles/{userId}` contains sensitive family, child allergy, emergency contact, and address data. It can only be read or written by the matching authenticated user (`request.auth.uid == userId`) or an administrator.
3. **Master Gate for LiveUpdates**: A `LiveUpdate` document in `/bookings/{bookingId}/liveUpdates/{updateId}` cannot be read or created unless the user is `isAdmin()` or owns the parent `/bookings/{bookingId}` document (`get(...).data.clientUid == request.auth.uid`), and `incoming().authorUid == request.auth.uid`.
4. **Privilege Escalation Prevention**: Non-admin clients cannot set `authorRole: 'nana'` in `LiveUpdate` or modify financial totals (`estimatedTotal`, `requiredDeposit`, `finalPaid`) on an existing `Booking`.
5. **Terminal State Locking**: Once a `Booking` reaches `status == 'completed'`, non-admin clients cannot mutate any fields on that booking.
6. **Public Configuration Integrity**: `/siteConfig`, `/availability`, `/promotions`, and `/mediaGallery` are publicly readable so visitors can view rates, availability calendars, and promotions, but strictly restricted to `isAdmin()` for `create`, `update`, and `delete`.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing on Booking Create**: Authenticated user `uid_attacker` creates a booking with `clientUid: "uid_victim"`. -> `PERMISSION_DENIED`
2. **Unauthorized PII Read on CareProfile**: Authenticated user `uid_attacker` attempts `get(/careProfiles/uid_victim)`. -> `PERMISSION_DENIED`
3. **Blanket List Scraping on Bookings**: Authenticated user `uid_attacker` attempts `list(/bookings)` without filtering by `clientUid == request.auth.uid`. -> `PERMISSION_DENIED`
4. **Shadow Field Injection on Booking Create**: User sends a valid booking payload plus `"isAdminOverride": true`. -> `PERMISSION_DENIED` (blocked by `.keys().hasOnly(...)`)
5. **Financial Tampering on Booking Update**: Client attempts to update `estimatedTotal: 0` or `finalPaid: true` on their own booking. -> `PERMISSION_DENIED` (blocked by `affectedKeys().hasOnly(...)`)
6. **Terminal State Bypass**: Client attempts to update `specialRequests` on a booking where `existing().status == 'completed'`. -> `PERMISSION_DENIED`
7. **Orphaned / Cross-Booking LiveUpdate Write**: User `uid_attacker` attempts to create a `LiveUpdate` inside `/bookings/victim_booking_id/liveUpdates/u1`. -> `PERMISSION_DENIED` (blocked by Master Gate `get()` check)
8. **Role Impersonation in LiveUpdate**: Client attempts to post a `LiveUpdate` with `authorRole: "nana"`. -> `PERMISSION_DENIED`
9. **Unverified Admin Email Spoof**: Attacker with `email == "info@fixmyiron.com"` but `email_verified == false` attempts to write to `/siteConfig/main`. -> `PERMISSION_DENIED`
10. **Public Availability Tampering**: Standard signed-in client attempts to update `/availability/2026-11-15` to `status: "available"`. -> `PERMISSION_DENIED`
11. **Denial-of-Wallet String Overflow**: Client submits a `specialRequests` string of 50,000 characters on a booking. -> `PERMISSION_DENIED` (blocked by `maxLength <= 1500`)
12. **Self-Assigned Admin Escalation**: Standard user attempts to create `/admins/{their_uid}` to grant themselves admin privileges. -> `PERMISSION_DENIED`
