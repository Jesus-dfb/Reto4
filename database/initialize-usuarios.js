/**
 * Archivo para inicializar la tabla usuarios 
*/

module.exports = (db) => {

    const sql = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname VARCHAR(150) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `

    db.prepare(sql).run();

    const count = db.prepare('SELECT count(*) as total FROM usuarios').get()
    if (count.total === 0) {
        
        db.prepare('INSERT INTO usuarios (nickname, email, password) VALUES (?, ?, ?)').run(
            'user1',
            'user1@example.com',
            'password123'
        )
    }

}