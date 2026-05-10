import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import type { PromoCodeAdminRow } from '@packages/shared/src/utils/types/promoCodeAdmin.type';
import {
  PROMO_DISCOUNT_TYPES,
  PROMO_PRODUCT_TYPES,
} from '@packages/shared/src/utils/types/promoCodeAdmin.type';
import Button from '@packages/shared/src/components/UI/Button/Button';
import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import InputOption from '@packages/shared/src/components/UI/form-controls/InputOption/InputOption';
import Cookies from '@packages/shared/src/utils/cookies';
import cl from './AdminPromoCodes.module.scss';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';

type ApiEnvelope = { success?: boolean; message?: string; data?: unknown };

function extractPromoList(payload: unknown): PromoCodeAdminRow[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as PromoCodeAdminRow[];
  const p = payload as ApiEnvelope;
  if (Array.isArray(p.data)) return p.data as PromoCodeAdminRow[];
  const nested = (p.data as ApiEnvelope)?.data;
  if (Array.isArray(nested)) return nested as PromoCodeAdminRow[];
  return [];
}

type FormState = {
  code: string;
  discountType: string;
  discountValue: string;
  usageLimit: string;
  isInfinite: boolean;
  isActive: boolean;
  expiresAt: string;
  minProductPrice: string;
  maxProductPrice: string;
  types: Record<string, boolean>;
};

const emptyForm = (): FormState => ({
  code: '',
  discountType: 'Percentage',
  discountValue: '10',
  usageLimit: '',
  isInfinite: true,
  isActive: true,
  expiresAt: '',
  minProductPrice: '',
  maxProductPrice: '',
  types: Object.fromEntries(PROMO_PRODUCT_TYPES.map((t) => [t, false])) as Record<string, boolean>,
});

