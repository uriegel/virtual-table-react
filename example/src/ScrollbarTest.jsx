import React, { useState, useRef } from 'react'
import 'virtual-table-react/dist/index.css'

import { Scrollbar } from 'virtual-table-react'

const itemHeight = 18

const App = () => {
    const list = useRef(null);
    const [isRunning, setIsRunning ] = useState(false)
    const [height, setHeight ] = useState(0)
    const [itemsPerPage, setItemsPerPage ] = useState(0)
    const [items, setItems ] = useState([])
    const onInputChange = e => setItems(Array.from(Array(parseInt(e.target.value)).keys()).map((n, i) => `Item # ${i}`))

    const onResize = () => {
        setHeight(list.current.clientHeight)
        console.log(height)
        setItemsPerPage(Math.floor(list.current.clientHeight / itemHeight))
        console.log(itemsPerPage)
    }

    if (!isRunning) {
        window.addEventListener("resize", onResize)
        setIsRunning(true)
        setTimeout(onResize)
    }

    return (
        <div className='main'>
            <h1>Scrollbar Test</h1>
                <div>
                    <input type="number" onChange={onInputChange} placeholder="Items count" />
                    <div>Message is: {items.length} </div>
                </div>
            <div className='listcontainer'>
            <div className="list" ref={list} >
                {items.map((item) => (
                    <div key={item}>{item}</div> 
                ))}
            </div>
            <Scrollbar /> 
            </div>
        </div>    
    )
}

export default App