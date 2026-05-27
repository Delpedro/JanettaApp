import { useOutletContext } from 'react-router-dom'

const content = {
  en: {
    title: 'Help',
    sections: [
      {
        heading: 'Logging in',
        steps: [
          'On your phone or laptop, go to the shop website and scroll to the bottom — click "Admin".',
          'Enter your email address and password, then tap Sign in.',
          'You will stay logged in for 7 days. After that, log in again.',
          'If you forget your password, call Joanna. She will call Del.',
        ],
      },
      {
        heading: 'Adding a new product',
        steps: [
          'Tap Add Product at the top of the page.',
          'Fill in the product name and description in Polish — English is done automatically.',
          'Enter the price in złoty (whole numbers only, e.g. 45).',
          'Tap the photo area to choose a photo from your phone or computer.',
          'Choose whether the product is made to order or has a set stock quantity.',
          'If it has a stock quantity, enter how many you have available.',
          'Tick "Publish immediately" if you want it visible in the shop straight away.',
          'Tap Add Product. It will appear in your product list.',
        ],
      },
      {
        heading: 'Editing a product',
        steps: [
          'Go to Products at the top.',
          'Find the product and click Edit.',
          'Change the name, description, price, stock quantity, or swap the photo.',
          'Tap Save changes. The page returns to your product list when saved.',
          'If you change the name, the English translation updates automatically.',
        ],
      },
      {
        heading: 'Hiding a product (without deleting it)',
        steps: [
          'Go to Products.',
          'Click the Visible button next to the product.',
          'It changes to Hidden — customers can no longer see it.',
          'Click it again to make it visible again.',
          'Use this if a product is temporarily out of stock or not ready yet.',
        ],
      },
      {
        heading: 'Deleting a product',
        steps: [
          'Go to Products.',
          'Click the ✕ button next to the product.',
          'Confirm when asked.',
          'This cannot be undone. Use Hide instead if you might want it back.',
        ],
      },
      {
        heading: 'Stock and made-to-order products',
        steps: [
          'Stock products — you have a set number available. The shop automatically stops selling when stock runs out.',
          'Made to order — no stock limit. Customers can always order, and you make the item after they pay.',
          'You can change a product between stock and made-to-order at any time by editing it.',
          'If a stock product is running low, update the quantity in Edit before it sells out.',
        ],
      },
      {
        heading: 'Changing your password',
        steps: [
          'Log in to the admin panel.',
          'Click "Change password" at the top of the page (next to your email address).',
          'Enter your current password, then your new password twice.',
          'Tap Save. You will stay logged in with the new password.',
        ],
      },
      {
        heading: 'When a customer places an order',
        steps: [
          'The customer pays online by card or BLIK.',
          'They automatically receive a confirmation email in Polish with their order details.',
          'You will also receive a notification email when a new order comes in.',
          'You can see all orders in the Orders tab at the top of the admin panel.',
        ],
      },
      {
        heading: 'Viewing your orders',
        steps: [
          'Tap Orders at the top of the page.',
          'You will see a list of all orders, newest first.',
          'Tap any order row to expand it and see the customer name, address, and items ordered.',
          'Order status: Paid = payment received, Pending = awaiting payment, Failed = payment did not go through.',
          'If a customer contacts you about an order, their email address is shown in the order details.',
        ],
      },
      {
        heading: 'Seeing your payments (Stripe)',
        steps: [
          'All payments go through Stripe — a secure payment service.',
          'You can log in to your Stripe account at stripe.com to see all payments, payouts, and your balance.',
          'Stripe transfers money to your bank account automatically (usually within 2–3 working days).',
          'If you have any questions about a payment, contact Joanna.',
        ],
      },
      {
        heading: 'Tips for photos',
        steps: [
          'Take photos in good natural daylight — near a window is ideal.',
          'Hold the phone steady and close to the product.',
          'Photograph the product on its own against a simple background.',
          'Take a few shots and pick the sharpest one.',
          'The photo uploads directly from your phone — no need to transfer to a computer first.',
          'Landscape (horizontal) photos work best on the shop.',
        ],
      },
      {
        heading: 'Something not working?',
        steps: [
          'Try refreshing the page first.',
          'If the problem continues, note what you were doing and what happened.',
          'Call Joanna. She will contact Del.',
          'Do not try to fix anything yourself — just note the issue and report it.',
        ],
      },
    ],
  },
  pl: {
    title: 'Pomoc',
    sections: [
      {
        heading: 'Logowanie',
        steps: [
          'Na telefonie lub laptopie wejdź na stronę sklepu, przewiń na dół i kliknij „Admin".',
          'Wpisz swój adres e-mail i hasło, a następnie naciśnij Zaloguj się.',
          'Pozostaniesz zalogowana przez 7 dni. Po tym czasie zaloguj się ponownie.',
          'Jeśli zapomnisz hasła, zadzwoń do Joanny. Ona skontaktuje się z Delem.',
        ],
      },
      {
        heading: 'Dodawanie nowego produktu',
        steps: [
          'Naciśnij Dodaj produkt na górze strony.',
          'Wpisz nazwę i opis produktu po polsku — tłumaczenie na angielski odbywa się automatycznie.',
          'Podaj cenę w złotych (tylko całe liczby, np. 45).',
          'Dotknij pola ze zdjęciem, aby wybrać zdjęcie z telefonu lub komputera.',
          'Wybierz, czy produkt jest na zamówienie, czy ma określoną ilość w magazynie.',
          'Jeśli masz określoną liczbę sztuk, wpisz ile ich masz.',
          'Zaznacz „Opublikuj od razu", jeśli chcesz, aby produkt był widoczny w sklepie natychmiast.',
          'Naciśnij Dodaj produkt. Pojawi się na liście produktów.',
        ],
      },
      {
        heading: 'Edytowanie produktu',
        steps: [
          'Przejdź do zakładki Produkty na górze.',
          'Znajdź produkt i kliknij Edytuj.',
          'Zmień nazwę, opis, cenę, ilość w magazynie lub zamień zdjęcie.',
          'Naciśnij Zapisz zmiany. Strona wróci do listy produktów po zapisaniu.',
          'Jeśli zmienisz nazwę, tłumaczenie na angielski zaktualizuje się automatycznie.',
        ],
      },
      {
        heading: 'Ukrywanie produktu (bez usuwania)',
        steps: [
          'Przejdź do zakładki Produkty.',
          'Kliknij przycisk Widoczny obok produktu.',
          'Zmieni się na Ukryty — klienci nie będą go widzieć.',
          'Kliknij ponownie, aby znów był widoczny.',
          'Użyj tej opcji, jeśli produkt jest chwilowo niedostępny lub nie jest jeszcze gotowy.',
        ],
      },
      {
        heading: 'Usuwanie produktu',
        steps: [
          'Przejdź do zakładki Produkty.',
          'Kliknij przycisk ✕ obok produktu.',
          'Potwierdź, gdy zostaniesz zapytana.',
          'Nie można tego cofnąć. Użyj opcji Ukryj, jeśli możesz chcieć go przywrócić.',
        ],
      },
      {
        heading: 'Produkty z zapasem i na zamówienie',
        steps: [
          'Produkty z zapasem — masz określoną liczbę sztuk. Sklep automatycznie zatrzymuje sprzedaż, gdy zapas się wyczerpie.',
          'Na zamówienie — bez limitu. Klienci mogą zawsze zamawiać, a Ty robisz produkt po otrzymaniu płatności.',
          'Możesz zmieniać typ produktu w dowolnym momencie poprzez edycję.',
          'Jeśli zapas się kończy, zaktualizuj ilość w Edytuj, zanim produkt się wyprzeda.',
        ],
      },
      {
        heading: 'Zmiana hasła',
        steps: [
          'Zaloguj się do panelu administracyjnego.',
          'Kliknij „Zmień hasło" na górze strony (obok swojego adresu e-mail).',
          'Wpisz obecne hasło, a następnie nowe hasło dwa razy.',
          'Naciśnij Zapisz. Pozostaniesz zalogowana z nowym hasłem.',
        ],
      },
      {
        heading: 'Gdy klient składa zamówienie',
        steps: [
          'Klient płaci online kartą lub BLIK-iem.',
          'Automatycznie otrzymuje e-mail z potwierdzeniem zamówienia po polsku ze szczegółami.',
          'Ty również otrzymasz e-mail z powiadomieniem o nowym zamówieniu.',
          'Wszystkie zamówienia możesz zobaczyć w zakładce Zamówienia na górze panelu.',
        ],
      },
      {
        heading: 'Przeglądanie zamówień',
        steps: [
          'Naciśnij Zamówienia na górze strony.',
          'Zobaczysz listę wszystkich zamówień, od najnowszego.',
          'Kliknij dowolne zamówienie, aby rozwinąć szczegóły: imię i nazwisko klienta, adres i zamówione produkty.',
          'Status zamówienia: Opłacone = płatność otrzymana, Oczekuje = płatność w toku, Nieudane = płatność nie powiodła się.',
          'Jeśli klient skontaktuje się w sprawie zamówienia, jego adres e-mail jest widoczny w szczegółach.',
        ],
      },
      {
        heading: 'Przeglądanie płatności (Stripe)',
        steps: [
          'Wszystkie płatności przechodzą przez Stripe — bezpieczny serwis płatniczy.',
          'Możesz zalogować się na swoje konto Stripe na stripe.com, aby zobaczyć płatności, wypłaty i saldo.',
          'Stripe automatycznie przelewa pieniądze na Twoje konto bankowe (zazwyczaj w ciągu 2–3 dni roboczych).',
          'W razie pytań dotyczących płatności, skontaktuj się z Joanną.',
        ],
      },
      {
        heading: 'Wskazówki dotyczące zdjęć',
        steps: [
          'Fotografuj w dobrym naturalnym świetle — najlepiej przy oknie.',
          'Trzymaj telefon nieruchomo i blisko produktu.',
          'Fotografuj produkt na prostym tle, bez zbędnych przedmiotów w tle.',
          'Zrób kilka zdjęć i wybierz najostrzejsze.',
          'Zdjęcie wysyła się bezpośrednio z telefonu — nie trzeba wcześniej przenosić go na komputer.',
          'Zdjęcia poziome (poziome ujęcie) wyglądają najlepiej w sklepie.',
        ],
      },
      {
        heading: 'Coś nie działa?',
        steps: [
          'Najpierw spróbuj odświeżyć stronę.',
          'Jeśli problem nadal występuje, zanotuj co robiłaś i co się stało.',
          'Zadzwoń do Joanny. Ona skontaktuje się z Delem.',
          'Nie próbuj niczego naprawiać samodzielnie — po prostu zanotuj problem i zgłoś go.',
        ],
      },
    ],
  },
}

export default function AdminHelpPage() {
  const { lang } = useOutletContext()
  const tx = content[lang]

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>
      <div className="admin-help">
        {tx.sections.map(section => (
          <div key={section.heading} className="admin-help-section">
            <h3 className="admin-help-heading">{section.heading}</h3>
            <ol className="admin-help-steps">
              {section.steps.map((step, i) => (
                <li key={i} className="admin-help-step">{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  )
}
