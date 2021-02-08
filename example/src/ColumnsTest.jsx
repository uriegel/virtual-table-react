import React, { useState } from 'react'
import 'virtual-table-react/dist/index.css'

import { Columns } from 'virtual-table-react'

const App = () => {
    const [cols, setCols] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true}
    ])

    return (
        <div>
            <p><button onClick={() => setCols([
                { name: "Column 1", isSortable: true, subItem: "ext" }, 
                { name: "2", isSortable: true }, 
                { name: "3rd Col." }])}>Ändern</button></p>
            <table>
                <Columns cols={cols} />
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