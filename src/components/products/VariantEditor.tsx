// import { Plus, Trash2 } from 'lucide-react';

// export interface Variant {
//   label: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   sku?: string;
// }

// export function VariantEditor({
//   variants,
//   onChange,
// }: {
//   variants: Variant[];
//   onChange: (variants: Variant[]) => void;
// }) {
//   const update = (idx: number, field: keyof Variant, value: string) => {
//     const next = variants.map((v, i) => {
//       if (i !== idx) return v;
//       if (field === 'price' || field === 'discountPrice' || field === 'stock') {
//         return { ...v, [field]: Number(value) };
//       }
//       return { ...v, [field]: value };
//     });
//     onChange(next);
//   };

//   const add = () =>
//     onChange([...variants, { label: '', price: 0, discountPrice: 0, stock: 0, sku: '' }]);

//   const remove = (idx: number) => onChange(variants.filter((_, i) => i !== idx));

//   return (
//     <div className="space-y-3">
//       {variants.length === 0 && (
//         <p className="text-sm text-maroon-400">
//           No variants added. Product will sell at the base price/stock above.
//         </p>
//       )}
//       {variants.map((v, i) => (
//         <div key={i} className="rounded-lg border border-maroon-100 bg-cream-50 p-3">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-semibold uppercase tracking-wider text-maroon-500">
//               Variant {i + 1}
//             </span>
//             <button
//               type="button"
//               onClick={() => remove(i)}
//               className="rounded-md p-1 text-red-500 hover:bg-red-50"
//               aria-label="Remove variant"
//             >
//               <Trash2 className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
//             <input
//               value={v.label}
//               onChange={(e) => update(i, 'label', e.target.value)}
//               placeholder="Label (e.g. Pack of 3)"
//               className="input-field col-span-2 md:col-span-1"
//             />
//             <input
//               type="number"
//               min=""
//               step="0.01"
//               value={v.price}
//               onChange={(e) => update(i, 'price', e.target.value)}
//               placeholder="Price"
//               className="input-field"
//             />
//             <input
//               type="number"
//               min=""
//               step="0.01"
//               value={v.discountPrice ?? 0}
//               onChange={(e) => update(i, 'discountPrice', e.target.value)}
//               placeholder="Discount price"
//               className="input-field"
//             />
//             <input
//               type="number"
//               min=""
//               value={v.stock}
//               onChange={(e) => update(i, 'stock', e.target.value)}
//               placeholder="Stock"
//               className="input-field"
//             />
//           </div>
//           <input
//             value={v.sku ?? ''}
//             onChange={(e) => update(i, 'sku', e.target.value)}
//             placeholder="SKU (optional)"
//             className="input-field mt-2"
//           />
//         </div>
//       ))}
//       <button type="button" onClick={add} className="btn-secondary text-sm">
//         <Plus className="h-4 w-4" /> Add Variant
//       </button>
//     </div>
//   );
// }
import { Plus, Trash2 } from 'lucide-react';

export interface Variant {
  label: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
}

// helper: sirf digits + ek dot allow karo
const sanitizeNumeric = (raw: string) => {
  let v = raw.replace(/[^0-9.]/g, '');
  const parts = v.split('.');
  if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
  return v;
};

export function VariantEditor({
  variants,
  onChange,
}: {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}) {
  const updateNumeric = (idx: number, field: 'price' | 'discountPrice' | 'stock', raw: string) => {
    const cleaned = sanitizeNumeric(raw);
    const next = variants.map((v, i) =>
      i === idx ? { ...v, [field]: cleaned === '' || cleaned === '.' ? 0 : Number(cleaned) } : v
    );
    onChange(next);
  };

  const updateText = (idx: number, field: 'label' | 'sku', value: string) => {
    const next = variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v));
    onChange(next);
  };

  const add = () =>
    onChange([...variants, { label: '', price: 0, discountPrice: 0, stock: 0, sku: '' }]);

  const remove = (idx: number) => onChange(variants.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {variants.length === 0 && (
        <p className="text-sm text-maroon-400">
          No variants added yet. Click "Add Variant" to create options like
          Single, Pack of 2, Pack of 3 etc.
        </p>
      )}
      {variants.map((v, i) => (
        <div key={i} className="rounded-lg border border-maroon-100 bg-cream-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-maroon-500">
              Variant {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-md p-1 text-red-500 hover:bg-red-50"
              aria-label="Remove variant"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <label className="mb-1 block text-[11px] text-maroon-400">Label</label>
              <input
                value={v.label}
                onChange={(e) => updateText(i, 'label', e.target.value)}
                placeholder="e.g. Pack of 3"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-maroon-400">Price (₹)</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.price === 0 ? '' : String(v.price)}
                onChange={(e) => updateNumeric(i, 'price', e.target.value)}
                placeholder="e.g. 750"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-maroon-400">Discount price (₹)</label>
              <input
                type="text"
                inputMode="decimal"
                value={!v.discountPrice ? '' : String(v.discountPrice)}
                onChange={(e) => updateNumeric(i, 'discountPrice', e.target.value)}
                placeholder="Optional, e.g. 700"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-maroon-400">Stock</label>
              <input
                type="text"
                inputMode="numeric"
                value={v.stock === 0 ? '' : String(v.stock)}
                onChange={(e) => updateNumeric(i, 'stock', e.target.value)}
                placeholder="e.g. 15"
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-[11px] text-maroon-400">SKU (optional)</label>
            <input
              value={v.sku ?? ''}
              onChange={(e) => updateText(i, 'sku', e.target.value)}
              placeholder="e.g. ROSE-PK3"
              className="input-field"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary text-sm">
        <Plus className="h-4 w-4" /> Add Variant
      </button>
    </div>
  );
}