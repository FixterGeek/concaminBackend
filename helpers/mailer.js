const nodemailer = require('nodemailer');

const url = "https://concamin.herokuapp.com/"
const url2 = "https://concamin-c2a9c.firebaseapp.com/signup/?next=/main/groups/accept/"

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'fixtergeek@gmail.com', // generated ethereal user
        pass: 'Poweroso1704@' // generated ethereal password
    }
});

exports.sendInvite = (token, email) => {
    let mailOptions = {
        from: '"Concamin 👻" <fixtergeek@gmail.com>', // sender address
        to: [email], // list of receivers
        subject: 'Te han invitado a un grupo ✔', // Subject line
        //text: 'Hello world?', // plain text body
        html: `
            <h3>Has sido invitado a unirte!</h3>
            <p>Ahora solo falta, que aceptes la invitación</p>
            <a href=${url}groups/invite/accept/${token}>Aceptar</a>
        ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

exports.sendInviteNonMember = (token, email) => {
    let mailOptions = {
        from: '"Concamin 👻" <fixtergeek@gmail.com>', // sender address
        to: [email], // list of receivers
        subject: 'Te han invitado a un grupo ✔', // Subject line
        //text: 'Hello world?', // plain text body
        html: `
            <h3>Has sido invitado a unirte!</h3>
            <p>Para unirte al grupo debes crear una cuenta!</p>
            <a href=${url2}${token}>Registrarme</a>
        ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

