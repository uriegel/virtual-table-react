import React, { useState } from 'react'
import 'virtual-table-react/dist/index.css'

//import { Columns } from 'virtual-table-react'

const App = () => {
    const [items, setItems ] = useState([])
    const onInputChange = e => setItems(Array.from(Array(parseInt(e.target.value)).keys()).map((n, i) => `Item # ${i}`))
    return (
        <div className='main'>
            <h1>Scrollbar Test</h1>
                <div>
                    <input type="number" onChange={onInputChange} placeholder="Items count" />
                    <div>Message is: {items.length} </div>
                </div>
            <div className='listcontainer'>
            <div className="list" >
                {items.map((item) => (
                    <div key={item}>{item}</div> 
                ))}
            </div>
            {/* <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" v-model='position'> */}
            {/* </scrollbar> */}
            </div>
        </div>    
    )
}

export default App