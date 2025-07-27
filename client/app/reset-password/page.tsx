'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import styles from './reset-password.module.scss'

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!token) {
			setError('Токен отсутствует в ссылке')
			return
		}

		if (password !== confirm) {
			setError('Пароли не совпадают')
			return
		}

		try {
			await axios.post('http://localhost:3001/auth/reset-password', {
				token,
				password,
			})

			setSuccess('Пароль успешно сброшен! Перенаправляем...')
			setTimeout(() => router.push('/login'), 2000)
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка при сбросе пароля')
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.formBox}>
				<h2 className={styles.title}>Сброс пароля</h2>

				{error && (
					<p className={`${styles.message} ${styles.error}`}>{error}</p>
				)}
				{success && (
					<p className={`${styles.message} ${styles.success}`}>{success}</p>
				)}

				<form onSubmit={handleSubmit} className={styles.form}>
					<input
						type='password'
						placeholder='Новый пароль'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<input
						type='password'
						placeholder='Подтвердите пароль'
						value={confirm}
						onChange={e => setConfirm(e.target.value)}
						required
					/>
					<button type='submit'>Сбросить пароль</button>
				</form>
			</div>
		</div>
	)
}
