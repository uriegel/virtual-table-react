import React, { useState, useRef } from 'react'
import 'virtual-table-react/dist/index.css'

import { 
    Column, 
    Table, 
    TableItem, 
    setTableItems,
    TableItems
} from 'virtual-table-react'

interface TestTableItem extends TableItem {
    col1: string
    col2: string
    col3: string
}

type TableTestProps = {
    theme?: string
}

export const TableTest = ({theme}: TableTestProps) => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const [focused, setFocused] = useState(false)
    const [items, setItems ] = useState(setTableItems({items: []}) as TableItems)

    const onColsChanged = (cols: Column[])=> setCols(cols)
    const onSort = ()=> {}

    const getItem = (index: number) => ({ 
        col1: `Name ${index}`, 
        col2: `Adresse ${index}`, 
        col3: `Größe ${index}`, 
        index: index, 
        isSelected: index == 4 || index == 7 || index == 8 } as TableItem)

    const onChange = () => {
        const items = Array.from(Array(20).keys()).map(index => getItem(index))
        setItems(setTableItems({items, currentIndex: 18}))
    }
    
    const onChangeArray = () => {
        const items = Array.from(Array(60).keys()).map(index => getItem(index))
        setItems(setTableItems({items, currentIndex: 45}))
    }
    
    const itemRenderer = (item: TableItem) => {
        const tableItem = item as TestTableItem
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
            <h1>Table</h1>
            <button onClick={onChange}>Fill</button>
            <button onClick={onChangeArray}>Fill array</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <div className='containerVirtualTable'>
                <Table 
                    columns={cols} 
                    //isColumnsHidden={true}
                    onColumnsChanged={onColsChanged} 
                    onSort={onSort} 
                    items={items}
                    onItemsChanged ={setItems}
                    itemRenderer={itemRenderer}
                    theme={theme}
                    focused={focused}
                    onFocused={onFocused} />
            </div>
        </div>
    )
}

