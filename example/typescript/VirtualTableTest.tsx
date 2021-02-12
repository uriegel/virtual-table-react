import React, { useState, useRef, useEffect } from 'react'
import 'virtual-table-react/dist/index.css'

import { Column, VirtualTable, VirtualTableItems } from 'virtual-table-react'

export const VirtualTableTest = () => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])
    const [items, setItems ] = useState({count: 0, getItem: (i: number)=>''} as VirtualTableItems)

    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const getItem = (index: number) => `Item # ${index}`
    const onChange = () => setItems({count: 50, getItem})

    return (
        <div className='rootVirtualTable'>
            <h1>Virtual Table</h1>
            <button onClick={onChange}>Fill</button>
            <div className='containerVirtualTable'>
                <VirtualTable columns={cols} onColumnsChanged={onColsChanged} onSort={onSort} items={items}/>
            </div>
        </div>
    )
}
