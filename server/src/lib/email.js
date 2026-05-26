import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Janetta Shop <onboarding@resend.dev>';

export async function sendOrderConfirmation({ to, customerName, orderId, items, total, address }) {
  const itemRowsPL = items.map(i =>
    `<tr>
      <td style="padding:6px 0;border-bottom:1px solid #f0e8df">${i.name_pl}</td>
      <td style="padding:6px 0;border-bottom:1px solid #f0e8df;text-align:center">${i.qty}</td>
      <td style="padding:6px 0;border-bottom:1px solid #f0e8df;text-align:right">${(i.price_snapshot * i.qty).toFixed(2)} zł</td>
    </tr>`
  ).join('');

  const html = `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf8f4;font-family:Georgia,serif;color:#3d2b1f">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%">

        <tr><td style="background:#8b5e3c;padding:32px 40px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:normal;letter-spacing:1px">Janetta</h1>
          <p style="margin:8px 0 0;color:#f0d9c8;font-size:13px">Rękodzieło z sercem</p>
        </td></tr>

        <tr><td style="padding:40px 40px 24px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#8b5e3c">Dziękujemy za zamówienie!</h2>
          <p style="margin:0 0 24px;color:#6b4c3b;font-size:15px">Cześć ${customerName}, Twoje zamówienie zostało przyjęte i jest przygotowywane.</p>

          <p style="margin:0 0 8px;font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase">Numer zamówienia</p>
          <p style="margin:0 0 24px;font-size:16px;font-weight:bold;color:#3d2b1f">#${orderId}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <thead>
              <tr>
                <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Produkt</th>
                <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Szt.</th>
                <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Cena</th>
              </tr>
            </thead>
            <tbody>${itemRowsPL}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top:12px;font-weight:bold;color:#3d2b1f">Łącznie</td>
                <td style="padding-top:12px;font-weight:bold;text-align:right;color:#8b5e3c;font-size:18px">${Number(total).toFixed(2)} zł</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin:0 0 4px;font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase">Adres dostawy</p>
          <p style="margin:0 0 32px;font-size:15px;color:#3d2b1f;line-height:1.6">
            ${address.street}<br>${address.postal} ${address.city}
          </p>

          <p style="margin:0;font-size:14px;color:#6b4c3b;line-height:1.7">
            Skontaktujemy się z Tobą, gdy zamówienie będzie gotowe do wysyłki.<br>
            Dziękujemy za wsparcie polskiego rękodzieła! 🌿
          </p>
        </td></tr>

        <tr><td style="background:#fdf8f4;padding:24px 40px;text-align:center;border-top:1px solid #f0e8df">
          <p style="margin:0;font-size:12px;color:#9e7b6b">Janetta &mdash; handmade with love in Poland</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Potwierdzenie zamówienia #${orderId} — Janetta`,
    html,
  });
}
