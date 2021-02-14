import React, { useState } from 'react'
// @ts-ignore
import styles from './styles.module.css'

export type Column = {
	name: string
	subItem?: string
	width?: number,
	columnsSort?: number,
	subItemSort?: number,
	isSortable?: boolean
}

type ColumnsProps = {
	cols: Column[], 
	onColumnClick: (column: number)=>void, 
	onSubItemClick: (column: number)=>void, 
	onWidthsChanged: (widths: number[])=>void	
}

export const Columns = ({ cols, onColumnClick, onSubItemClick, onWidthsChanged }: ColumnsProps) => {
	const [draggingReady, setDraggingReady] = useState(false)

	const onMouseMove = (sevt: React.MouseEvent) => {
		const evt = sevt.nativeEvent
		const th = evt.target as HTMLElement
		if (th.nodeName == "TH") {
			const thWidth = th.clientWidth + th.clientLeft
			const mouseX = evt.offsetX + th.clientLeft
			const trRect = th.parentElement!.getBoundingClientRect()
			const absoluteRight = trRect.width + trRect.x
			setDraggingReady((mouseX < 3 || mouseX > thWidth - 4) 
				&& (evt.pageX - trRect.x > 4)
				&& (evt.pageX < absoluteRight - 4))
		}
		else
			setDraggingReady(false)

	}

	const onMouseDown = (sevt: React.MouseEvent) => {
		if (draggingReady) {
			const evt = sevt.nativeEvent
			const th = evt.target as HTMLElement
			const mouseX = evt.offsetX + th.clientLeft
			const dragleft = mouseX < 3

			const startDragPosition = evt.pageX
			const targetColumn = th.closest("th")!
			const ths = Array.from(targetColumn.parentElement!.children) as HTMLElement[]

			const currentHeader = dragleft ? targetColumn.previousElementSibling as HTMLElement : targetColumn
			if (!currentHeader)
				return
			const nextHeader = currentHeader.nextElementSibling as HTMLElement
			if (!nextHeader)
				return

			const currentLeftWidth = currentHeader.offsetWidth
			const sumWidth = currentLeftWidth + nextHeader.offsetWidth

			const onmove = (evt: globalThis.MouseEvent) => {
				document.body.style.cursor = 'ew-resize'
				let diff = evt.pageX - startDragPosition
				if (currentLeftWidth + diff < 15)
					diff = 15 - currentLeftWidth
				else if (diff > sumWidth - currentLeftWidth - 15)
					diff = sumWidth - currentLeftWidth - 15

				const getCombinedWidth = (column: HTMLElement, nextColumn: HTMLElement) => {
					const firstWidth = 
						column.style.width
						? parseFloat(column.style.width.substr(0, column.style.width.length - 1))
						: 100 / cols.length
					const secondWidth = 
						nextColumn.style.width
						? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1))
						: 100 / cols.length
					return firstWidth + secondWidth
				}                        

				const combinedWidth = getCombinedWidth(currentHeader, nextHeader)

				let leftWidth = currentLeftWidth + diff
				let rightWidth = sumWidth - currentLeftWidth - diff
				const factor = combinedWidth / sumWidth
				leftWidth = leftWidth * factor
				rightWidth = rightWidth * factor

				currentHeader.style.width = leftWidth + '%'
				nextHeader.style.width = rightWidth + '%'
				evt.preventDefault()
			}

			const onup = () => {
				const getWidths = () => {
					const ths = Array.from(targetColumn.parentElement!.children) as HTMLElement[]
				 	return ths.map(th => 
				 		th.style.width 
						 	? parseFloat(th.style.width.substr(0, th.style.width.length - 1))
							: 100 / cols.length
				 	)
				}

				window.removeEventListener('mousemove', onmove)
				window.removeEventListener('mouseup', onup)
				document.body.style.cursor = ''
				
				onWidthsChanged(getWidths())
			}

			window.addEventListener('mousemove', onmove)
			window.addEventListener('mouseup', onup)
			evt.preventDefault()
			evt.stopPropagation()
		}		
	}

	const getSorting = (col: Column) => 
		col.columnsSort == 1 
		? styles.sortAscending 
		: col.columnsSort == 2 
		? styles.sortDescending 
		: ''

	const getSubSorting	= (col: Column) =>
		col.subItemSort == 1
		? styles.sortAscending 
		: col.subItemSort == 2 
		? styles.sortDescending 
		: ''

	return (
		<thead>
			<tr className={draggingReady ? styles.pointerEw : ''}>
				{cols.map((col, i) => (
					<th onMouseMove={onMouseMove}
						onMouseDown={onMouseDown} 
						key={i} 
						className={`${styles.columnTh} ${col.isSortable ? styles.isSortable : ''}`}
						style={col.width ? {width: col.width + '%'} : {}} >
							<div className={styles.column} onClick={() => onColumnClick(i)}>
								<div className={`${styles.maincol} ${getSorting(col)}`}>
									{col.name}
								</div>
								{col.subItem 
									? (
										<div 
											onClick={evt => {
												onSubItemClick(i)
												evt.stopPropagation()
											}}
											className= {`${getSubSorting(col)}`}>
											{col.subItem}
										</div>
									)
									:  ""}
							</div>
					</th> 
				))}
			</tr>
		</thead>
	)
}
