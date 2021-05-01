var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var db_global = require('./database');
var client = db_global.db;


function decisiones_list(req, res, next) {
    var queryLista = 'select * from aplicaciones_decision ' + " where status = 'A'";
    client.any(queryLista).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Recuperada lista de aplicaciones de bbdd'
        })
    })
        .catch(function (err) {
            return next(err);
        })
}

function decisiones_add(req, res, next) {
    var body = req.body;
    var obj = {
        gestionado: body.gestionado,
        tipo_aplicacion: body.tipo_aplicacion == 'null' ? null : body.tipo_aplicacion,
        criticidad: body.criticidad == 'null' ? null : body.criticidad,
        tipo_soporte: body.tipo_soporte == 'null' ? null : body.tipo_soporte,
        ur: body.ur == 'null' ? null : body.ur,
        valor: body.valor == 'null' ? null : body.valor,
        comentarios: body.comentarios == 'null' ? null : body.comentarios
    }
    var queryInsert = 'insert into aplicaciones_decision (gestionado, tipo_aplicacion, criticidad, tipo_soporte, ur, valor, comentarios, status)'
    +" values (${gestionado}, ${tipo_aplicacion}, ${criticidad}, ${tipo_soporte}, ${ur}, ${valor}, ${comentarios}, 'A')"
    client.any(queryInsert, obj).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Insertada decision de aplicaciones'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function decisiones_update(req, res, next) {
    var body = req.body;
    var obj = {
        id: body.id,
        gestionado: body.gestionado,
        tipo_aplicacion: body.tipo_aplicacion == 'null' ? null : body.tipo_aplicacion,
        criticidad: body.criticidad == 'null' ? null : body.criticidad,
        tipo_soporte: body.tipo_soporte == 'null' ? null : body.tipo_soporte,
        ur: body.ur == 'null' ? null : body.ur,
        valor: body.valor == 'null' ? null : body.valor,
        comentarios: body.comentarios == 'null' ? null : body.comentarios
    }
    var queryInsert = 'insert into aplicaciones_decision (gestionado, tipo_aplicacion, criticidad, tipo_soporte, ur, valor, comentarios, status)'
    +" values (${gestionado}, ${tipo_aplicacion}, ${criticidad}, ${tipo_soporte}, ${ur}, ${valor}, ${comentarios}, 'A')";
    var queryUpdate = 'update aplicaciones_decision' + " set status = 'U', ts_update = date_part('epoch'::text, now()) "
        + 'where id = ${id}';
    client.any(queryInsert, obj).then(function (data) {
        client.any(queryUpdate,obj).then(function(data){
            res.status(200).json({
                status: 'success',
                data: data,
                message: 'Actualizada decision de aplicaciones'
            })
        }).catch(function (err){
            return next(err);
        })
    }).catch(function (err) {
        return next(err);
    })
}

function decisiones_delete(req, res, next) {
    var body = req.body;
    var obj = {
        id: body.id
    }
    var queryDelete = 'update aplicaciones_decision set '+ "status =  'D', ts_update = date_part('epoch'::text, now()) where id = ${id}"
    client.any(queryDelete, obj).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Borrada decision de aplicaciones'
        })
    }).catch(function (err) {
        return next(err);
    })
}

module.exports = {
    decisiones_list: decisiones_list,
    decisiones_add: decisiones_add,
    decisiones_update:decisiones_update,
    decisiones_delete:decisiones_delete
};