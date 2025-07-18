import {useState} from 'react'

const useExportData = <T>() => {
    const [data, exportData] = useState<T>()
    return {
        data,
        exportData
    }
}

export default useExportData