import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import cl from '@/utils/styles/modules/PopupEditUser.module.scss';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import InputOption from '@packages/shared/src/components/UI/form-controls/InputOption/InputOption';
import Button from '@packages/shared/src/components/UI/Button/Button';
import Cookies from '@packages/shared/src/utils/cookies';
import { api } from '@packages/shared/src/routes/api';

const ROLE_OPTIONS = ['admin', 'user', 'manager', 'support', 'system'] as const;

function normalizeRole(role: UserDataType['role']): string {
  if (Array.isArray(role)) return role[0] ?? 'user';
  if (typeof role === 'string') return role;
  return 'user';
}

type PopupEditUserProps = {
  user: UserDataType;
  onClose: () => void;
  onSaved: () => void;
};

const PopupEditUser: React.FC<PopupEditUserProps> = ({ user, onClose, onSaved }) => {
  const cookies = useMemo(() => new Cookies(), []);
  const initialRole = useMemo(() => normalizeRole(user.role), [user.role]);

  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    setName(user.name ?? '');
    setEmail(user.email ?? '');
    setPassword('');
    setRole(normalizeRole(user.role));
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body: Record<string, string> = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    };
    if (password.trim()) {
      body.password = password.trim();
    }

    try {
      const res = await fetch(
        `http://localhost:4005/${api}/admin/users/${encodeURIComponent(String(user.id))}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${cookies.getCookie('token')}`,
          },
          body: JSON.stringify(body),
        },
      );

      const text = await res.text();
      let data: { success?: boolean; message?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        /* ignore */
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Помилка ${res.status}`);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти');
    } finally {
      setSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className={cl.overlay} role="presentation" onMouseDown={onClose}>
      <div
        className={cl.popup}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        onMouseDown={(ev) => ev.stopPropagation()}
      >
        <h2 id="edit-user-title" className={cl.title}>
          Редагувати користувача
        </h2>
        <p className={cl.meta}>
          ID: <span>{user.id}</span>
        </p>

        <form className={cl.form} onSubmit={onSubmit}>
          {error ? <p className={cl.error}>{error}</p> : null}

          <InputData
            id="edit-user-name"
            label="Ім’я (унікальне в системі)"
            type="text"
            placeholder="Ім’я"
            value={name}
            onInput={setName}
            required
          />
          <InputData
            id="edit-user-email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onInput={setEmail}
            required
          />
          <InputData
            id="edit-user-password"
            label="Новий пароль"
            type="password"
            placeholder="Залиште порожнім, щоб не змінювати"
            value={password}
            onInput={setPassword}
            required={false}
          />
          <InputOption
            label="Роль"
            optionBasic=""
            options={[...ROLE_OPTIONS]}
            value={role}
            onChange={setRole}
            required
            includeBlankOption={false}
          />

          <div className={cl.modalActions}>
            <Button
              type="button"
              variant="submit-secondary"
              text="Скасувати"
              className={cl.modalCancelButton}
              onClick={onClose}
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
    document.getElementById('modal-root')!,
  );
};

export default PopupEditUser;
