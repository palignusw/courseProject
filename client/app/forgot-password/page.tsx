'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './forgot-password.module.scss'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}auth/forgot-password`,
				{ email }
			)
			setSuccess('Ссылка для сброса отправлена! Проверьте почту.')
			setEmail('')
			setError('')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка при отправке письма')
			setSuccess('')
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.formBox}>
				<h2 className={styles.title}>Восстановление пароля</h2>

				{error && (
					<p className={`${styles.message} ${styles.error}`}>{error}</p>
				)}
				{success && (
					<p className={`${styles.message} ${styles.success}`}>{success}</p>
				)}

				<form onSubmit={handleSubmit} className={styles.form}>
					<input
						type='email'
						placeholder='Введите ваш email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
					<button type='submit'>Отправить ссылку</button>
				</form>
			</div>
		</div>
	)
}
