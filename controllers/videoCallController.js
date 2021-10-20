const axios = require('axios')

const DAILY_KEY = process.env.API_DAILY_KEY || '76fa684a046829ebd2155f14eb7f974bf45461a9c998f26d199f10574767e0a0'

class VideoCallController {
    static async createRoom (req, res, next) {
        try {
            let newRoom = await axios({
                method: 'POST',
                url: 'https://api.daily.co/v1/rooms',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DAILY_KEY}`,
                },
                data: JSON.stringify({
                    name: req.body.name,
                    privacy: 'public',
                    properties: {
                        enable_chat: true,
                        start_video_off: false,
                        start_audio_off: false,
                        max_participants: 2,
                        autojoin: true
                    }
                })
            })
            res.status(201).json({url: newRoom.data.url})
        } catch (error) {
            next(error)
        }
    }

    static async getRoom (req, res, next) {
        try {
            const { name } = req.params
            let room = await axios({
                method: 'GET',
                url: `https://api.daily.co/v1/rooms/${name}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DAILY_KEY}`,
                }
            })
            res.status(200).json({url: room.data.url})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = VideoCallController