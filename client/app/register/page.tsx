'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Register.module.scss'
import apiInstance from '../lib/apiInstance'

export default function Register() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await apiInstance.post('/users', {
				email,
				password,
				name,
			})
			router.push('/login')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка регистрации')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.formSection}>
				<h1 className={styles.logo}>THE APP</h1>
				<p className={styles.subtitle}>Create your account</p>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div>
						<label>Name</label>
						<input
							type='text'
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='Your name'
							required
						/>
					</div>
					<div>
						<label>Email</label>
						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='example@mail.com'
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

					{error && <p className={styles.error}>{error}</p>}

					<button type='submit' disabled={loading}>
						{loading ? 'Registering...' : 'Register'}
					</button>

					<p className={styles.linkText}>
						Already have an account? <a href='/login'>Sign in</a>
					</p>
				</form>
			</div>
		</div>
	)
}
