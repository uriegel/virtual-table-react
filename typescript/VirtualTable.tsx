import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
// @ts-ignore
import styles from './styles.module.css'

import { Scrollbar } from './Scrollbar'
import { Columns, Column } from './Columns'

export type VirtualTableItem = {
	index: number
	isSelected?: boolean
}

export type VirtualTableItemIndexer = {
    count: number
    getItem: (i: number)=>VirtualTableItem
}

export interface VirtualTableState {
	// TODO items: VirtualTableItem[] | VirtualTableItemIndexer
	items: VirtualTableItem[] 
	itemRenderer: (item: VirtualTableItem)=>JSX.Element[]
}

type VirtualTableStateType = {
	// Interface VirtualTableState
	// TODO items: VirtualTableItem[] | VirtualTableItemIndexer
	items: VirtualTableItem[] 
	itemRenderer: (item: VirtualTableItem)=>JSX.Element[]
	position: number
	itemsPerPage: number
}

const getItemsCount = (state: VirtualTableState) => state.items.length

const validatePosition = (position: number, state: VirtualTableStateType) => 
	position > 0 && position < getItemsCount(state) - state.itemsPerPage 
	? position
	: 0

export const createVirtualTableState: (state: VirtualTableState)=>VirtualTableStateType = (state: VirtualTableState) => ({
	items: state.items,
	itemRenderer: state.itemRenderer,
	position: 0,
	itemsPerPage: 0
})

export const changeVirtualTableState: (currentState: VirtualTableStateType, newState: VirtualTableState)=>VirtualTableStateType = (currentState: VirtualTableStateType, newState: VirtualTableState) => ({
	items: newState.items,
	itemRenderer: newState.itemRenderer,
	position: validatePosition(currentState.position, currentState),
	itemsPerPage: currentState.itemsPerPage
})

const changeVirtualTableInternalState = (newState: VirtualTableStateType) => ({
	items: newState.items,
	itemRenderer: newState.itemRenderer,
	itemsPerPage: newState.itemsPerPage,
	position: validatePosition(newState.position, newState)
})

// TODO: ItemHeight and ColumnHeight as useRef
// TODO: resize: calc only itemsPerPage

export type VirtualTableProps = {
	columns: Column[]
	onColumnsChanged: (columns: Column[])=>void
	onSort: (index:number, descending: boolean, isSubItem?: boolean)=>void
	state: VirtualTableStateType 
	onStateChanged: (state: VirtualTableStateType)=>void
	theme?: string
	focused?: boolean
	onFocused?: (focused: boolean)=>void
	currentIndex?: number
	onCurrentIndexChanged?: (index: number)=>void
}

