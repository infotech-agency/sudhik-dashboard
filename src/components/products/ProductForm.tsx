import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import { ImageUploader } from './ImageUploader';
import { FaqEditor, type Faq } from './FaqEditor';
import type { Product } from '@/api/products';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { VariantEditor, type Variant } from './VariantEditor';



interface FormState {
  title: string;
  description: string;
  price: string;
  stock: string;
    slug: string; 
  category: string;
  isActive: boolean;              // 👈 status hataya
  benefits: string;
  ingredients: string;
  howToUse: string;
  shippingInfo: string;
  productInformation: string;     // 👈 naam sahi kiya
  specifications: string;         // 👈 ab plain string hai
  faqs: Faq[];
  variants: Variant[];
    existingImages: string[]; 
}



const emptyForm: FormState = {
  title: '',
   slug: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  isActive: true,
  benefits: '',
  ingredients: '',
  howToUse: '',
  shippingInfo: '',
  productInformation: '',
  specifications: '',
  faqs: [],
  variants: [],
    existingImages: [],
};

const listFromText = (t: string) =>
  t.split('\n').map((s) => s.trim()).filter(Boolean);

export function ProductForm({
  open,
  onClose,
  onSave,
  product,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>, files: File[]) => Promise<void>;
  product?: Product | null;
  categories: string[];
}) {
  const { toast } = useToast();


 


  
  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          title: product.title ?? '',
             slug: product.slug ?? '',   
          description: product.description ?? '',
          price: String(product.price ?? ''),
          stock: String(product.stock ?? ''),
          category: typeof product.category === 'object' ? product.category?._id ?? '' : product.category ?? '',
          isActive: product.isActive ?? true,
          benefits: product.benefits ?? '',           // 👈 .join() hataya, direct string
          ingredients: product.ingredients ?? '',       // 👈
          howToUse: product.howToUse ?? '',             // 👈
          shippingInfo: product.shippingInfo ?? '',
          productInformation: product.productInformation ?? '',
          specifications: product.specifications ?? '', // 👈 JSON.stringify hataya
          faqs: product.faqs ?? [],
          variants: product.variants ?? [], // 👈 add
            existingImages: product.images ?? [], 
        }
      : emptyForm
);

console.log("form", form)

  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));


  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<Product> = {
        title: form.title,
          slug: form.slug.trim() || undefined,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        isActive: form.isActive,
        benefits: form.benefits,           // 👈 listFromText() nahi, direct string
        ingredients: form.ingredients,      // 👈
        howToUse: form.howToUse,            // 👈
        shippingInfo: form.shippingInfo,
        productInformation: form.productInformation,
        specifications: form.specifications, // 👈 direct string
        faqs: form.faqs,
        variants: form.variants, 
          existingImages: form.existingImages,
      };
      await onSave(payload, files);
      onClose();
    } catch (err) {
      toast(getApiError(err, 'Failed to save product'), 'error');
    } finally {
      setSaving(false);
    }
};
  return (
    <Modal open={open} onClose={onClose} size="xl" title={product ? 'Edit Product' : 'New Product'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-field">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
  <label className="label-field">
    Slug <span className="text-xs text-maroon-400">(khali chodo to auto-generate hoga, aur update ke time apne aap change nahi hoga)</span>
  </label>
  <input
    value={form.slug}
    onChange={(e) => set('slug', e.target.value)}
    placeholder="e.g. rose-face-cream"
    className="input-field"
  />
</div>
          <div className="md:col-span-2">
            <label className="label-field">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Price (₹)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Stock</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                // <option key={c} value={c}>{c}</option>
                 <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* <div>
            <label className="label-field">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as 'active' | 'inactive')}
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}
          <div>
  <label className="label-field">Status</label>
  <select
    value={form.isActive ? 'active' : 'inactive'}
    onChange={(e) => set('isActive', e.target.value === 'active')}
    className="input-field"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>
        </div>

        <ImageUploader
          // existingImages={product?.images ?? []}
          // onFilesChange={setFiles}
          // max={5}
            key={product?._id ?? 'new'} 
          existingImages={form.existingImages}
  onFilesChange={setFiles}
  onExistingImagesChange={(imgs) => set('existingImages', imgs)}
  max={5}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">Benefits (one per line)</label>
            <textarea
              value={form.benefits}
              onChange={(e) => set('benefits', e.target.value)}
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Ingredients (one per line)</label>
            <textarea
              value={form.ingredients}
              onChange={(e) => set('ingredients', e.target.value)}
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">How to Use (one per line)</label>
            <textarea
              value={form.howToUse}
              onChange={(e) => set('howToUse', e.target.value)}
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Specifications (JSON)</label>
            <textarea
              value={form.specifications}
              onChange={(e) => set('specifications', e.target.value)}
              rows={3}
              placeholder='{"weight":"500ml","fragrance":"Sandalwood"}'
              className="input-field font-mono text-xs"
            />
          </div>
          <div>
            <label className="label-field">Shipping Info</label>
            <textarea
              value={form.shippingInfo}
              onChange={(e) => set('shippingInfo', e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Product Information</label>
            <textarea
              value={form.productInfo}
              onChange={(e) => set('productInfo', e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-field">FAQs</label>
          <FaqEditor faqs={form.faqs} onChange={(faqs) => set('faqs', faqs)} />
        </div>
            <div>
  <label className="label-field">Variants</label>
  <VariantEditor variants={form.variants} onChange={(variants) => set('variants', variants)} />
</div>
        <div className="flex justify-end gap-3 border-t border-maroon-100 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
