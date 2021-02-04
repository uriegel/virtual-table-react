import React from 'react'
import styles from './styles.module.css'

export const Columns = ({ text }) => {
	const cols = ["Eine Spalte", "Zweite. Spalte", "Letzte Spalte"]
  	return (
		<thead>
			<tr>
				{cols.map((col, i) => (<th key={i}>{col}</th> ))}
			</tr>
		</thead>
	)
}

