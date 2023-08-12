/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: SchedulerTransform.js
 * Last Modified: 8/19/23, 3:49 PM
 */quire("../../helpers/format");
const transformerPagination = (collection) => {
    let dow = ""
    let every_time = ""

    collection.rows.map((v, i) => {
        collection.rows[i].created_at = date(v.created_at)

        if (collection.rows[i].type_scheduler === 2) { // 2 means every_date in type_schduler
            try {
                dow = getDay(JSON.parse(collection.rows[i].running_at).dow)
                every_time = JSON.parse(collection.rows[i].running_at).every_time
                collection.rows[i].running_at = dow + " At " + every_time
            } catch (e) {
                // if fail parse object string into json
            }
        }
        delete collection.rows[i].type_scheduler
    })

    return collection
}

const getDay = (value) => {
    const day = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"]

    if (value === "every_day") return "SETIAP HARI"

    for (i = 0; i <= day.length; i++) {

        if (i === value) return day[i]
    }
    return "UNKNOWN DAY"
}

module.exports = {
    transformerPagination
}