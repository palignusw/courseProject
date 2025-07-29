'use client'

import { useState } from 'react'
import styles from './forgot-password.module.scss'
import apiInstance from '../lib/apiInstance'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			await apiInstance.post('/auth/forgot-password', { email })
			setSuccess('confirmation Link sent to your email')
			setEmail('')
			setError('')
		} catch (err: any) {
			setError(err.response?.data?.message || 'error sending confirmation')
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
						placeholder='Text your email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
					<button type='submit'>Send link</button>
				</form>
			</div>
		</div>
	)
}
