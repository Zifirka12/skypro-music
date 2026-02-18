'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import styles from './signup.module.css';

import {
  clearError,
  getTokensAsync,
  loginAsync,
  restoreAuth,
  signUpAsync,
} from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [formState, setFormState] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!formState.email.trim()) {
      errors.push('Введите email.');
    } else if (!emailPattern.test(formState.email.trim())) {
      errors.push('Укажите корректный email.');
    }

    if (formState.password.length < 6) {
      errors.push('Пароль должен содержать не менее 6 символов.');
    }

    if (formState.password !== formState.confirmPassword) {
      errors.push('Пароли не совпадают.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (
    field: keyof typeof initialFormState,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationErrors([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const username =
      formState.email.split('@')[0]?.trim() || `music_user_${Date.now()}`;

    try {
      dispatch(clearError());
      await dispatch(
        signUpAsync({
          username,
          email: formState.email.trim(),
          password: formState.password,
        }),
      ).unwrap();
      await dispatch(
        loginAsync({
          email: formState.email.trim(),
          password: formState.password,
        }),
      ).unwrap();
      await dispatch(
        getTokensAsync({
          email: formState.email.trim(),
          password: formState.password,
        }),
      ).unwrap();
      setFormState(initialFormState);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось завершить регистрацию. Попробуйте позже.';
      setValidationErrors([message]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <div className={styles.modal__logo}>
              <Image
                src="/img/logo.png"
                alt="Skypro Music"
                width={140}
                height={21}
              />
            </div>
            <input
              className={styles.modal__input}
              type="email"
              name="email"
              placeholder="Почта"
              value={formState.email}
              onChange={(event) => handleChange('email', event.target.value)}
              disabled={isLoading}
              autoComplete="email"
              required
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={formState.password}
              onChange={(event) => handleChange('password', event.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={formState.confirmPassword}
              onChange={(event) =>
                handleChange('confirmPassword', event.target.value)
              }
              disabled={isLoading}
              autoComplete="new-password"
              required
            />

            {(validationErrors.length > 0 || error) && (
              <div className={styles.errorContainer}>
                {validationErrors.map((message) => (
                  <span key={message}>{message}</span>
                ))}
                {!validationErrors.length && error && <span>{error}</span>}
              </div>
            )}

            <button
              type="submit"
              className={styles.modal__btnSignupEnt}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрируемся...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
