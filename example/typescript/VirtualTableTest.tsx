import React, { useState, useRef, useEffect } from 'react'
import 'virtual-table-react/dist/index.css'

import { Column, VirtualTable, VirtualTableItems, VirtualTableItem } from 'virtual-table-react'

interface TableItem extends VirtualTableItem {
    col1: string
    col2: string
    col3: string
}

type VirtualTableTestProps = {
    theme?: string
}

export const VirtualTableTest = ({theme}: VirtualTableTestProps) => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])
    const [focused, setFocused] = useState(false)
    const [items, setItems ] = useState({count: 0, getItem: (i: number)=>{}} as VirtualTableItems)

    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const getItem = (index: number) => ({ col1: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as TableItem)
    const onChange = () => setItems({count: 30, getItem})
    
    const itemRenderer = (item: VirtualTableItem) => {
        const tableItem = item as TableItem
        return [
            <td key={1}>{tableItem.col1}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    const onSetFocus = () => {
        setFocused(true)
    }   

    const onFocused = (val: boolean) => setFocused(val)

    return (
        <div className='rootVirtualTable'>
            <h1>Virtual Table</h1>
            <button onClick={onChange}>Fill</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <div className='containerVirtualTable'>
                <VirtualTable 
                    columns={cols} 
                    onColumnsChanged={onColsChanged} 
                    onSort={onSort} items={items} 
                    itemRenderer={itemRenderer}
                    theme={theme}
                    focused={focused}
                    onFocused={onFocused} />
            </div>
        </div>
    )
}
