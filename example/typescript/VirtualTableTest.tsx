import React, { useState, useRef } from 'react'
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

    const getTableItem = (i: number) => tableItems.current[i]

    const [focused, setFocused] = useState(false)
    const [items, setItems ] = useState(setVirtualTableItems({count: 0, getItems: async (s, e) =>[] }) as VirtualTableItems)
    const [currentIndex, setCurrentIndex ] = useState(0)

    const tableItems = useRef([] as VirtualTableItem[])

    const onColsChanged = (cols: Column[])=> setCols(cols)
    const onSort = ()=> {}

    const getItem = (index: number) => ({ 
        col1: `Name ${index}`, 
        col2: `Adresse ${index}`, 
        col3: `Größe ${index}`, 
        index: index, 
        isSelected: index == 4 || index == 7 || index == 8 } as TableItem)

    const getItems = (start: number, end: number) => 
        new Promise<TableItem[]>(res => setTimeout(() => {
            const safeStart = Math.min(end, start)
            res(Array.from(Array(end - safeStart + 1).keys()).map(i => getItem(i + safeStart)))
        }, 30))

    const onChange = () => {
        tableItems.current = Array.from(Array(20).keys()).map(index => getItem(index))
        setItems(setVirtualTableItems({count: tableItems.current.length, getItems}))
        setCurrentIndex(18)
    }
    
    const onChangeArray = () => {
        tableItems.current = Array.from(Array(60).keys()).map(index => getItem(index))
        setItems(setVirtualTableItems({count: tableItems.current.length, getItems}))
        setCurrentIndex(45)
    }
    
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

    const onDblClk = () => console.log("Double click")
    
    return (
        <div className='rootVirtualTable'>
            <h1>Virtual Table</h1>
            <button onClick={onChange}>Fill</button>
            <button onClick={onChangeArray}>Fill array</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <div className='containerVirtualTable'>
                <VirtualTable 
                    columns={cols} 
                    onDoubleClick={onDblClk}
                    //isColumnsHidden={true}
                    onColumnsChanged={onColsChanged} 
                    onSort={onSort} 
                    items={items}
                    onItemsChanged ={setItems}
                    itemRenderer={itemRenderer}
                    currentIndex={currentIndex}
                    onCurrentIndexChanged={setCurrentIndex}
                    theme={theme}
                    focused={focused}
                    onFocused={onFocused} />
            </div>
        </div>
    )
}
// TODO common features with TableTest in base Component
