function makeEntriesArray() {
    return [
        {
            id: 1,
            date_created: new Date().toLocaleDateString(),
            month_created: "March",
            mood: "Happy",
            stress_level: 5,
            gratitude1: "A",
            gratitude2: "B",
            gratitude3: "C",
            notes: "test 1",
            userid: 1
        },
        {
            id: 2,
            date_created: new Date().toLocaleDateString(),
            month_created: "March",
            mood: "Happy",
            stress_level: 5,
            gratitude1: "A",
            gratitude2: "B",
            gratitude3: "C",
            notes: "test 2",
            userid: 1
        },
        {
            id: 3,
            date_created: new Date().toLocaleDateString(),
            month_created: "March",
            mood: "Happy",
            stress_level: 5,
            gratitude1: "A",
            gratitude2: "B",
            gratitude3: "C",
            notes: "test 3",
            userid: 1
        },
    ]
}

module.exports = {makeEntriesArray,}