'use client';

import {
  clearError,
  getTokensAsync,
  loginAsync,
} from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import styles from './signin.module.css';

export default function Signin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Очищаем ошибки при монтировании компонента
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    // Валидация
    if (!email || !password) {
      setValidationError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      // Вход в систему
      await dispatch(loginAsync({ email, password })).unwrap();

      // Получаем токены
      await dispatch(getTokensAsync({ email, password })).unwrap();

      // Перенаправляем на главную страницу
      router.push('/');
    } catch (err) {
      // Ошибка уже обработана в Redux
      console.error('Ошибка входа:', err);
    }
  };

  const displayError = validationError || error;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.containerEnter}>
          <div className={styles.modal__block}>
            <form className={styles.modal__form} onSubmit={handleSubmit}>
              <Link href="/">
                <div className={styles.modal__logo}>
                  <Image
                    src="/img/logo_modal.png"
                    alt="logo"
                    width={140}
                    height={21}
                  />
                </div>
              </Link>
              <input
                className={classNames(styles.modal__input, styles.login)}
                type="email"
                name="email"
                placeholder="Почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <input
                className={classNames(styles.modal__input)}
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {displayError && (
                <div className={styles.errorContainer}>
                  <div>{displayError}</div>
                </div>
              )}
              <button
                type="submit"
                className={styles.modal__btnEnter}
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
              <Link href="/signup" className={styles.modal__btnSignup}>
                Зарегистрироваться
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
