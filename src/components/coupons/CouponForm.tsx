import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import type { Coupon } from '@/api/coupons';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';

interface FormState {
  code: string;
  discountType: 'flat' | 'percentage';
  value: string;
  minOrderAmount: string;
  expiryDate: string;
  usageLimit: string;
  active: boolean;
}

const empty: FormState = {
  code: '',
  discountType: 'flat',
  value: '',
  minOrderAmount: '',
  expiryDate: '',
  usageLimit: '',
  active: true,
};

export function CouponForm({
  open,
  onClose,
  onSave,
  coupon,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Coupon>) => Promise<void>;
  coupon?: Coupon | null;
}) {
  const { toast } = useToast();
  // const [form, setForm] = useState<FormState>(() =>
  //   coupon
  //     ? {
  //         code: coupon.code,
  //         discountType: coupon.discountType,
  //         value: String(coupon.value),
  //         minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : '',
  //         expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : '',
  //         usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
  //         active: coupon.active,
  //       }
  //     : empty
  // );
  const [form, setForm] = useState<FormState>(() =>
    coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType.toLowerCase() as 'flat' | 'percentage', // 👈 backend se UPPERCASE aayega, form ke liye lowercase kar rahe
          value: String(coupon.amount),        // 👈 'amount' se padho
          minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : '',
          expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : '',
          usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
          active: coupon.isActive,             // 👈 'isActive' se padho
        }
      : empty
);
  
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   try {
  //     await onSave({
  //       code: form.code.toUpperCase(),
  //       discountType: form.discountType,
  //       value: Number(form.value),
  //       minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
  //       expiryDate: form.expiryDate || undefined,
  //       usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
  //       active: form.active,
  //     });
  //     onClose();
  //   } catch (err) {
  //     toast(getApiError(err, 'Failed to save coupon'), 'error');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        code: form.code.toUpperCase(),
        discountType: form.discountType.toUpperCase() as 'FLAT' | 'PERCENTAGE', // 👈 uppercase
        amount: Number(form.value),                                             // 👈 'value' → 'amount'
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        expiryDate: form.expiryDate || undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        isActive: form.active,                                                  // 👈 'active' → 'isActive'
      });
      onClose();
    } catch (err) {
      toast(getApiError(err, 'Failed to save coupon'), 'error');
    } finally {
      setSaving(false);
    }
};
  return (
    <Modal open={open} onClose={onClose} title={coupon ? 'Edit Coupon' : 'New Coupon'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Coupon Code</label>
          <input
            required
            value={form.code}
            onChange={(e) => set('code', e.target.value.toUpperCase())}
            placeholder="SHUDDHIK10"
            className="input-field uppercase"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) => set('discountType', e.target.value as 'flat' | 'percentage')}
              className="input-field"
            >
              <option value="flat">Flat (₹)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label className="label-field">
              {form.discountType === 'flat' ? 'Amount (₹)' : 'Percentage (%)'}
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.value}
              onChange={(e) => set('value', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Min Order Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={form.minOrderAmount}
              onChange={(e) => set('minOrderAmount', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Usage Limit</label>
            <input
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) => set('usageLimit', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="label-field">Expiry Date</label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
            className="input-field"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-maroon-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set('active', e.target.checked)}
            className="h-4 w-4 rounded border-maroon-300 text-maroon-700 focus:ring-maroon-500"
          />
          Active
        </label>

        <div className="flex justify-end gap-3 border-t border-maroon-100 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
