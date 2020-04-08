import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

import {
  STATUS_DELIVERED,
  STATUS_PENDING,
  STATUS_READ,
  STATUS_SENT
} from '../../../../models/message'

export default function MessageSendState({ send_state }) {
  switch (send_state) {
    case STATUS_PENDING:
      return (<FontAwesomeIcon icon={faClock} color={'grey'} />)
    case STATUS_SENT:
      return (<FontAwesomeIcon icon={faCheck} color={'grey'} />)
    case STATUS_DELIVERED:
      return (<FontAwesomeIcon icon={faCheckDouble} color={'grey'} />)
    case STATUS_READ:
      return (<FontAwesomeIcon icon={faCheckDouble} color={'#27ae60'} />)

    default: return (<FontAwesomeIcon icon={faClock} color={'white'} />)
  }
}
