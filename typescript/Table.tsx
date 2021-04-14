import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
// @ts-ignore
import styles from './styles.module.css'

import { Scrollbar } from './Scrollbar'
import { Columns, Column } from './Columns'

const validateCurrentIndex = (items: TableItem[], index?: number) => {
	let i = index ?? 0
	if (items.length > 0) {
		if (i < 0)
			i = 0
		else if (i >= items.length)
			i = items.length - 1
	}
	return i
}

export type TableItem = {
	isSelected?: boolean
}

export type TableProps = {
	columns: Column[]
	onColumnsChanged: (columns: Column[])=>void
	onSort: (index:number, descending: boolean, isSubItem?: boolean)=>void
	items: TableItem[]
	currentIndex: number
	onItemsChanged: (items: TableItem[])=>void
	onCurrentIndexChanged: (index: number)=>void
	itemRenderer: (item: TableItem)=>JSX.Element[]
	theme?: string
	focused?: boolean
	onFocused?: (focused: boolean)=>void
	isColumnsHidden?: boolean
	onKeyDown?: (sevt: React.KeyboardEvent)=>boolean
	onDoubleClick?: (sevt: React.MouseEvent)=>void	
	heightChanged?: number	
}

export const Table = ({ 
		columns, 
		onColumnsChanged, 
		onSort,
		items,
		currentIndex,
		onItemsChanged, 
		onCurrentIndexChanged,
		itemRenderer,
		theme, 
		focused, 
		onFocused,
		isColumnsHidden,
		onKeyDown,
		onDoubleClick,
		heightChanged
 	}: TableProps) => {
	const table = useRef<HTMLDivElement>(null)
    const [height, setHeight ] = useState(0)
	const [columnHeight, setColumnHeight ] = useState(0)
	const [itemHeight, setItemHeight] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(1)
	const [innerTheme, setInnerTheme] = useState("")
	const [scrollbarActive, setScrollbarActive] = useState(false)
	const [scrollPosition, setScrollPosition] = useState(0)

	useLayoutEffect(() => scrollIntoView(currentIndex ?? 0), [items, currentIndex])

	const onColumnClick = (i: number) =>  {
		if (columns[i].isSortable) {
			let newState = [...columns].map((col, j) => {
                if (i != j)
                    col.columnsSort = undefined
                col.subItemSort = undefined
                return col
            })
			newState[i].columnsSort = columns[i].columnsSort == 1 ? 2 : 1
			onColumnsChanged(newState)
			onSort(i, columns[i].columnsSort == 2)
		}	
	}

    const onSubItemClick = (i: number) => {
		if (columns[i].isSortable) {
			let newState = [...columns].map(col => {
                col.columnsSort = undefined
                return col
            })
			newState[i].subItemSort = columns[i].subItemSort == 1 ? 2 : 1
			onColumnsChanged(newState)
			onSort(i, columns[i].subItemSort == 2, true)
		}	
	}

	const onWidthsChanged = (w: number[]) => {
		table.current?.focus()
		onColumnsChanged([...columns].map((col, i) => {
			col.width = w[i]
			return col
		}))
	}

	const handleResize = () => {
		const height = table.current!.clientHeight - columnHeight
		setHeight(height)
		if (height && itemHeight)
			 setItemsPerPage(Math.floor(height / itemHeight))
		if (items.length - scrollPosition < itemsPerPage) 
			setScrollPosition(Math.max(0, items.length - itemsPerPage))
	}
	useEffect(() => handleResize(), []) 
	useEffect(() => handleResize(), [columnHeight, heightChanged]) 
   	useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [itemHeight, items, itemsPerPage, scrollPosition])

	useEffect(() => {
		if (focused)
			table.current?.focus()
	}, [ focused])

	useLayoutEffect(() => {
		setScrollPosition(0)
		onItemsChanged( [...items])
	}, [itemHeight, itemsPerPage])

	useLayoutEffect(() => {
		const trh = table.current!.querySelector("thead tr")
		setColumnHeight(trh?.clientHeight ?? 0)
		const height = table.current!.clientHeight - (trh?.clientHeight ?? 0)
		setHeight(height)
		const tr = table.current!.querySelector("tbody tr")
		if (tr && tr.clientHeight) {
			const itemHeight = tr.clientHeight
			setItemHeight(itemHeight)
			const itemsPerPage = Math.floor(height / itemHeight)
			setItemsPerPage(itemsPerPage)
			if (items.length - scrollPosition < itemsPerPage) 
				setScrollPosition(Math.max(0, items.length - itemsPerPage))
		}
	}, [ innerTheme ])
	useLayoutEffect(() => {
		if (theme)
			setTimeout(() => setInnerTheme(theme), 150)
	}, [theme])

	useLayoutEffect(() => {
		if (!itemHeight) {
			const tr = table.current!.querySelector("tbody tr")
	 		if (tr && tr.clientHeight) {
				const itemHeight = tr.clientHeight
	 			setItemHeight(itemHeight)
				setItemsPerPage(Math.floor(height / itemHeight))
	 		}
		}
	}, [items])

	const scrollbarVisibilityChanged =(val: boolean) => setScrollbarActive(val)

	const onWheel = (sevt: React.WheelEvent) => {
		const evt = sevt.nativeEvent
		if (items.length > itemsPerPage) {
			var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
			let newPos = scrollPosition + delta
			if (newPos < 0)
				newPos = 0
			if (newPos > items.length - itemsPerPage) 
				newPos = items.length - itemsPerPage
				setScrollPosition(newPos)
		}        
	}			

	const onKeyDownEvent = (sevt: React.KeyboardEvent) => {
		const evt = sevt.nativeEvent
		if (onKeyDown && onKeyDown(sevt))
			return
		switch (evt.which) {
			case 33:
				pageUp()
				break
			case 34:
				pageDown()
				break             			
			case 35: // End
				if (!evt.shiftKey)
					end()
				break
				case 36: //Pos1
				if (!evt.shiftKey)
					pos1()
				break			
			case 38:
				upOne()
				break
			case 40:
				downOne()
				break
			default:
				return
		}
		sevt.preventDefault()
	}

	const end = () => setCurrentIndex(items.length - 1)
	const pos1 = () => setCurrentIndex(0)
	const pageDown = () =>
	setCurrentIndex((currentIndex ?? 0) < items.length - itemsPerPage + 1 
		? (currentIndex ?? 0) + itemsPerPage - 1
		: items.length - 1)
	const pageUp = () => setCurrentIndex(currentIndex ?? 0 > itemsPerPage - 1 ? (currentIndex ?? 0) - itemsPerPage + 1: 0)	
	const upOne = () => setCurrentIndex((currentIndex ?? 0) - 1)
	const downOne = () => setCurrentIndex((currentIndex ?? 0) + 1)

	const setCurrentIndex = (index?: number) => {
		const i = validateCurrentIndex(items, index)
		if (i != currentIndex) 
			onCurrentIndexChanged(i)
	}

	const scrollIntoView = (index: number) => {
		if (index < scrollPosition) {
			setScrollPosition(index)
			handleResize()
		}
		if (index > scrollPosition + itemsPerPage - 1) 
			setScrollPosition(index - itemsPerPage + 1)
	} 

	const onMouseDown = (sevt: React.MouseEvent) => {
		const evt = sevt.nativeEvent
		const el = evt.target as HTMLElement
		const tr = el.closest("tbody tr")
		if (tr) {
			const currentIndex = 
				Array
					.from(tr.parentElement!.children)
			 		.findIndex(n => n == tr)
			 	+ scrollPosition
			if (currentIndex != -1)
				setCurrentIndex(currentIndex)
		}		
	}

	const onFocus = (isFocused: boolean) => {
		if (onFocused)
			onFocused(isFocused)
	}

    const jsxReturner = (item: TableItem, index: number) => (
		<tr key={index} 
			className={`${index == currentIndex ? styles.isCurrent : ''} ${item.isSelected ? styles.isSelected : ''} ${item.isSelected ? "tableItemReactIsSelected" : ''}`}> 
			{itemRenderer(item)}
		</tr> 
	)
    
    const renderItems = () => { 
		if (itemsPerPage) {
			return Array.from(Array(Math.min(itemsPerPage + 1, Math.max(items.length - scrollPosition, 0)))
				.keys())        
				.map(i => jsxReturner(items[i + scrollPosition], i + scrollPosition))
		}
	}

	return (
		<div className={styles.tableviewRoot} 
			tabIndex={1}
			ref={table} 
			onFocus={()=>onFocus(true)}
			onBlur={()=>onFocus(false)}
			onKeyDown={onKeyDownEvent}
			onWheel={onWheel}>
			<table className={`${styles.table} ${scrollbarActive ? '' : styles.noScrollbar}`}
				onMouseDown={onMouseDown}>
				<Columns 
                    cols={columns} 
					isHidden={isColumnsHidden}
                    onColumnClick={onColumnClick} 
                    onSubItemClick={onSubItemClick}
                    onWidthsChanged={onWidthsChanged}
                />
                <tbody onDoubleClick={onDoubleClick}>
					{renderItems()}
				</tbody>
			</table>
			<div className={styles.tableScrollbar} style={{top: columnHeight + 'px'}}>
				{ <Scrollbar 
					height={height} 
					itemsPerPage={itemsPerPage} 
					count={items.length} 
					position={scrollPosition}
					positionChanged={setScrollPosition}
					visibilityChanged={scrollbarVisibilityChanged} />  }
			</div>
		</div>
	)
}
