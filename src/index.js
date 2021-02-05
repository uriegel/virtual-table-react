import React from 'react'
import styles from './styles.module.css'

export const Columns = ({ cols }) => {
  	return (
		<thead>
			<tr className={styles.pointerEw}>
				{cols.map((col, i) => (
					<th key={i} className={styles.column} >
						{col[1]}
					</th> 
				))}
			</tr>
		</thead>
	)
}

