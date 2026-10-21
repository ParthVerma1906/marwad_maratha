# Order pricing

- Authoritative order snapshots and pricing belong in a database insert trigger shared by legacy and priced order RPCs, so all insert paths use trusted product/settings records without changing order history or access policies.
- Keep the legacy `place_order` signature and text response compatible; Checkout uses the additive `place_order_priced` JSON response for authoritative payment amounts.