import React, { useState } from 'react'
import 'virtual-table-react/dist/index.css'

import { Column, Columns } from 'virtual-table-react'

const initialWidthsString = localStorage.getItem("widths")
const initialWidths = initialWidthsString ? JSON.parse(initialWidthsString) : null

export interface ColumnsTestProps {
    theme: string
}
export const ColumnsTest = ({theme}: ColumnsTestProps) => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true, width: initialWidths && initialWidths[0] }, 
        { name: "Zweite. Spalte", width: initialWidths && initialWidths[1] }, 
        { name: "Letzte Spalte", isSortable: true, width: initialWidths && initialWidths[2]}
    ] as Column[])

    const onColumnClick = (i: number) =>  {
		if (cols[i].isSortable) {
			let newState = [...cols].map((col, j) => {
                if (i != j)
                    col.columnsSort = undefined
                col.subItemSort = undefined
                return col
            })
			newState[i].columnsSort = cols[i].columnsSort == 1 ? 2 : 1
			setCols(newState)
		}	
	}

    const onSubItemClick = (i: number) => {
		if (cols[i].isSortable) {
			let newState = [...cols].map(col => {
                col.columnsSort = undefined
                return col
            })
			newState[i].subItemSort = cols[i].subItemSort == 1 ? 2 : 1
			setCols(newState)
		}	
	}

    const onWidthsChanged = (w: number[]) => localStorage.setItem("widths", JSON.stringify(w))

    return (
        <div>
            <p><button onClick={() => setCols([
                { name: "Column 1", isSortable: true, subItem: "ext" }, 
                { name: "2", isSortable: true }, 
                { name: "3rd Col." }])}>Ändern</button></p>
            <table>
                <Columns 
                    cols={cols} 
                    onColumnClick={onColumnClick} 
                    onSubItemClick={onSubItemClick}
                    onWidthsChanged={onWidthsChanged}
                    theme={theme}
                />
                <tbody>
                    <tr>
                        <td>Test</td>
                        <td>txt</td>
                        <td>25.02.1999 14:23</td>
                    </tr>
                    <tr>
                        <td>Bild</td>
                        <td>jpg</td>
                        <td>15.12.2009 12:39</td>
                    </tr>                
                </tbody>  
            </table>
        </div>
    )
}

