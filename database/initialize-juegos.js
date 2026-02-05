/**
 * Archivo para inicializar la tabla videojuegos
 */

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
    
    const count = db.prepare('SELECT count(*) as total FROM videojuegos').get()
    if (count.total === 0) {
        
        const insert = db.prepare('INSERT INTO videojuegos (usuario_id, titulo, plataforma, genero, estado, imagen) VALUES (?, ?, ?, ?, ?, ?)');
        
        insert.run(1, 'Super Mario Odyssey','Switch','Aventura','Completado','https://m.media-amazon.com/images/I/91SF0Tzmv4L.jpgs');
        
        insert.run(1, 'The Legend of Zelda: Breath of the Wild','Switch','Aventura','Jugando','https://i.pinimg.com/736x/c8/6e/0e/c86e0e9293eb773f0450695bb6a57d78.jpg');
        
        insert.run(1, 'Elden Ring','PC','RPG','Pendiente','https://static.posters.cz/image/750/121753.jpg');
        
        insert.run(1, 'God of War','PlayStation','Accion','Completado','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk_BcRkD4UCXBPGhF-6StnpHwNgSc_mUq5bQ&s');
        
        insert.run(1, 'Hollow Knight','PC','Aventura','Jugando','https://m.media-amazon.com/images/I/81KuubwpqoL._AC_UF894,1000_QL80_.jpg');
    }

}