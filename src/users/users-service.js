const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('mindfull_users')
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('mindfull_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('mindfull_users').select('*').where('id', id).first()
    },
    deleteUser(knex, id) {
        return knex('mindfull_users')
            .where({ id })
            .delete()
    },
    updateUser(knex, id, newUserFields) {
           return knex('mindfull_users')
             .where({ id })
             .update(newUserFields)
         },
}

module.exports = UsersService