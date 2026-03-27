'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import styles from './signin.module.css';

import {
  clearError,
  getTokensAsync,
  loginAsync,
  restoreAuth,
} from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    if (!formState.password.trim()) {
      errors.push('Введите пароль.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationErrors([]);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      dispatch(clearError());
      setSubmitError(null);
      await dispatch(loginAsync(formState)).unwrap();
      await dispatch(getTokensAsync(formState)).unwrap();
      router.replace('/');
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else if (typeof err === 'string') {
        setSubmitError(err);
      } else {
        setSubmitError('Не удалось выполнить вход. Попробуйте позже.');
      }
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
              className={`${styles.modal__input} ${styles.login}`}
              type="email"
              name="email"
              placeholder="Email"
              value={formState.email}
              onChange={(event) => handleChange('email', event.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={formState.password}
              onChange={(event) => handleChange('password', event.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
              required
            />

            {(validationErrors.length > 0 || submitError || error) && (
              <div className={styles.errorContainer}>
                {validationErrors.map((message) => (
                  <span key={message}>{message}</span>
                ))}
                {submitError && <span>{submitError}</span>}
                {!submitError && !validationErrors.length && error && (
                  <span>{error}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              className={styles.modal__btnEnter}
              disabled={isLoading}
            >
              {isLoading ? 'Входим...' : 'Войти'}
            </button>
            <Link href="/signup" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
