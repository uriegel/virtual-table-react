import React, { useState, useRef } from 'react'
// @ts-ignore
import styles from './styles.module.css'

interface TriangleProps {
	down?: boolean
	onClick: ()=>void
}

const Triangle = ({down, onClick}: TriangleProps) => (
	<svg className={styles.svg} viewBox="0 0 100 100" onMouseDown={onClick} >
		{down
			? <path className={styles.button} d="M 80,30 50,70 20,30 Z" />
			: <path className={styles.button} d="M 20,70 50,30 80,70 Z" / >
		}
    </svg>
)

export interface ScrollbarProps {
	height: number, 
	itemsPerPage: number, 
	count: number, 
	position: number, 
	positionChanged: (pos: number)=>void
}

export const Scrollbar = ({ height, itemsPerPage, count, position, positionChanged }: ScrollbarProps) => {
	const scrollbarElement = useRef(null as HTMLInputElement | null)
	const [timeout, stTimeout] = useState(0)
	const [interval, stInterval] = useState(0)

	const getGripHeight = (height: number, itemsPerPage: number, totalCount: number) => 
		scrollbarElement.current
		? Math.max(scrollbarElement.current.clientHeight * (itemsPerPage / totalCount), 5)
		: 0
	
	const getGripTop = (position: number, totalCount: number, itemsPerPage: number) => 
		scrollbarElement.current
		? (scrollbarElement.current.clientHeight - getGripHeight(0, itemsPerPage, totalCount)) * (position / (getRange(totalCount, itemsPerPage) -1))
		: 0

	const getRange = (totalCount: number, itemsPerPage: number) =>  Math.max(0, totalCount - itemsPerPage) + 1

	const mouseRepeat = (action: (pos: number)=>void) => {
		action(position)
		let interval = 0
		const timeout = setTimeout(() => interval = setInterval(action, 50), 600)
		const mouseUp = () => {
			window.removeEventListener("mouseup", mouseUp)
			clearTimeout(timeout)
			if (interval)
				clearInterval(interval)
		}
		window.addEventListener("mouseup", mouseUp)
	}

	const onUp = () => {
		let newPosition = position
		mouseRepeat(() => positionChanged(Math.max(--newPosition, 0)))
	}
	
	const onDown = () => {
		let newPosition = position
		mouseRepeat(() => positionChanged(Math.min(++newPosition, getRange(count, itemsPerPage) - 1)))
	}

	const onPageMouseDown = (sevt: React.MouseEvent) => {
		let newPosition = position
		const gripHeight = getGripHeight(0, itemsPerPage, count)				
		const evt = sevt.nativeEvent
		const range = getRange(count, itemsPerPage)
		const isUp = evt.offsetY <= getGripTop(newPosition, count, itemsPerPage)
		const action = isUp 
			? () => {
				const gripTop = getGripTop(newPosition, count, itemsPerPage)
				if (evt.offsetY < gripTop)
					newPosition -= itemsPerPage - 1
				positionChanged(Math.max(newPosition, 0))
			}
			: () => {
				const gripTop = getGripTop(newPosition, count, itemsPerPage)
				if (evt.offsetY > gripTop + gripHeight)
					newPosition += itemsPerPage - 1
				positionChanged(Math.min(range -1, newPosition))
			}
		mouseRepeat(action)
	}

	const onGripDown = (sevt: React.MouseEvent) => {
		const evt = sevt.nativeEvent
		const gripTop = getGripTop(position, count, itemsPerPage)
		const gripHeight = getGripHeight(0, itemsPerPage, count)				
		const startPos = evt.y - gripTop
		const range = height - gripHeight
		const maxPosition = count - itemsPerPage
		const onmove = (evt: globalThis.MouseEvent) => {
			const delta = evt.y - startPos
			const factor = Math.min(1, (Math.max(0, delta * 1.0 / range)))
			positionChanged(Math.floor(factor * maxPosition))
			evt.preventDefault()
			evt.stopPropagation()
		}
		const onup = () => {
			window.removeEventListener('mousemove', e => onmove(e), true)
			window.removeEventListener('mouseup', onup, true)
		}
		window.addEventListener('mousemove', onmove, true)
		window.addEventListener('mouseup', onup, true)

		sevt.stopPropagation()
	}

	return (
		<div className={`${styles.scrollbarContainer} ${(getRange(count, itemsPerPage) <= 1) ? styles.inactive : ''}`}>
			
			<Triangle onClick={onUp} />
			<div ref={scrollbarElement} className={styles.scrollbar} 
				onMouseDown={onPageMouseDown} >
				<div className={styles.grip} onMouseDown={onGripDown} style={{
				    top: getGripTop(position, count, itemsPerPage) + 'px',
					height: getGripHeight(height, itemsPerPage, count) + 'px'
				}} >
				</div>
			</div>
			<Triangle down={true} onClick={onDown}/>
		</div>
	)
	
}


//======================================================================================

export interface Column {
	name: string
	subItem?: string
	columnsSort?: number,
	subItemSort?: number,
	isSortable?: boolean
}

export interface ColumnsProps {
	cols: Column[], 
	onColumnClick: (column: number)=>void, 
	onSubItemClick: (column: number)=>void, 
	onWidthsChanged: (widths: string[])=>void	
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
				 	return ths.map(th => {
				 		let width = th.style.width
				 		if (!width)
				 			width = (100 / cols.length) + '%'
				 		return width
				 	})
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
						key={i} className={`${styles.columnTh} ${col.isSortable ? styles.isSortable : ''}`}>
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

// TODO: Columns: width OnUp
// TODO: Columns: style blue
// TODO: Scrollbar style yaru and blue

// TODO: VirtualTable

// TODO: Scrollbar on/off ... ellipse