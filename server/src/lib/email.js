import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Janetta Shop <onboarding@resend.dev>';

export async function sendAdminWelcomeEmail({ to, tempPassword }) {
  const loginUrl = `${process.env.CLIENT_URL || 'https://janetta-app.vercel.app'}/admin/login`;

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

        <tr><td style="padding:40px 40px 32px">
          <h2 style="margin:0 0 16px;font-size:20px;color:#8b5e3c">Twoje konto jest gotowe!</h2>
          <p style="margin:0 0 24px;color:#6b4c3b;font-size:15px;line-height:1.7">
            Poniżej znajdziesz dane do logowania do panelu administracyjnego Twojego sklepu.
            Przy pierwszym logowaniu zostaniesz poproszona o ustawienie nowego hasła.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;border-radius:8px;padding:20px;margin-bottom:28px">
            <tr>
              <td style="font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase;padding-bottom:6px">Adres e-mail</td>
            </tr>
            <tr>
              <td style="font-size:16px;color:#3d2b1f;font-weight:bold;padding-bottom:18px">${to}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase;padding-bottom:6px">Hasło tymczasowe</td>
            </tr>
            <tr>
              <td style="font-size:16px;color:#3d2b1f;font-weight:bold;font-family:monospace;letter-spacing:1px">${tempPassword}</td>
            </tr>
          </table>

          <p style="margin:0 0 8px;font-size:14px;color:#6b4c3b;font-weight:bold">Jak się zalogować:</p>
          <ol style="margin:0 0 28px;padding-left:20px;color:#6b4c3b;font-size:14px;line-height:2">
            <li>Otwórz link poniżej</li>
            <li>Wpisz swój adres e-mail i hasło tymczasowe</li>
            <li>Ustaw własne, nowe hasło — to tylko raz</li>
          </ol>

          <a href="${loginUrl}"
             style="display:inline-block;background:#8b5e3c;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;letter-spacing:0.5px">
            Zaloguj się do panelu
          </a>

          <p style="margin:28px 0 0;font-size:13px;color:#9e7b6b">
            Jeśli przycisk nie działa, skopiuj ten link:<br>
            <span style="color:#8b5e3c">${loginUrl}</span>
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
    subject: 'Twoje konto w sklepie Janetta — dane do logowania',
    html,
  });
}

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

export async function sendOrderNotificationToAdmin({ orderId, customerName, customerEmail, items, total, address }) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_NOTIFICATION_EMAIL not set — skipping admin notification');
    return;
  }

  const itemRows = items.map(i =>
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

        <tr><td style="background:#4a7c59;padding:32px 40px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:normal;letter-spacing:1px">Nowe zamówienie!</h1>
          <p style="margin:8px 0 0;color:#c8e6c9;font-size:13px">Ktoś złożył zamówienie w Twoim sklepie</p>
        </td></tr>

        <tr><td style="padding:40px 40px 24px">
          <p style="margin:0 0 8px;font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase">Numer zamówienia</p>
          <p style="margin:0 0 24px;font-size:18px;font-weight:bold;color:#3d2b1f">#${orderId}</p>

          <p style="margin:0 0 8px;font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase">Klient</p>
          <p style="margin:0 0 4px;font-size:15px;color:#3d2b1f">${customerName}</p>
          <p style="margin:0 0 24px;font-size:14px;color:#6b4c3b">${customerEmail}</p>

          <p style="margin:0 0 8px;font-size:13px;color:#9e7b6b;letter-spacing:0.5px;text-transform:uppercase">Adres dostawy</p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d2b1f;line-height:1.6">
            ${address.street}<br>${address.postal} ${address.city}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <thead>
              <tr>
                <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Produkt</th>
                <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Szt.</th>
                <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #8b5e3c;font-size:13px;color:#9e7b6b;font-weight:normal">Cena</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top:12px;font-weight:bold;color:#3d2b1f">Łącznie</td>
                <td style="padding-top:12px;font-weight:bold;text-align:right;color:#4a7c59;font-size:18px">${Number(total).toFixed(2)} zł</td>
              </tr>
            </tfoot>
          </table>
        </td></tr>

        <tr><td style="background:#fdf8f4;padding:24px 40px;text-align:center;border-top:1px solid #f0e8df">
          <p style="margin:0;font-size:12px;color:#9e7b6b">Janetta &mdash; powiadomienie o zamówieniu</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Nowe zamówienie #${orderId} — ${customerName}`,
    html,
  });
}
