import React, { useState, useLayoutEffect } from 'react'
import { ColumnsTest } from './ColumnsTest'
import ScrollbarTest from './ScrollbarTest'
import {VirtualTableTest} from './VirtualTableTest'

const App = () => {
    const [appChoice, setAppChoice] = useState(0)
    const [theme, setTheme] = useState("")

    const onAppChange = (evt: React.ChangeEvent<HTMLSelectElement>) => setAppChoice(evt.target.selectedIndex)
    const onThemeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => 
        changeTheme(evt.target.selectedIndex == 1 ? "yaru" : "blue")

    const changeTheme = (theme: string) => {
        const styleSheet = document.getElementById("theme")  
        const head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'theme'
        link.type = 'text/css'
        link.href = `themes/${theme}.css`
        link.media = 'all'
        head.appendChild(link)
        if (styleSheet)
            styleSheet.remove()
        setTheme(theme)
    }

    useLayoutEffect(() => {
        changeTheme("blue")
    }, [])

    return (
        <div>
            <div>
                <select onChange={onAppChange}>
                    <option>Columns</option>
                    <option>Scrollbar</option>
                    <option>Virtual Table</option>
                </select>
                <select onChange={onThemeChange}>
                    <option>blue</option>
                    <option>yaru</option>
                </select>
            </div>
            {appChoice == 1 
                ? <ScrollbarTest /> 
                : (appChoice == 2 
                    ? <VirtualTableTest theme={theme} />
                    : <ColumnsTest />)}
        </div>
    )
}

export default App