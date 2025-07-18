import React from "react";
import useExportData from '@admin/utils/hooks/exportData'

export type MenuActionType = {
    name: string;
    action?: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

export const adminProductsAction: MenuActionType[] = [
    {
        name: 'Змінити',
        action: (data) => {useExportData(data)}
    },
    {
        name: 'Видалити',
        // action: 
    },
]