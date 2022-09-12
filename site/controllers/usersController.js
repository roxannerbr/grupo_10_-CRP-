const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const usuarios = require('../data/users.json');
/* const { emitWarning } = require('process') */
const guardar = (dato) => fs.writeFileSync(path.join(__dirname, '../data/users.json')
    , JSON.stringify(dato, null, 4), 'utf-8')

module.exports = {
    
    register : (req,res) => {
        return res.render('register')
    },
    processRegister: (req,res)=>{
        let errors = validationResult(req)
        if (req.fileValidationError) {
            let imagen = {
                param: 'image',
                msg: req.fileValidationError,
            }
            errors.errors.push(imagen)
        }
        if (errors.isEmpty()) {
            let {Nombres, Apellidos, birth, gender, Correo, pass, address, category} = req.body
            let usuarioNuevo = {
                id:usuarios[usuarios.length - 1].id + 1,
                Nombres: Nombres,
                Apellidos: Apellidos,
                birth: birth,
                gender: gender,
                Correo: Correo,
                pass:bcrypt.hashSync(pass,10),
                address: address,
                category: 'user',
                imagen: req.file ? req.file.filename : "login.png"
            }
            usuarios.push(usuarioNuevo)
            guardar(usuarios)

            return res.redirect('/')
        } else {

            /* let ruta = (dato) => fs.existsSync(path.join(__dirname, '..', 'public', 'images', 'users', dato))
            if (ruta(req.file.filename) && (req.file.filename !== "default-image.png")) {
            fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'users', req.file.filename))
            } */
            
            /* return res.send(errors.mapped()) */
            return res.render('register', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },

    login : (req,res) => {
        return res.render('login')
    },
    processLogin: (req,res)=>{
        let errors= validationResult(req)
        if (errors.isEmpty()){
            //codigo de carpeta playground

            const {Correo,recordarme} = req.body
            let usuario = usuarios.find(user => user.Correo === Correo)

            req.session.userLogin = {
                id : usuario.id,
                name : usuario.name,
                image : usuario.image,
                category : usuario.category
            }
            if(recordarme){
                res.cookie('TiendAr',req.session.userLogin,{maxAge: 1000 * 60 * 60 * 24})
            }

            return res.redirect('/usuarios')
            /* return res.send(req.body) */
        } else {
            //return res.send(req.body)
            return res.render('login', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },

    usuarios : (req,res) => {
        return res.render('usuarios')
    },
    logout: (req,res)=>{
        req.session.destroy();
        return res.redirect('/')
    }
}