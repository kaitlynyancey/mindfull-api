const EntriesService = {
    getAllEntries(knex) {
        return knex.select('*').from('mindfull_entries')
    },
    insertEntry(knex, newEntry) {
        return knex
            .insert(newEntry)
            .into('mindfull_entries')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('mindfull_entries').select('*').where('id', id).first()
    },
    deleteEntry(knex, id) {
        return knex('mindfull_entries')
            .where({ id })
            .delete()
    },
    updateEntry(knex, id, newEntryFields) {
           return knex('mindfull_entries')
             .where({ id })
             .update(newEntryFields)
         },
}

module.exports = EntriesService