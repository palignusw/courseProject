'use client'

import { useEffect, useState } from 'react'
import styles from './LoginPage.module.scss'
import { getToken, setToken } from '../lib/token'
import { useRouter } from 'next/navigation'
import apiInstance from '../lib/apiInstance'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)

	const router = useRouter()

	useEffect(() => {
		const token = getToken()
		if (token) {
			router.replace('/')
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const response = await apiInstance.post('/auth/login', {
				email,
				password,
			})

			const data = response.data
			setToken(data.access_token, rememberMe)

			router.push('/')
		} catch (err: any) {
			const message =
				err.response?.data?.message || err.message || 'Login failed'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.formSection}>
				<h1 className={styles.logo}>Itransition Project</h1>
				<p className={styles.subtitle}>Sign in to continue</p>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div>
						<label>Email</label>
						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='any@gmail.com'
							required
						/>
					</div>
					<div>
						<label>Password</label>
						<input
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder='********'
							required
						/>
					</div>

					<div className={styles.options}>
						<label>
							<input
								type='checkbox'
								checked={rememberMe}
								onChange={() => setRememberMe(prev => !prev)}
							/>
							<div className={styles.rememberMe}>Remember me</div>
						</label>
						<a href='/forgot-password'>Forgot password?</a>
					</div>

					{error && <p style={{ color: 'red' }}>{error}</p>}

					<button type='submit' disabled={loading}>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>

					<p className={styles.linkText}>
						Don’t have an account? <a href='/register'>Sign up</a>
					</p>
				</form>
			</div>
			<div className={styles.imageSection}></div>
		</div>
	)
}
