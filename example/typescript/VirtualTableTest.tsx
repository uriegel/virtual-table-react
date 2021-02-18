import React, { useState } from 'react'
import 'virtual-table-react/dist/index.css'

import { 
    Column, 
    VirtualTable, 
    VirtualTableItem, 
    setVirtualTableItems,
    VirtualTableItems
} from 'virtual-table-react'

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
    const [items, setItems ] = useState(setVirtualTableItems({items: [] as VirtualTableItem[], itemRenderer: i=>[]}) as VirtualTableItems)
        
    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const getItem = (index: number) => ({ 
        col1: `Name ${index}`, 
        col2: `Adresse ${index}`, 
        col3: `Größe ${index}`, 
        index: index, 
        isSelected: index == 4 || index == 7 || index == 8 } as TableItem)

    const onChange = () => 
        setItems(setVirtualTableItems({items: Array.from(Array(20).keys()).map(index => getItem(index)), itemRenderer}))
    
    
    const onChangeArray = () => 
        setItems(setVirtualTableItems({items: Array.from(Array(60).keys()).map(index => getItem(index)), itemRenderer, currentIndex: 45}))
    
    
    const itemRenderer = (item: VirtualTableItem) => {
        const tableItem = item as TableItem
        return [
            <td key={1}>{tableItem.col1}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    const onSetFocus = () => setFocused(true)   

    const onFocused = (val: boolean) => setFocused(val)

    return (
        <div className='rootVirtualTable'>
            <h1>Virtual Table</h1>
            <button onClick={onChange}>Fill</button>
            <button onClick={onChangeArray}>Fill array</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <div className='containerVirtualTable'>
                <VirtualTable 
                    columns={cols} 
                    onColumnsChanged={onColsChanged} 
                    onSort={onSort} 
                    items={items}
                    onItemsChanged ={setItems}
                    theme={theme}
                    focused={focused}
                    onFocused={onFocused} />
            </div>
        </div>
    )
}
