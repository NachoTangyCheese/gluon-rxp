import RX = require('reactxp')
import { connect } from 'react-redux'
import { CallToAction, ScrollView, ListItem } from '../Components'
import { CombinedState } from '../Reducers'
import Actions from '../Reducers/Actions'
import * as Theme from '../Theme'
import * as Selectors from '../Selectors'
import * as Enums from '../Enums'
import utils from '../Utils'

interface Props extends RX.CommonProps {
  navigate?: (routeName: string) => void
  navigateBack?: () => void
  rooms?: MatrixRoom[]
  selectedRoomId?: string,
  setRoom?: (roomId: string) => void
  uiTraits?: UITraits
  currentUser?: User
}

class RoomSelectionScreen extends RX.Component<Props, null> {
  handleSelectRoom(id: string) {
    this.props.setRoom(id)
    this.props.navigateBack()
  }

  render() {
    return (
      <RX.View style={Theme.Styles.scrollContainerNoMargins}>
        <ScrollView>
          <ListItem
            isOff
            title={'None'}
            subTitle={'Don\'t share'}
            type={ListItem.type.Secondary}
            selected={!this.props.selectedRoomId}
            onPress={() => this.handleSelectRoom(null)}
          />
          {this.props.rooms && <RX.View>
            {this.props.rooms.map((room, key) => {
              return <ListItem
                key={key}
                account={{avatar: room.avatarUrl}}
                title={`${room.name}`}
                subTitle={`${room.members.length} Members`}
                type={ListItem.type.Secondary}
                selected={this.props.selectedRoomId
                  && room.id === this.props.selectedRoomId}
                onPress={() => this.handleSelectRoom(room.id)}
              />
            })}
          </RX.View>}
        {this.props.rooms.length === 0 && <RX.View style={Theme.Styles.infoBox.wrapper}>
          <RX.Text style={Theme.Styles.infoBox.title}>You have not joined any rooms yet</RX.Text>
        </RX.View>}
        </ScrollView>

      </RX.View>
    )
  }
}

const mapStateToProps = (state: CombinedState): Props => {
  return {
    rooms: Selectors.Matrix.getRooms(state),
    selectedRoomId: Selectors.Matrix.getSelectedRoomId(state),
    uiTraits: state.app.uiTraits,
    currentUser: state.user.current,
  }
}
const mapDispatchToProps = (dispatch: any): Props => {
  return {
    navigate: (routeName: string) => dispatch(Actions.Navigation.navigate(routeName)),
    navigateBack: () => dispatch(Actions.Navigation.navigateBack()),
    setRoom: (roomId: string) => dispatch(Actions.Matrix.selectRoom(roomId)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RoomSelectionScreen)
