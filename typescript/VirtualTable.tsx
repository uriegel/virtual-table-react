import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
// @ts-ignore
import styles from './styles.module.css'

import { Scrollbar } from './Scrollbar'
import { Columns, Column } from './Columns'


export type VirtualTableItem = {
	index: number
}

export type VirtualTableItems = {
    count: number
    getItem: (i: number)=>VirtualTableItem
}

export type VirtualTableProps = {
	columns: Column[]
	onColumnsChanged: (columns: Column[])=>void
	onSelectedIndexChanged?: (index: number)=>void
	onSort: (index:number, descending: boolean, isSubItem?: boolean)=>void
	items: VirtualTableItems 
	itemRenderer: (item: VirtualTableItem)=>JSX.Element[]
	theme?: string
	focused?: boolean
	onFocused?: (focused: boolean)=>void
}

export const VirtualTable = ({ columns, onColumnsChanged, onSort, items, itemRenderer, theme, onSelectedIndexChanged, focused, onFocused }: VirtualTableProps) => {
	const virtualTable = useRef<HTMLDivElement>(null)
    const [height, setHeight ] = useState(0)
	const [columnHeight, setColumnHeight ] = useState(0)
    const [itemsPerPage, setItemsPerPage ] = useState(0)
    const [position, setPosition] = useState(0)
	const [itemHeight, setItemHeight] = useState(60)
	const [innerTheme, setInnerTheme] = useState("")
	const [scrollbarActive, setScrollbarActive] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)

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
			onSort(i, columns[i].columnsSort == 2, true)
		}	
	}

	const onWidthsChanged = (w: number[]) => {
		virtualTable.current?.focus()
		onColumnsChanged([...columns].map((col, i) => {
			col.width = w[i]
			return col
		}))
	}

    useEffect(() => {
        const handleResize = () => {
            setHeight(virtualTable.current!.clientHeight - columnHeight)
            setItemsPerPage(Math.floor(height / itemHeight))
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    })

	useEffect(() => {
		if (focused)
			virtualTable.current?.focus()
	}, [ focused])

	useLayoutEffect(() => {
		const trh = virtualTable.current!.querySelector("tr")
		const tr = virtualTable.current!.querySelector("tbody tr")
		if (tr && tr.clientHeight)
			setItemHeight(tr.clientHeight)
		if (trh && trh.clientHeight)
			setColumnHeight(trh.clientHeight)
	}, [items, columnHeight, innerTheme])

	useEffect(() => {
		if (theme)
			setTimeout(() => setInnerTheme(theme), 150)
	}, [theme])

	const scrollbarVisibilityChanged =(val: boolean) => setScrollbarActive(val)

    const jsxReturner = (item: VirtualTableItem) => (
		<tr key={item.index} className={`${item.index == selectedIndex ? styles.isCurrent : ''}`}> 
			{itemRenderer(item)}
		</tr> 
	)
    
    const getItems = () => 
        Array.from(Array(Math.min(itemsPerPage, items.count - position))
			.keys())        
			.map(i => jsxReturner(items.getItem(i + position)))

	const onWheel = (sevt: React.WheelEvent) => {
		const evt = sevt.nativeEvent
		if (items.count > itemsPerPage) {
			var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
			let newPos = position + delta
			if (newPos < 0)
				newPos = 0
			if (newPos > items.count - itemsPerPage) 
				newPos = items.count - itemsPerPage
			setPosition(newPos)
		}        
	}			

	const onKeyDown = (sevt: React.KeyboardEvent) => {
		const evt = sevt.nativeEvent
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

	const end = () => calcSelectedIndex(items.count - 1)
	const pos1 = () => calcSelectedIndex(0)
	const pageDown = () =>
	calcSelectedIndex(selectedIndex < items.count - itemsPerPage + 1 
		? selectedIndex + itemsPerPage - 1
		: items.count - 1)
	const pageUp = () => calcSelectedIndex(selectedIndex > itemsPerPage - 1 ? selectedIndex - itemsPerPage + 1: 0)	
	const upOne = () => calcSelectedIndex(selectedIndex - 1)
	const downOne = () => calcSelectedIndex(selectedIndex + 1)

	const calcSelectedIndex = (index: number) => {
		if (index < 0)
			index = 0
		else if (index >= items.count)
			index = items.count - 1
		setSelectedIndex(index)
		scrollIntoView(index)	
		if (onSelectedIndexChanged)
			onSelectedIndexChanged(index)
	}

	const scrollIntoView = (index: number) => {
		if (index < position)
			setPosition(index)
		if (index > position + itemsPerPage - 1)
			setPosition(index - itemsPerPage + 1)
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
			 	+ position
			if (currentIndex != -1)
			 	calcSelectedIndex(currentIndex)
		}		
	}

	const onFocus = (isFocused: boolean) => {
		if (onFocused)
			onFocused(isFocused)
	}

	return (
		<div className={styles.tableviewRoot} 
			tabIndex={1}
			ref={virtualTable} 
			onFocus={()=>onFocus(true)}
			onBlur={()=>onFocus(false)}
			onKeyDown={onKeyDown}
			onWheel={onWheel}>
			<table className={`${styles.table} ${scrollbarActive ? '' : styles.noScrollbar}`}
				onMouseDown={onMouseDown}>
				<Columns 
                    cols={columns} 
                    onColumnClick={onColumnClick} 
                    onSubItemClick={onSubItemClick}
                    onWidthsChanged={onWidthsChanged}
                />
                <tbody>
					{getItems()}
				</tbody>
			</table>
			<div className={styles.tableScrollbar} style={{top: columnHeight + 'px'}}>
				{ <Scrollbar 
					height={height} 
					itemsPerPage={itemsPerPage} 
					count={items.count} 
					position={position}
					positionChanged={setPosition}
					visibilityChanged={scrollbarVisibilityChanged} />  }
			</div>
		</div>
	)
}

