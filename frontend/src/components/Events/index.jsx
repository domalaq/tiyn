import React from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import IconButton from 'material-ui/IconButton'
import './index.css'
import socket from '../../services/socket'
import moment from 'moment'
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new'


class Events extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      events: []
    }

    this._addEvent = this._addEvent.bind(this)
    this._clearEvents = this._clearEvents.bind(this)
  }

  componentDidMount() {
    socket.on('contract event', this._addEvent)
    socket.on('disconnect', this._clearEvents)
  }

  _addEvent(msg) {
    if (!this.state.events.some(function (e) {
      return e.transactionHash === msg.transactionHash
    })) {
      this.setState((prevState) => ({events: [msg].concat(prevState.events)}))
    }
  }

  _clearEvents() {
    this.setState({events: []})
  }

  render() {
    const rightButton = (link) => <IconButton
      tooltip="Транзакцияны Көру"
      href={link}
      style={{marginRight: '35px'}}
      target="_blank"
    >
      <ActionOpenInNew />
    </IconButton>

    return (
      <div className="events">
        <hr />
        <List>
          <Subheader>Оқиғалар</Subheader>
          {
            this.state.events.map((e) => <ListItem
              key={e.transactionHash}
              primaryText={e.title}
              secondaryText={moment(e.blockDate).format('DD.MM.YYYY HH:mm')}
              disabled={true}
              rightIconButton={ rightButton(e.link) }
            />)
          }
        </List>
      </div>

    )
  }
}

export default Events
