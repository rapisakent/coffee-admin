import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Pre-fills the uncontrolled fields inside it from `values`, matching on the input `name`.
 * An `id` field is locked: renaming a record would break the references to it.
 */
export function FormFill({ values, children }: { values: object; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const record = values as Record<string, unknown>;
    ref.current!.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[name]').forEach((field) => {
      // a select that picks a record is named after the relation ("customer"), the item stores its id ("customerId")
      const candidates = [record[field.name], record[`${field.name}Id`]].filter((v) => v !== undefined && v !== null);
      for (const value of candidates) {
        field.value = String(value);
        if (field.value !== '') break;
      }
      if (candidates.length === 0) return;
      if (field instanceof HTMLSelectElement && field.value === '') {
        // keep a stored value that is no longer in the list (e.g. an abbreviated device name)
        field.add(new Option(String(candidates[0]), String(candidates[0]), true, true));
      }
      if (field.name === 'id' && !(field instanceof HTMLSelectElement)) field.readOnly = true;
    });
  }, [values]);

  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
}
