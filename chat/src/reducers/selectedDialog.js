import {
  SELECTED_DIALOG,
  UN_SELECTED_DIALOG
} from '../actions/selectedDialog'

export default (dialog = null, action) => {
  switch (action.type) {
    case SELECTED_DIALOG: {
      return { ...action.dialog }
    }

    case UN_SELECTED_DIALOG: {
      return {}
    }

    default:
      return dialog
  }
}