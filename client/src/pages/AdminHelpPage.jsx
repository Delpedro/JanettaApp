import { useOutletContext } from 'react-router-dom'

const content = {
  en: {
    title: 'Help',
    sections: [
      {
        heading: 'Adding a new product',
        steps: [
          'Click Add Product at the top of the page.',
          'Fill in the product name and description in Polish.',
          'Enter the price in złoty (whole numbers only, e.g. 45).',
          'Tap the photo area to choose a photo from your phone or computer.',
          'Choose whether the product is made to order or has a set stock quantity.',
          'Tick "Publish immediately" if you want it visible in the shop straight away.',
          'Tap Add Product. The English translation is done automatically.',
        ],
      },
      {
        heading: 'Editing a product',
        steps: [
          'Go to Products at the top.',
          'Find the product and click Edit.',
          'Make your changes — name, description, price, or swap the photo.',
          'Tap Save changes. The page returns to your product list when saved.',
        ],
      },
      {
        heading: 'Hiding a product (without deleting it)',
        steps: [
          'Go to Products.',
          'Click the Visible button next to the product.',
          'It changes to Hidden — customers can no longer see it.',
          'Click it again to make it visible again.',
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
        heading: 'Tips for photos',
        steps: [
          'Take photos in good natural daylight.',
          'Hold the phone steady and close to the product.',
          'The photo uploads directly from your phone — no need to transfer to a computer first.',
        ],
      },
      {
        heading: 'Orders and customer emails',
        steps: [
          'When a customer pays, they automatically receive a confirmation email.',
          'The email is in Polish and includes their order number, items, total, and delivery address.',
          'You do not need to do anything — it sends automatically.',
          'You will not see orders in the admin panel yet — this is coming soon.',
        ],
      },
      {
        heading: 'Something not working?',
        steps: ['Call Joanna. She will call Del.'],
      },
    ],
  },
  pl: {
    title: 'Pomoc',
    sections: [
      {
        heading: 'Dodawanie nowego produktu',
        steps: [
          'Kliknij Dodaj produkt na górze strony.',
          'Wpisz nazwę i opis produktu po polsku.',
          'Podaj cenę w złotych (tylko całe liczby, np. 45).',
          'Dotknij pola ze zdjęciem, aby wybrać zdjęcie z telefonu lub komputera.',
          'Wybierz, czy produkt jest na zamówienie, czy ma określoną ilość w magazynie.',
          'Zaznacz „Opublikuj od razu", jeśli chcesz, aby produkt był od razu widoczny w sklepie.',
          'Naciśnij Dodaj produkt. Tłumaczenie na angielski odbywa się automatycznie.',
        ],
      },
      {
        heading: 'Edytowanie produktu',
        steps: [
          'Przejdź do zakładki Produkty na górze.',
          'Znajdź produkt i kliknij Edytuj.',
          'Wprowadź zmiany — nazwę, opis, cenę lub zamień zdjęcie.',
          'Naciśnij Zapisz zmiany. Strona wróci do listy produktów po zapisaniu.',
        ],
      },
      {
        heading: 'Ukrywanie produktu (bez usuwania)',
        steps: [
          'Przejdź do zakładki Produkty.',
          'Kliknij przycisk Widoczny obok produktu.',
          'Zmieni się na Ukryty — klienci nie będą go widzieć.',
          'Kliknij ponownie, aby znów był widoczny.',
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
        heading: 'Wskazówki dotyczące zdjęć',
        steps: [
          'Fotografuj w dobrym naturalnym świetle.',
          'Trzymaj telefon nieruchomo i blisko produktu.',
          'Zdjęcie wysyła się bezpośrednio z telefonu — nie trzeba wcześniej przenosić go na komputer.',
        ],
      },
      {
        heading: 'Zamówienia i e-maile do klientów',
        steps: [
          'Gdy klient zapłaci, automatycznie otrzymuje e-mail z potwierdzeniem zamówienia.',
          'E-mail jest po polsku i zawiera numer zamówienia, produkty, łączną kwotę oraz adres dostawy.',
          'Nie musisz nic robić — wysyłka odbywa się automatycznie.',
          'Zamówienia nie są jeszcze widoczne w panelu administracyjnym — ta funkcja pojawi się wkrótce.',
        ],
      },
      {
        heading: 'Coś nie działa?',
        steps: ['Zadzwoń do Joanny. Ona zadzwoni do Dela.'],
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
