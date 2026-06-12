# QA Notes

Date: 2026-06-12

## Environment

- Expo web preview
- URL: `http://127.0.0.1:19006/`

## Desktop Flow Check

- Product List loaded after the intended loading state.
- Product Detail opened from the catalog.
- Add-to-cart moved the flow into Cart.
- Checkout Review showed the validation summary.
- Order Confirmation rendered with an order number and delivery date.

## Mobile Viewport Check

- Tested at `390 x 844`.
- Search, category chips, product cards, and delivery badges stayed readable.
- Empty cart layout remained centered and usable.
- No mojibake text was visible in the checked screens.

## Findings

- The ordering flow works end to end on web preview.
- The temporary `Test error` control is still visible on the catalog screen and
  should be removed before submission.
