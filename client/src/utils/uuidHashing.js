import { v5 as uuidv5 } from 'uuid'

export default function uuidHashing(uuid_1, uuid_2) {
    const letterNumber = /[^0-9a-z]+/gi
    const uuid_1New = uuid_1.replace(letterNumber, '')
    const uuid_2New = uuid_2.replace(letterNumber, '')
    let newUUID = ''
    for (let i = 0; i < 36; i++) {
        const hashCode = uuid_1New.charCodeAt(i) < uuid_2New.charCodeAt(i) ? uuid_1New.charAt(i) + uuid_2New.charAt(i) : uuid_2New.charAt(i) + uuid_1New.charAt(i)
        newUUID += hashCode + (i === 7 || i === 11 || i === 15 || i === 19 ? '-' : '')
    }
    return uuidv5(newUUID, 'ae0880e2-6a80-4a68-8a10-02c1d7d192f1')
}
