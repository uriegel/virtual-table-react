import React, { useState, useRef, useEffect } from 'react'
import 'virtual-table-react/dist/index.css'

import { Scrollbar } from 'virtual-table-react'

const itemHeight = 18

type Items = {
    count: number
    getItem: (i: number)=>string
}

type ListBoxProps = {
    items: Items,
}

const ListBox = ({items}: ListBoxProps) => {
    const listbox = useRef<HTMLDivElement>(null)
    const [height, setHeight ] = useState(0)
    const [itemsPerPage, setItemsPerPage ] = useState(0)
    const [position, setPosition] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            setHeight(listbox.current!.clientHeight)
            setItemsPerPage(Math.floor(listbox.current!.clientHeight / itemHeight))
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    })

    const jsxReturner = (item: string) => <div key={item}>{item}</div> 
    
    const getItems = () => 
        Array.from(Array(Math.min(itemsPerPage, items.count - position))
                .keys())        
                .map(i => jsxReturner(items.getItem(i + position)))

    const onWheel = (sevt: React.WheelEvent) => {

        const evt = sevt.nativeEvent
        if (items.count > itemsPerPage) {
            var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
            let newPos = position + delta
            if (newPos < 0)
                newPos = 0
            if (newPos > items.count - itemsPerPage) 
                newPos = items.count - itemsPerPage
            setPosition(newPos)
        }        
    }

    return (
        <div className='listcontainer' onWheel={onWheel}>
            <div ref={listbox}  className='list' >
                {getItems()}
            </div>
            <Scrollbar 
                height={height} 
                itemsPerPage={itemsPerPage} 
                count={items.count} 
                position={position}
                positionChanged={setPosition} /> 
        </div>
    )
}

const App = () => {
    const [items, setItems ] = useState({count: 0, getItem: (i: number)=>''} as Items)
    const getItem = (index: number) => `Item # ${index}`
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setItems(
        {count: parseInt(e.target.value) || 0, getItem}
    )

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