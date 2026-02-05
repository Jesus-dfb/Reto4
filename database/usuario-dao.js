/**
 * Clase DAO para manejar operaciones relacionadas con usuarios en la base de datos.
*/

class UsuarioDAO {

    #database = null

    constructor(database) {
        this.#database = database
    }

    buscarUsuarioPorEmail(email) {

        const sql = 'SELECT * FROM usuarios WHERE email = ?'

        return this.#database.prepare(sql).get(email)

    }
    
    agregarUsuario(nickname, email, password) {

        const sql = 'INSERT INTO usuarios (nickname, email, password) VALUES (?, ?, ?)'

        const resultado = this.#database.prepare(sql).run(nickname, email, password)

        return resultado
    }

}

module.exports = UsuarioDAO;