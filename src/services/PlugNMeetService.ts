import {ActiveRoomInfo, PastRoomInfo, PlugNmeet, Room} from "plugnmeet-sdk-js"
import {IPostProcessData} from "../interfaces/IPostProcessData";

export class PlugNMeetService {
    private readonly host: string;
    private readonly api_key: string;
    private readonly api_secret: string;
    private readonly client: PlugNmeet;
    constructor(config: any) {
        this.host = config.plugNMeet.host;
        this.api_key = config.plugNMeet.api_key;
        this.api_secret = config.plugNMeet.api_secret;
        this.client = new PlugNmeet(this.host, this.api_key, this.api_secret);
    }

    async deleteOldRecording(data: IPostProcessData) {
        const res = await this.client.deleteRecordings({ record_id: data.recording_id });
        if (!res.status) {
            console.warn(`Received unsuccessful status while deleting recording: ${res.msg}`);
        }
    }

    async getRoomInfo(data: IPostProcessData) : Promise<ActiveRoomInfo | PastRoomInfo | undefined> {
        const activeRoomRes = await this.client.getActiveRoomsInfo();

        if (activeRoomRes.status && activeRoomRes.rooms) {
            const activeRooms = activeRoomRes.rooms.filter((r: Room) => r.room_info.sid === data.room_sid);
            if (activeRooms.length > 0) return activeRooms[0].room_info;
        }
        const pastRoomRes = await this.client.fetchPastRoomsInfo({ from: 0, limit: 9999 });
        if (pastRoomRes.status && pastRoomRes.result) {
            const pastRooms = pastRoomRes.result.rooms_list.filter((r: PastRoomInfo) => r.room_sid === data.room_sid);
            return pastRooms.length > 0 ? pastRooms[0] : undefined;
        }
        return undefined;
    }
}