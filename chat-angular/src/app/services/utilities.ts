import {participant} from "../reducers/participants/participants.reducer";
import {addSearchParticipants} from "../reducers/participants/participants.actions";

export const builtDialog = (d: any) => {
  return {
    id: d._id, name: d.name, type: d.type, photo: d.photo, lastMessage: d.last_message,
    lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
    createAt: d.created_at, msgIds: [], participantIds: d.occupants_ids, participants: new Map<string, participant>(),
    typingParticipants: []
  };
}
