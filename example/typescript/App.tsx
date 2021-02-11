import React, { useState } from 'react'
import { ColumnsTest, ColumnsTestProps } from './ColumnsTest'
import ScrollbarTest from './ScrollbarTest'

const App = () => {
    const [appChoice, setAppChoice] = useState(0)
    const [theme, setTheme] = useState("")

    const onAppChange = (evt: React.ChangeEvent<HTMLSelectElement>) => setAppChoice(evt.target.selectedIndex)
    const onThemeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const styleSheet = document.getElementById("theme")  
        
        const theme = evt.target.selectedIndex == 1 ? "yaru" : "blue"
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

    return (
        <div>
            <select onChange={onAppChange}>
                <option>Columns</option>
                <option>Scrollbar</option>
            </select>
            <select onChange={onThemeChange}>
                <option>blue</option>
                <option>yaru</option>
            </select>
            {appChoice == 1 ? <ScrollbarTest /> : <ColumnsTest theme={theme}/>}
        </div>
    )
}

export default App