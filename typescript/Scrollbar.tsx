import React, { useState, useRef, useEffect } from 'react'
// @ts-ignore
import styles from './styles.module.css'

type TriangleProps = {
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

type ScrollbarProps = {
	height: number, 
	itemsPerPage: number, 
	count: number, 
	position: number, 
	positionChanged: (pos: number)=>void
	visibilityChanged?: (vidible: boolean)=>void
}

export const Scrollbar = ({ height, itemsPerPage, count, position, positionChanged, visibilityChanged }: ScrollbarProps) => {
	const scrollbarElement = useRef(null as HTMLInputElement | null)
	const [timeout, stTimeout] = useState(0)
	const [interval, stInterval] = useState(0)
	const [visibility, setVisibility] = useState(false)

	useEffect(() => {
		const val = getRange(count, itemsPerPage) > 1
		if (val != visibility) {
			setVisibility(val)
			if (visibilityChanged)
				visibilityChanged(val)
		}
	})

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
			window.removeEventListener('mousemove', onmove, true)
			window.removeEventListener('mouseup', onup, true)
		}
		window.addEventListener('mousemove', onmove, true)
		window.addEventListener('mouseup', onup, true)

		sevt.stopPropagation()
	}

	return (
		<div className={`${styles.scrollbarContainer} ${visibility ? '' : styles.inactive}`}
				style={{height: height + 'px'}} >
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
