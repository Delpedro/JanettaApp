import { useState, useRef, useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'

const t = {
  en: {
    title: 'Edit Product',
    namePl: 'Name (Polish)',
    descPl: 'Description (Polish)',
    price: 'Price (PLN)',
    madeToOrder: 'Made to order',
    stockQty: 'Stock quantity',
    image: 'Photo',
    changeImage: 'Change photo',
    imagePlaceholder: 'Tap to choose a photo',
    published: 'Published',
    save: 'Save changes',
    saving: 'Saving…',
    success: 'Product updated.',
    error: 'Failed to save product.',
    imageError: 'Image upload failed. Try again.',
    loading: 'Loading…',
    loadError: 'Could not load product.',
  },
  pl: {
    title: 'Edytuj produkt',
    namePl: 'Nazwa',
    descPl: 'Opis',
    price: 'Cena (PLN)',
    madeToOrder: 'Na zamówienie',
    stockQty: 'Ilość w magazynie',
    image: 'Zdjęcie',
    changeImage: 'Zmień zdjęcie',
    imagePlaceholder: 'Dotknij, aby wybrać zdjęcie',
    published: 'Opublikowany',
    save: 'Zapisz zmiany',
    saving: 'Zapisywanie…',
    success: 'Produkt zaktualizowany.',
    error: 'Nie udało się zapisać produktu.',
    imageError: 'Nie udało się przesłać zdjęcia. Spróbuj ponownie.',
    loading: 'Ładowanie…',
    loadError: 'Nie udało się załadować produktu.',
  },
}

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/admin/upload-signature', { credentials: 'include' })
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
  const data = await uploadRes.json()
  if (!uploadRes.ok) throw new Error(data?.error?.message || 'upload')
  return data.secure_url
}

export default function AdminEditProductPage() {
  const { lang } = useOutletContext()
  const { id } = useParams()
  const navigate = useNavigate()
  const tx = t[lang]
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [form, setForm] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products/${id}`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (!data) return
        setForm({
          name_pl: data.name_pl,
          description_pl: data.description_pl,
          price: data.price,
          made_to_order: data.madeToOrder,
          stock_qty: data.stockQty ?? '',
          published: data.published,
        })
        setExistingImageUrl(data.image || null)
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [id, navigate])

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
    setSaving(true)
    setMsg('')
    setIsError(false)

    let imageUrl = existingImageUrl
    if (imageFile) {
      try {
        imageUrl = await uploadToCloudinary(imageFile)
      } catch (err) {
        setMsg(`${tx.imageError} (${err.message})`)
        setIsError(true)
        setSaving(false)
        return
      }
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
      navigate('/admin/products')
    } catch {
      setMsg(tx.error)
      setIsError(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="admin-status">{tx.loading}</p>
  if (loadError) return <p className="admin-status admin-status--error">{tx.loadError}</p>

  const currentPreview = imagePreview || existingImageUrl

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
          {currentPreview && (
            <img src={currentPreview} alt="" className="admin-image-preview" />
          )}
          <label className="admin-file-label">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="admin-file-input"
            />
            {imageFile ? imageFile.name : tx.changeImage}
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
