import React, { useState, useRef } from 'react'
import 'virtual-table-react/dist/index.css'

import { Scrollbar } from 'virtual-table-react'

const itemHeight = 18

const ListBox = ({items}) => {
    const list = useRef(null);
    const [isRunning, setIsRunning ] = useState(false)
    const [height, setHeight ] = useState(0)
    const [itemsPerPage, setItemsPerPage ] = useState(0)
    
    const onResize = () => {
        setHeight(list.current.clientHeight)
        setItemsPerPage(Math.floor(list.current.clientHeight / itemHeight))
    }

    if (!isRunning) {
        window.addEventListener("resize", onResize)
        setIsRunning(true)
        setTimeout(onResize)
    }

    const jsxReturner = item => {
        return <div key={item}>{item}</div> 
    }

    const getItems = () => 

        // array from startindex, (startindex + itemsperPage)|maxCount
        //jsxReturner(items[i])   
        Array.from(Array(Math.min(itemsPerPage, items.count))
                .keys())        
                .map(i => jsxReturner(items.getItem(i)))

    return (
        <div className='listcontainer'>
            <div className="list" ref={list} >
                {getItems()}
            </div>
            <Scrollbar height={height} itemsPerPage={itemsPerPage} count={items.count} /> 
        </div>
    )
}

const App = () => {
    const [items, setItems ] = useState( {count: 0})
    const onInputChange = e => setItems({count: parseInt(e.target.value) || 0, getItem})
    const getItem = index => `Item # ${index}`

    return (
        <div className='main'>
            <h1>Scrollbar Test</h1>
                <div>
                    <input type="number" onChange={onInputChange} placeholder="Items count" />
                    <div>Items: {items.count} </div>
                </div>
            <ListBox items={items}/>
        </div>    
    )
}

export default App