export const VirtualTable = ({ 
		state,
		onStateChanged,
		columns, 
		onColumnsChanged, 
		onSort, 
		theme, 
		focused, 
		onFocused,
		currentIndex,
		onCurrentIndexChanged
 	}: VirtualTableProps) => {
	const virtualTable = useRef<HTMLDivElement>(null)
    const [height, setHeight ] = useState(0)
	const [columnHeight, setColumnHeight ] = useState(0)
	const [itemHeight, setItemHeight] = useState(60)
	const [innerTheme, setInnerTheme] = useState("")
	const [scrollbarActive, setScrollbarActive] = useState(false)
	
	
	// TODO: ??
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

    // useEffect(() => {
    //     const handleResize = () => {
    //         setHeight(virtualTable.current!.clientHeight - columnHeight)
	// 		state.itemsPerPage = Math.floor(height / itemHeight)
	// 		if (getItemsCount(state) - state.position < state.itemsPerPage)
	// 			state.position = validatePosition(getItemsCount(state) - state.itemsPerPage, state)
	// 		onStateChanged(changeVirtualTableInternalState(state))
    //     }
    //     window.addEventListener("resize", handleResize)
    //     handleResize()
    //     return () => window.removeEventListener("resize", handleResize)
    // })

	useEffect(() => {
		if (focused)
			virtualTable.current?.focus()
	}, [ focused])

	useEffect(() => calcSelectedIndex(currentIndex!), [ currentIndex ])

	const setHeights = () => {
		const trh = virtualTable.current!.querySelector("tr")
		const tr = virtualTable.current!.querySelector("tbody tr")
		if (tr && tr.clientHeight)
			setItemHeight(tr.clientHeight)
		if (trh && trh.clientHeight)
			setColumnHeight(trh.clientHeight)
	}

	useLayoutEffect(() => setHeights(), [state, columnHeight, innerTheme])

	useEffect(() => {
		setSelectedIndex(0)
	}, [state])

	useEffect(() => {
		if (theme)
			setTimeout(() => setInnerTheme(theme), 150)
	}, [theme])

	const scrollbarVisibilityChanged =(val: boolean) => setScrollbarActive(val)

    const jsxReturner = (item: VirtualTableItem) => (
		<tr key={item.index} 
			className={`${item.index == selectedIndex ? styles.isCurrent : ''} ${item.isSelected ? styles.isSelected : ''}`}> 
			{state.itemRenderer(item)}
		</tr> 
	)
    
    const renderItems = () => 
        Array.from(Array(Math.min(state.itemsPerPage + 1, Math.max(getItemsCount(state) - state.position, 0)))
			.keys())        
			.map(i => jsxReturner(state.items[i + state.position]))

	const onWheel = (sevt: React.WheelEvent) => {
		const evt = sevt.nativeEvent
		if (getItemsCount(state) > state.itemsPerPage) {
			var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
			let newPos = state.position + delta
			if (newPos < 0)
				newPos = 0
			if (newPos > getItemsCount(state) - state.itemsPerPage) 
				newPos = getItemsCount(state) - state.itemsPerPage
			state.position = validatePosition(newPos, state)
			onStateChanged(changeVirtualTableInternalState(state))
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

	const end = () => calcSelectedIndex(getItemsCount(state) - 1)
	const pos1 = () => calcSelectedIndex(0)
	const pageDown = () =>
	calcSelectedIndex(selectedIndex < getItemsCount(state) - state.itemsPerPage + 1 
		? selectedIndex + state.itemsPerPage - 1
		: getItemsCount(state) - 1)
	const pageUp = () => calcSelectedIndex(selectedIndex > state.itemsPerPage - 1 ? selectedIndex - state.itemsPerPage + 1: 0)	
	const upOne = () => calcSelectedIndex(selectedIndex - 1)
	const downOne = () => calcSelectedIndex(selectedIndex + 1)

	const calcSelectedIndex = (index: number) => {
		if (getItemsCount(state) > 0) {
			if (index < 0)
				index = 0
			else if (index >= getItemsCount(state))
				index = getItemsCount(state) - 1
			const changes = index != selectedIndex
			setSelectedIndex(index)
			scrollIntoView(index)	
			if (changes && onCurrentIndexChanged)
				onCurrentIndexChanged(index)
		}
	}

	const scrollIntoView = (index: number) => {
		if (index < state.position) {
			state.position = index
			onStateChanged(changeVirtualTableInternalState(state))
		}
		if (index > state.position + state.itemsPerPage - 1) {
			state.position = index - state.itemsPerPage + 1
			onStateChanged(changeVirtualTableInternalState(state))
		}
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
			 	+ state.position
			if (currentIndex != -1)
			 	calcSelectedIndex(currentIndex)
		}		
	}

	const onFocus = (isFocused: boolean) => {
		if (onFocused)
			onFocused(isFocused)
	}

	const setPosition = (pos: number) => {
		state.position = validatePosition(pos, state)
		onStateChanged(changeVirtualTableInternalState(state))
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
					{renderItems()}
				</tbody>
			</table>
			<div className={styles.tableScrollbar} style={{top: columnHeight + 'px'}}>
				{ <Scrollbar 
					height={height} 
					itemsPerPage={state.itemsPerPage} 
					count={getItemsCount(state)} 
					position={state.position}
					positionChanged={setPosition}
					visibilityChanged={scrollbarVisibilityChanged} />  }
			</div>
		</div>
	)
}