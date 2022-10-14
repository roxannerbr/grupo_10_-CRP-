const {check, body}=require ('express-validator');

module.exports=[
    /* nombre */
    check('Nombres').trim().notEmpty().withMessage('Campo obligarorio').bail(),
    
    /* apellido */
    check('Apellidos').trim().notEmpty().withMessage('Campo obligatorio').bail(),
    
    /* email */
    check('email').trim().notEmpty().withMessage('Debes agregar un email ').isEmail().withMessage('Debes agregar un email válido').bail(),
    
    /* password */
    check('pass').trim().isLength({min:6}).withMessage('Debe contener al menos 6 caracteres').bail(),
    
    /* password2 */
    check('pass2').trim().notEmpty().withMessage('Las contraseñas deben coincidir').bail(),
    
    /* terminos */
    check('Terminos').trim().notEmpty().withMessage('Debes aceptar los terminos y condiciones para continuar').bail(),
    
    /* confirmacion de contraseñas */
    body('pass2')
    .custom((value,{req}) => value !== req.body.pass ? false : true)
    .withMessage('Las contraseñas no coinciden')
]