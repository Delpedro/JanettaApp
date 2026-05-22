export default function ProductCard({ product, lang }) {
  const name = lang === 'pl' ? product.name_pl : product.name_en
  const description = lang === 'pl' ? product.description_pl : product.description_en

  const badge = product.madeToOrder
    ? { text: lang === 'pl' ? 'Na zamówienie' : 'Made to order', cls: 'badge--order' }
    : product.inStock
    ? { text: lang === 'pl' ? 'Dostępny' : 'In stock', cls: 'badge--stock' }
    : { text: lang === 'pl' ? 'Niedostępny' : 'Out of stock', cls: 'badge--empty' }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={name} className="product-card__image" />
        <span className={`badge ${badge.cls}`}>{badge.text}</span>
      </div>

      <div className="product-card__body">
        <h2 className="product-card__name">{name}</h2>
        <p className="product-card__desc">{description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">{product.price} zł</span>
          <button
            className="btn btn--primary"
            disabled={!product.inStock && !product.madeToOrder}
          >
            {lang === 'pl' ? 'Dodaj do koszyka' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
