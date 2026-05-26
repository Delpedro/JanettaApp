import { useState, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const t = {
  en: {
    title: 'Add Product',
    namePl: 'Name (Polish)',
    descPl: 'Description (Polish)',
    price: 'Price (PLN)',
    madeToOrder: 'Made to order',
    stockQty: 'Stock quantity',
    image: 'Photo',
    imagePlaceholder: 'Tap to choose a photo',
    published: 'Publish immediately',
    save: 'Add Product',
    saving: 'Saving…',
    success: 'Product added.',
    error: 'Failed to add product.',
    imageError: 'Image upload failed. Try again.',
  },
  pl: {
    title: 'Dodaj produkt',
    namePl: 'Nazwa',
    descPl: 'Opis',
    price: 'Cena (PLN)',
    madeToOrder: 'Na zamówienie',
    stockQty: 'Ilość w magazynie',
    image: 'Zdjęcie',
    imagePlaceholder: 'Dotknij, aby wybrać zdjęcie',
    published: 'Opublikuj od razu',
    save: 'Dodaj produkt',
    saving: 'Zapisywanie…',
    success: 'Produkt dodany.',
    error: 'Nie udało się dodać produktu.',
    imageError: 'Nie udało się przesłać zdjęcia. Spróbuj ponownie.',
  },
}

const EMPTY = {
  name_pl: '',
  description_pl: '',
  price: '',
  made_to_order: false,
  stock_qty: '',
  published: false,
}

async function uploadToCloudinary(file, token) {
  const sigRes = await fetch('/api/admin/upload-signature', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!sigRes.ok) throw new Error('signature')
  const { timestamp, signature, api_key, cloud_name } = await sigRes.json()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)
  formData.append('api_key', api_key)
  formData.append('folder', 'janetta/products')

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!uploadRes.ok) throw new Error('upload')
  const data = await uploadRes.json()
  return data.secure_url
}

export default function AdminAddProductPage() {
  const { getToken, lang } = useOutletContext()
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const tx = t[lang]

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    setSaving(true)
    setMsg('')

    let imageUrl = null
    if (imageFile) {
      try {
        imageUrl = await uploadToCloudinary(imageFile, token)
      } catch {
        setMsg(tx.imageError)
        setIsError(true)
        setSaving(false)
        return
      }
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name_pl: form.name_pl.trim(),
          description_pl: form.description_pl.trim(),
          price: Math.round(Number(form.price)),
          made_to_order: form.made_to_order,
          stock_qty: form.made_to_order ? 0 : Math.max(0, parseInt(form.stock_qty) || 0),
          image: imageUrl,
          published: form.published,
        }),
      })
      if (res.status === 401) { navigate('/admin/login'); return }
      if (!res.ok) throw new Error()
      setMsg(tx.success)
      setIsError(false)
      setForm(EMPTY)
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setMsg(tx.error)
      setIsError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>
      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label className="admin-label">{tx.namePl}</label>
          <input className="admin-input" type="text" value={form.name_pl} onChange={e => set('name_pl', e.target.value)} required />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">{tx.descPl}</label>
          <textarea className="admin-textarea" value={form.description_pl} onChange={e => set('description_pl', e.target.value)} required rows={4} />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">{tx.price}</label>
          <input className="admin-input admin-input--short" type="number" min="1" step="1" value={form.price} onChange={e => set('price', e.target.value)} required />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">{tx.image}</label>
          {imagePreview && (
            <img src={imagePreview} alt="" className="admin-image-preview" />
          )}
          <label className="admin-file-label">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="admin-file-input"
            />
            {imageFile ? imageFile.name : tx.imagePlaceholder}
          </label>
        </div>

        <label className="admin-checkbox-label">
          <input type="checkbox" checked={form.made_to_order} onChange={e => set('made_to_order', e.target.checked)} />
          {tx.madeToOrder}
        </label>

        {!form.made_to_order && (
          <div className="admin-form-group">
            <label className="admin-label">{tx.stockQty}</label>
            <input className="admin-input admin-input--short" type="number" min="0" step="1" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)} required />
          </div>
        )}

        <label className="admin-checkbox-label">
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          {tx.published}
        </label>

        <button className="admin-submit-btn" type="submit" disabled={saving}>
          {saving ? tx.saving : tx.save}
        </button>

        {msg && <p className={`admin-status${isError ? ' admin-status--error' : ''}`}>{msg}</p>}
      </form>
    </>
  )
}
