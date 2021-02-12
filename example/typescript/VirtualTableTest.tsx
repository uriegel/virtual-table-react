import React, { useState, useRef, useEffect } from 'react'
import 'virtual-table-react/dist/index.css'

import { Column, VirtualTable } from 'virtual-table-react'

interface Items {
    count: number
    getItem: (i: number)=>string
}

export const VirtualTableTest = () => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])
    
    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    return (
        <div className='rootVirtualTable'>
            <h1>Virtual Table</h1>
            <div className='containerVirtualTable'>
                <VirtualTable columns={cols} onColumnsChanged={onColsChanged} onSort={onSort} />
            </div>
        </div>
    )
}
