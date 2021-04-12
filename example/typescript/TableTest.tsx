import React, { useState, useRef } from 'react'
import 'virtual-table-react/dist/index.css'

import { 
    Column, 
    Table, 
    TableItem
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
    const [items, setItems ] = useState([] as TableItem[])
    const [currentIndex, setCurrentIndex ] = useState(0)

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
        setItems(items)
        setCurrentIndex(18)
    }
    
    const onChangeArray = () => {
        const items = Array.from(Array(600).keys()).map(index => getItem(index))
        setItems(items)
        setCurrentIndex(45)
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

    const onDblClk = () => console.log("Double click")

    return (
        <div className='rootVirtualTable'>
            <h1>Table</h1>
            <button onClick={onChange}>Fill</button>
            <button onClick={onChangeArray}>Fill array</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <div className='containerVirtualTable'>
                <Table 
                    onDoubleClick={onDblClk}
                    columns={cols} 
                    //isColumnsHidden={true}
                    onColumnsChanged={onColsChanged} 
                    onSort={onSort} 
                    items={items}
                    currentIndex={currentIndex}
                    onItemsChanged ={setItems}
                    onCurrentIndexChanged={setCurrentIndex}
                    itemRenderer={itemRenderer}
                    theme={theme}
                    focused={focused}
                    onFocused={onFocused} />
            </div>
        </div>
    )
}

