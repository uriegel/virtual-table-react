import React from 'react'
import styles from './styles.module.css'

export const Columns = ({ cols }) => {
  	return (
		<thead>
			<tr>
				{cols.map((col, i) => (<th key={i}>{col[1]}</th> ))}
			</tr>
		</thead>
	)
}