function formFromRow(row: PromoCodeAdminRow): FormState {
  const types = Object.fromEntries(
    PROMO_PRODUCT_TYPES.map((t) => [t, row.applicableProductTypes.includes(t)]),
  ) as Record<string, boolean>;
  let expiresAt = '';
  if (row.expiresAt && !row.isInfinite) {
    const d = new Date(row.expiresAt);
    const pad = (n: number) => String(n).padStart(2, '0');
    expiresAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes(),
    )}`;
  }
  return {
    code: row.code,
    discountType: row.discountType,
    discountValue: String(row.discountValue),
    usageLimit: row.usageLimit != null ? String(row.usageLimit) : '',
    isInfinite: row.isInfinite,
    isActive: row.isActive,
    expiresAt,
    minProductPrice: row.minProductPrice != null ? String(row.minProductPrice) : '',
    maxProductPrice: row.maxProductPrice != null ? String(row.maxProductPrice) : '',
    types,
  };
}

function formatDiscount(row: PromoCodeAdminRow): string {
  if (row.discountType === 'Percentage') {
    return `${row.discountValue}%`;
  }
  return `${row.discountValue} ₴`;
}

function formatUsage(row: PromoCodeAdminRow): string {
  if (row.usageLimit == null) {
    return `${row.usedCount} / ∞`;
  }
  return `${row.usedCount} / ${row.usageLimit}`;
}

const ynLabels = ['Так', 'Ні'];

const AdminPromoCodes = () => {
  const { response, fetchData, isLoading, error } = useFetch<null, unknown>();
  const [rows, setRows] = useState<PromoCodeAdminRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Record<string, boolean>>({});

  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    fetchData({
      method: 'GET',
      url: 'admin/promo-codes',
      port: 5004,
    });
  }, []);

  useEffect(() => {
    if (!response) return;
    setRows(extractPromoList(response));
    setLoadError(null);
  }, [response]);

  useEffect(() => {
    if (!error) return;
    setLoadError(error.message || 'Не вдалося завантажити промокоди');
  }, [error]);

  const reload = () => {
    fetchData({
      method: 'GET',
      url: 'admin/promo-codes',
      port: 5004,
    });
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setForm(emptyForm());
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (row: PromoCodeAdminRow) => {
    setModalMode('edit');
    setEditingId(row.id);
    setForm(formFromRow(row));
    setSubmitError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitError(null);
  };

  const buildPayload = (includeId: boolean): Record<string, unknown> => {
    const applicableProductTypes = PROMO_PRODUCT_TYPES.filter((t) => form.types[t]);
    const payload: Record<string, unknown> = {
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      isInfinite: form.isInfinite,
      isActive: form.isActive,
      applicableProductTypes,
    };
    if (!includeId) {
      payload.code = form.code.trim();
    }
    if (includeId && editingId) {
      payload.id = editingId;
    }
    const ul = form.usageLimit.trim();
    if (ul !== '') {
      payload.usageLimit = Number(ul);
    } else if (modalMode === 'edit') {
      payload.usageLimit = null;
    }
    if (!form.isInfinite && form.expiresAt) {
      payload.expiresAt = new Date(form.expiresAt).toISOString();
    } else if (modalMode === 'edit' && form.isInfinite) {
      payload.expiresAt = null;
    } else if (!form.isInfinite && !form.expiresAt.trim() && modalMode === 'create') {
      /* optional: omit */
    }
    const minP = form.minProductPrice.trim();
    if (minP !== '') {
      payload.minProductPrice = Number(minP);
    } else if (modalMode === 'edit') {
      payload.minProductPrice = null;
    }
    const maxP = form.maxProductPrice.trim();
    if (maxP !== '') {
      payload.maxProductPrice = Number(maxP);
    } else if (modalMode === 'edit') {
      payload.maxProductPrice = null;
    }
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const isEdit = modalMode === 'edit';
      const urlPath = isEdit ? 'admin/promo-codes/update' : 'admin/promo-codes';
      const payload = buildPayload(isEdit);
      const res = await fetch(`${backendOriginForPort(5004)}/fashion/${urlPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${cookies.getCookie('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Запит відхилено');
      }
      closeModal();
      reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Помилка збереження';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (row: PromoCodeAdminRow) => {
    setTogglingIds((p) => ({ ...p, [row.id]: true }));
    try {
      const res = await fetch(`${backendOriginForPort(5004)}/fashion/admin/promo-codes/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${cookies.getCookie('token')}`,
        },
        body: JSON.stringify({
          id: row.id,
          isActive: !row.isActive,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Не вдалося змінити статус');
      }
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, isActive: !row.isActive } : r)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingIds((p) => ({ ...p, [row.id]: false }));
    }
  };

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  const modal = modalOpen
    ? createPortal(
        <div className={cl.overlay} role="presentation" onClick={closeModal}>
          <div
            className={cl.modal}
            role="dialog"
            aria-modal="true"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h3 className={cl.modalTitle}>
              {modalMode === 'create' ? 'Новий промокод' : 'Редагування промокоду'}
            </h3>
            <form className={cl.formGrid} onSubmit={handleSubmit}>
              <InputData
                id="promo-code"
                type="text"
                label="Код"
                placeholder="SUMMER2026"
                required
                value={form.code}
                disabled={modalMode === 'edit'}
                onInput={(v) => setForm((f) => ({ ...f, code: String(v) }))}
              />
              {modalMode === 'edit' && (
                <p className={cl.fieldHint}>Код не змінюється після створення.</p>
              )}
              <InputOption
                label="Тип знижки"
                optionBasic=""
                options={[...PROMO_DISCOUNT_TYPES]}
                value={form.discountType}
                onChange={(v) => setForm((f) => ({ ...f, discountType: v }))}
              />
              <InputData
                id="promo-value"
                type="number"
                label={form.discountType === 'Percentage' ? 'Відсоток' : 'Сума (₴)'}
                required
                min={0}
                max={form.discountType === 'Percentage' ? 100 : undefined}
                value={form.discountValue}
                onInput={(v) => setForm((f) => ({ ...f, discountValue: String(v) }))}
              />
              <InputData
                id="promo-limit"
                type="number"
                label="Ліміт використань (порожньо — без обмежень)"
                min={1}
                value={form.usageLimit}
                onInput={(v) => setForm((f) => ({ ...f, usageLimit: String(v) }))}
              />
              <div className={cl.formRow2}>
                <InputOption
                  label="Без терміну дії"
                  optionBasic=""
                  options={ynLabels}
                  value={form.isInfinite ? 'Так' : 'Ні'}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, isInfinite: v === 'Так', expiresAt: v === 'Так' ? '' : f.expiresAt }))
                  }
                />
                <InputOption
                  label="Активний"
                  optionBasic=""
                  options={ynLabels}
                  value={form.isActive ? 'Так' : 'Ні'}
                  onChange={(v) => setForm((f) => ({ ...f, isActive: v === 'Так' }))}
                />
              </div>
              {!form.isInfinite && (
                <InputData
                  id="promo-expires"
                  type="datetime-local"
                  label="Діє до"
                  value={form.expiresAt}
                  onInput={(v) => setForm((f) => ({ ...f, expiresAt: String(v) }))}
                />
              )}
              <div>
                <span className={cl.fieldHint}>Обмеження за типом товару (якщо нічого не обрано — усі типи)</span>
                <div className={cl.typesGrid}>
                  {PROMO_PRODUCT_TYPES.map((t) => (
                    <label key={t} className={cl.typeLabel}>
                      <input
                        type="checkbox"
                        checked={form.types[t]}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            types: { ...f.types, [t]: !f.types[t] },
                          }))
                        }
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className={cl.formRow2}>
                <InputData
                  id="promo-min"
                  type="number"
                  label="Мін. ціна товару (₴)"
                  min={0}
                  value={form.minProductPrice}
                  onInput={(v) => setForm((f) => ({ ...f, minProductPrice: String(v) }))}
                />
                <InputData
                  id="promo-max"
                  type="number"
                  label="Макс. ціна товару (₴)"
                  min={0}
                  value={form.maxProductPrice}
                  onInput={(v) => setForm((f) => ({ ...f, maxProductPrice: String(v) }))}
                />
              </div>
              {submitError && <p className={cl.fieldHint}>{submitError}</p>}
              <div className={cl.modalActions}>
                <Button
                  type="button"
                  variant="submit-secondary"
                  text="Скасувати"
                  className={cl.modalCancelButton}
                  onClick={closeModal}
                />
                <Button
                  type="submit"
                  variant="submit-primary"
                  disabled={submitting}
                  text={submitting ? 'Збереження…' : 'Зберегти'}
                />
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )
    : null;

  if (isLoading && rows.length === 0) {
    return <div className={cl.empty}>Завантаження промокодів…</div>;
  }

  if (loadError) {
    return <div className={cl.empty}>Помилка: {loadError}</div>;
  }

  return (
    <section className={cl.layout}>
      <div className={cl.toolbar}>
        <h2 className={cl.title}>Промокоди</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={cl.counter}>{rows.length}</span>
          <Button type="button" onClick={openCreate}>
            Додати промокод
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={cl.empty}>Промокодів ще немає</div>
      ) : (
        <div className={cl.tableWrap}>
          <table className={cl.table}>
            <thead>
              <tr>
                <th>Код</th>
                <th>Знижка</th>
                <th>Використання</th>
                <th>Статус</th>
                <th>Термін</th>
                <th>Обмеження</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={cl.codeCell}>{row.code}</td>
                  <td className={cl.discountCell}>{formatDiscount(row)}</td>
                  <td>{formatUsage(row)}</td>
                  <td>
                    <span className={row.isActive ? cl.badgeActive : cl.badgeInactive}>
                      {row.isActive ? 'Активний' : 'Вимкнено'}
                    </span>
                  </td>
                  <td>
                    {row.isInfinite || !row.expiresAt ? (
                      'Без терміну'
                    ) : (
                      <>
                        до{' '}
                        {new Date(row.expiresAt).toLocaleString()}
                      </>
                    )}
                  </td>
                  <td>
                    <div className={cl.metaMuted}>
                      {row.applicableProductTypes?.length
                        ? row.applicableProductTypes.join(', ')
                        : 'Усі типи'}
                    </div>
                    {(row.minProductPrice != null || row.maxProductPrice != null) && (
                      <div className={cl.metaMuted}>
                        ціна:{' '}
                        {row.minProductPrice ?? '—'} — {row.maxProductPrice ?? '—'} ₴
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={cl.rowActions}>
                      <Button type="button" onClick={() => openEdit(row)}>
                        Змінити
                      </Button>
                      <Button
                        type="button"
                        variant="submit-secondary"
                        className={cl.modalCancelButton}
                        text={row.isActive ? 'Деактивувати' : 'Увімкнути'}
                        onClick={() => toggleActive(row)}
                        disabled={togglingIds[row.id]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal}
    </section>
  );
};

export default AdminPromoCodes;
