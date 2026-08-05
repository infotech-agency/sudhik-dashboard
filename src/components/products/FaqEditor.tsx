import { Plus, Trash2 } from 'lucide-react';

export interface Faq {
  question: string;
  answer: string;
}

export function FaqEditor({
  faqs,
  onChange,
}: {
  faqs: Faq[];
  onChange: (faqs: Faq[]) => void;
}) {
  const update = (idx: number, field: keyof Faq, value: string) => {
    const next = faqs.map((f, i) => (i === idx ? { ...f, [field]: value } : f));
    onChange(next);
  };
  const add = () => onChange([...faqs, { question: '', answer: '' }]);
  const remove = (idx: number) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {faqs.length === 0 && (
        <p className="text-sm text-maroon-400">No FAQs added yet.</p>
      )}
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-lg border border-maroon-100 bg-cream-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-maroon-500">
              Q&A {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-md p-1 text-red-500 hover:bg-red-50"
              aria-label="Remove FAQ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, 'question', e.target.value)}
            placeholder="Question"
            className="input-field mt-2"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, 'answer', e.target.value)}
            placeholder="Answer"
            rows={2}
            className="input-field mt-2"
          />
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary text-sm">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
    </div>
  );
}
