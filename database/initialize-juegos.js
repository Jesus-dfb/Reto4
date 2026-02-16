module.exports = (db) => {

    const sql = `
        CREATE TABLE IF NOT EXISTS videojuegos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            titulo VARCHAR(255) NOT NULL,
            plataforma VARCHAR(255) CHECK(plataforma IN ('PC', 'PlayStation', 'Xbox', 'Switch')) NOT NULL,
            genero VARCHAR(255) CHECK(genero IN ('Accion', 'Aventura', 'RPG', 'Deportes', 'Estrategia', 'Puzzle', 'Shooter', 'Simulacion', 'Terror')),
            estado VARCHAR(255) CHECK(estado IN ('Pendiente', 'Jugando', 'Completado', 'Abandonado')) DEFAULT 'Pendiente',
            imagen TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `

    db.prepare(sql).run();
    
}