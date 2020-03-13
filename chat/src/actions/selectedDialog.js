export const SELECTED_DIALOG = 'SELECTED_DIALOG'
export const UN_SELECTED_DIALOG = 'UN_SELECTED_DIALOG'

export const selectedDialog = dialog => ({ type: SELECTED_DIALOG, dialog })
export const unSelectedDialog = dialog => ({ type: UN_SELECTED_DIALOG, dialog })