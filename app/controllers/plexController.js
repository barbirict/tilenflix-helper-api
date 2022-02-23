const PlexAPI = require("plex-api")
const dayjs = require("dayjs");
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
const client = new PlexAPI({hostname: "s1.home.io", username:"barbiric.tilen@gmail.com", password: "Kajtekuracremi1.", managedUser: {name: "Tovariš Tilen", pin: "1056"}})
exports.getRecent = (req, res) => {
    const type = req.params
    const days = req.query.days
    client.find("/library/recentlyAdded", {type: type})
        .then(media => {
            let recentMedia = []
            const ago = dayjs().subtract(days, 'days').unix()
            for(let i = 0; i < media.length; i++){
                let mediaAdded = parseInt(media[i].addedAt)
                if(dayjs(mediaAdded).isBetween(ago, dayjs())){

                    recentMedia.push(media[i])
                }
            }
            getMediaThumbs(recentMedia)
                .then(mediaWithThumbs => {
                    res.send(mediaWithThumbs)
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).send()
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}
async function getMediaThumbs(media) {
    for (let i = 0; i < media.length; i++) {
        await client.query(media[i].thumb)
            .then(image => {
                media[i].thumb = Buffer.from(image).toString('base64')
            })
    }
    return media
}