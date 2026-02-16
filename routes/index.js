var express = require('express');
var router = express.Router();

const Database = require('../database/database');
const UsuarioDAO = require('../database/usuario-dao');
const JuegosDAO = require('../database/juegos-dao');

const db = Database.getInstance();
const usuarioDAO = new UsuarioDAO(db);
const juegosDAO = new JuegosDAO(db);

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/perfil');
  }
  res.render('index', { title: 'Express' });
});

/* GET register page. */
router.get('/registro', function(req, res, next) {
  res.render('registro');
});

/* POST register page */
router.post('/registro', function(req,res,next){

  const { nickname, email, password } = req.body;

  const usuarioExistente = usuarioDAO.buscarUsuarioPorEmail(email);

  if (usuarioExistente) {
    return  res.render('registro', { error: 'El usuario ya existe' ,});
  }

  usuarioDAO.agregarUsuario(nickname, email, password);

  res.redirect('/');

})

/* POST login page */
router.post('/login', function(req,res,next){

  const { email, password } = req.body;

  const usuario = usuarioDAO.buscarUsuarioPorEmail(email);

  if (!usuario) return res.render('index', { error: 'Usuario no encontrado' });
  
  if (usuario.password === password) {

    req.session.user = usuario;
    // Redirigir a favoritos por defecto al iniciar sesión
    res.redirect('/perfil?favoritos=true');

  } else res.render('index', { error: 'Contraseña incorrecta' })
  
})

/* GET logout page */
router.get('/logout', function(req,res,next){
  req.session.destroy();
  res.redirect('/');
});

/*GET perfil page */
router.get('/perfil', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }

  // Obtener filtros de la consulta
  const filtros = req.query
  const juegos = juegosDAO.filtrarJuegos(req.session.user.id, filtros);

  // Los favoritos se manejan en el cliente con LocalStorage
  res.render('perfil', { juegos, user: req.session.user, filtros: filtros });
});

/*GET nuevo juego page */
router.get('/nuevo-juego', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('nuevo-juego');
});

/* POST nuevo juego */
router.post('/nuevo-juego', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  const { titulo, plataforma, genero, estado, imagen } = req.body;
  juegosDAO.agregarJuego(titulo, plataforma, genero, estado, imagen, req.session.user.id);
  res.redirect('/perfil');
});

/*GET editar juego page */
router.get('/editar', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  const juegoId = req.query.id; //parametro pasado en la URL
  const juego = juegosDAO.buscarJuegoPorId(juegoId);
  const urlOrigen = req.headers.referer || '/perfil'; // obtner url anterior para mantener filtros aplicados

  res.render('editar', { juego, urlOrigen });
});

/* POST eliminar juego */
router.post('/eliminar/:id', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const juegoId = req.params.id;
  juegosDAO.eliminarJuegoPorId(juegoId);

  res.redirect('back'); 
});

/* POST editar juego */
router.post('/editar/:id', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  const juegoId = req.params.id;
  const { titulo, plataforma, genero, estado, imagen, urlOrigen } = req.body;
  juegosDAO.editarJuego(juegoId, titulo, plataforma, genero, estado, imagen);

  res.redirect(urlOrigen || '/perfil'); 
});

/* API: POST nuevo juego (AJAX) */
router.post('/api/nuevo-juego', function(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }
  
  const { titulo, plataforma, genero, estado, imagen } = req.body;
  try {
    const juegoId = juegosDAO.agregarJuego(titulo, plataforma, genero, estado, imagen, req.session.user.id);
    res.json({ success: true, juegoId: juegoId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* API: POST editar juego (AJAX) */
router.post('/api/editar/:id', function(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }
  const juegoId = req.params.id;
  const { titulo, plataforma, genero, estado, imagen } = req.body;
  try {
    juegosDAO.editarJuego(juegoId, titulo, plataforma, genero, estado, imagen);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
