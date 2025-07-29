'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './reset-password.module.scss'
import apiInstance from '../lib/apiInstance'

function ResetPasswordInner() {
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
			setError('token is required')
			return
		}

		if (password !== confirm) {
			setError('password dont match ')
			return
		}

		try {
			await apiInstance.post('/auth/reset-password', {
				token,
				password,
			})

			setSuccess('password changed successfully')
			setTimeout(() => router.push('/login'), 2000)
		} catch (err: any) {
			setError(err.response?.data?.message || 'error resetting password')
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.formBox}>
				<h2 className={styles.title}>change password</h2>

				{error && (
					<p className={`${styles.message} ${styles.error}`}>{error}</p>
				)}
				{success && (
					<p className={`${styles.message} ${styles.success}`}>{success}</p>
				)}

				<form onSubmit={handleSubmit} className={styles.form}>
					<input
						type='password'
						placeholder='New password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<input
						type='password'
						placeholder='Confirm password'
						value={confirm}
						onChange={e => setConfirm(e.target.value)}
						required
					/>
					<button type='submit'>Change password</button>
				</form>
			</div>
		</div>
	)
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ResetPasswordInner />
		</Suspense>
	)
}
