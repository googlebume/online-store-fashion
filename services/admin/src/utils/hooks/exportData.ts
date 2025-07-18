import {useState} from 'react'

const exportData = <T>() => {
    const [data, exportData] = useState<T>()
    return {
        data,
        exportData
    }
}