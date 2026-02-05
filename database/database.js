/**
 * Configuramos la conexión a la base de datos.
 * Vamos a implementar el patron Singleton para asegurarnos de que
 * solo exista una única conexión a la base de datos durante toda
 * la ejecución de la aplicación.
*/ 


class Database {

    static #db = null

    //impedimos que se pueda instanciar la clase
    constructor() { 
        throw new Error("No se puede instanciar la base de datos. Usa getInstance()")
    }

    //método para obtener la instancia de la base de datos
    static getInstance(dbPath) {

        if (Database.#db == null) {

            if(!dbPath) {

                throw new Error("Introduce el dbPath para inicializar la BD")

            } else {

                const BetterSqlite3 = require("better-sqlite3")
                Database.#db = new BetterSqlite3(dbPath)

                //Inicializamos las tablas necesarias para le funcionamiento de nuestra apliación

                require("./initialize-usuarios")(Database.#db)
                require("./initialize-juegos")(Database.#db)

            }

        }

        return Database.#db
    }

    //método para preparar sentencias SQL
    static prepare(sql) {

        return Database.#db.prepare(sql)

    }

}

module.exports = Database