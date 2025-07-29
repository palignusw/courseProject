'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '../app/lib/token'
import styles from './page.module.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import apiInstance from './lib/apiInstance'
import axios from 'axios'

type User = {
	id: number
	name: string
	email: string
	isBlocked: boolean
	lastLogin: string | null
}

dayjs.extend(relativeTime)

export default function Home() {
	const [users, setUsers] = useState<User[]>([])
	const [selectedIds, setSelectedIds] = useState<number[]>([])
	const router = useRouter()

	const handleLogout = () => {
		removeToken()
		router.push('/login')
	}

	const fetchUsers = async () => {
		const token = getToken()
		if (!token) return router.push('/login')

		try {
			const res = await apiInstance.get('/users', {
				headers: { Authorization: 'Bearer ' + token },
			})
			setUsers(res.data)
		} catch {
			removeToken()
			router.push('/login')
		}
	}

	const handleAction = async (action: 'block' | 'unblock' | 'delete') => {
		const token = getToken()
		if (!token) return

		if (selectedIds.length === 0) return

		const url =
			`${process.env.NEXT_PUBLIC_API_URL}/users` +
			(action === 'delete' ? '' : `/${action}`)
		const method = action === 'delete' ? 'delete' : 'patch'

		await axios({
			url,
			method,
			data: { ids: selectedIds },
			headers: { Authorization: 'Bearer ' + token },
		})
		setSelectedIds([])
		fetchUsers()
	}

	const isChecked = (id: number) => selectedIds.includes(id)

	const toggleCheckbox = (id: number) => {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
		)
	}

	const toggleSelectAll = () => {
		if (isAllSelected) {
			setSelectedIds([])
		} else {
			setSelectedIds(users.map(user => user.id))
		}
	}
	const isAllSelected =
		users.length > 0 && users.every(user => selectedIds.includes(user.id))

	useEffect(() => {
		fetchUsers()
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles.topBar}>
				<button
					className={`${styles.button} ${styles.logout}`}
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
			<h2 className={styles.title}>Users</h2>
			<div className={styles.buttonGroup}>
				<button
					className={`${styles.button} ${styles.block}`}
					onClick={() => handleAction('block')}
				>
					Block
				</button>
				<button
					className={`${styles.button} ${styles.unblock}`}
					onClick={() => handleAction('unblock')}
				>
					Unblock
				</button>
				<button
					className={`${styles.button} ${styles.delete}`}
					onClick={() => handleAction('delete')}
				>
					Delete
				</button>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.firstColumn}>
							<label className={styles.checkbox}>
								<input
									type='checkbox'
									checked={isAllSelected}
									onChange={toggleSelectAll}
								/>
								<span className={styles.checkmark}></span>
							</label>
						</th>
						<th>Name</th>
						<th>Email</th>
						<th>Blocked</th>
						<th>Last Login</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id}>
							<td className={styles.firstColumn}>
								<label className={styles.checkbox}>
									<input
										type='checkbox'
										checked={isChecked(user.id)}
										onChange={() => toggleCheckbox(user.id)}
									/>
									<span className={styles.checkmark}></span>
								</label>
							</td>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.isBlocked ? 'Yes' : 'No'}</td>
							<td>{user.lastLogin ? dayjs(user.lastLogin).fromNow() : '-'}</td>
						</tr>
					))}
				</tbody>
			</table>

			{users.length > 0 && (
				<div className={styles.selectAllMobile}>
					<label className={styles.checkbox}>
						<input
							type='checkbox'
							checked={isAllSelected}
							onChange={toggleSelectAll}
						/>
						<span className={styles.checkmark}></span> Select All
					</label>
				</div>
			)}
			<div className={styles.mobileCards}>
				{users.map(user => (
					<div className={styles.card} key={user.id}>
						<label className={styles.checkbox}>
							<input
								type='checkbox'
								checked={isChecked(user.id)}
								onChange={() => toggleCheckbox(user.id)}
							/>
							<span className={styles.checkmark}></span>
						</label>

						<p>
							<span>Name:</span> {user.name}
						</p>
						<p>
							<span>Email:</span> {user.email}
						</p>
						<p>
							<span>Blocked:</span> {user.isBlocked ? 'Yes' : 'No'}
						</p>
						<p>
							<span>Last Login:</span>{' '}
							{user.lastLogin ? dayjs(user.lastLogin).fromNow() : '-'}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
