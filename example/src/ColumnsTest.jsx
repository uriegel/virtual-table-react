import React, { useState } from 'react'

import { Columns } from 'virtual-table-react'

const App = () => {
    const [cols, setCols] = useState([
        [ "Eine Spalte", 1], 
        [ "Zweite. Spalte", 2], 
        [ "Letzte Spalte", 3]])

    return (
        <div>
            <p><button onClick={() => setCols([
                [ "Column 1", 4], 
                [ "2", 5 ], 
                [ "3rd Col.", 6]])}>Ändern</button></p>
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