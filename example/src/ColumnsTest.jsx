import React, { useState } from 'react'
import 'virtual-table-react/dist/index.css'

import { Columns } from 'virtual-table-react'

const initialWidths = localStorage.getItem("widths")
const initialWidths = initialWidths ? JSON.parse(initialWidths) : null)

const App = () => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true}
    ])

    const onColumnClick = i =>  {
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

    const onSubItemClick = i => {
		if (cols[i].isSortable) {
			let newState = [...cols].map(col => {
                col.columnsSort = undefined
                return col
            })
			newState[i].subItemSort = cols[i].subItemSort == 1 ? 2 : 1
			setCols(newState)
		}	
	}

    const onWidthsChanged = w => localStorage.setItem("widths", JSON.stringify(w))

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
                    onWidthsChanged = {onWidthsChanged}
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

export default App