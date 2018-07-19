const Matrix = require('matrix-js-sdk')
import request from './Request'

export let client: any = null

export const login = (username: string, password: string, baseUrl: string) => {
  const tmpClient = Matrix.createClient({baseUrl, request})
  return new Promise<MatrixUser>((resolve, reject) => {
    tmpClient.login('m.login.password', {user: username, password: password}, (err: any, resp: any) => {
      console.log(err)
      if (err) {
        reject(err)
      } else {
        console.log(resp)

        client = Matrix.createClient({
            baseUrl,
            userId: resp.user_id,
            accessToken: resp.access_token,
            request,
        })
        // client.startClient()
        resolve(resp)
      }
    })
  })
}

export const startClient = (options: MatrixUser) => {
  client = Matrix.createClient({
    baseUrl: `https://${options.home_server}`,
    userId: options.user_id,
    accessToken: options.access_token,
    deviceId: options.device_id,
    request,
  })
  // client.startClient()
  return true
}

export const sendTextMessage = (roomId: string, message: string) => {
  return client.sendTextMessage(roomId, message)
}

export const sendMessage = (roomId: string, content: any) => {
  return client.sendMessage(roomId, content)
}

export const getEventData = (event: any): MatrixTimelineEvent => {
  return {
    roomId: event.getRoomId(),
    eventId: event.getId(),
    type: event.getType(),
    content: event.getContent(),
    // prevContent: event.getPrevContent(),
    ts: event.getTs(),
    sender: event.getSender(),
    // stateKey: event.getStateKey(),
    // redactedBecause: event.getUnsigned().redacted_because,
  }
}

export const getRooms = (): MatrixRoom[] => {
  const rooms = client.getRooms()
  const data = rooms.map((room: any) => {

    const members: MatrixMember[] = room.getJoinedMembers().map((member: any) => {
      const avatarUrl = member.getAvatarUrl(client.baseUrl, 50, 50, 'scale', true, true)
      return {
        userId: member.userId,
        displayname: member.name,
        membership: member.membership,
        avatarUrl,
      } as MatrixMember
    })

    const timeline: MatrixTimelineEvent[] = room.getLiveTimeline().getEvents().map(getEventData)
    const avatarUrl = room.getAvatarUrl(client.baseUrl, 50, 50, 'scale', true)

    return {
      avatarUrl,
      id: room.roomId,
      name: room.name,
      members,
      timeline,
    }
  })

  return data
}