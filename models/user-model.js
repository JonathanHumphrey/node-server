const db = require('../db/dbConfig');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function register(user) {
    try{
       user.password = await bcrypt.hashSync(user.password, 14);
       
       const id = await db('users').insert(user);
       return findByEmail(user.email);
    } catch(err) {
        console.log(err)
    }
}
async function findByEmail (email){
    try{
        const user = await db('user').select('*').where({ email }).first();
        return user;
    } catch(err) {
        console.log(err)
    }
}
async function findByUsername (username){
    try{
        const user = await db('user').select('*').where(username).first();
        return user;
    } catch(err) {
        console.log(err)
    }
}
async function findById(id){
    try{
       return db('users').select('*').where(id).first();
    } catch(err) {
        console.log(err)
    }
}
async function sendEmail(email, token){
    const msg = {
        to: email, 
        from: 'jonny105596@outlook.com',
        subject: 'Password Reset Link',
        html: `
            <div>
                <a href=${process.env.CLIENT_URL}/reset-password/${token}> reset</a>
            </div>
        `
    };
    sgMail
        .send(msg)
        .then(() =>{
            console.log('email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}
async function update(id, changes) {
    if(changes){
        return db('users').where({id}).update(changes)
            .catch(err => {
                console.log(err)
            })
    }
}

function filterBy(filter){
    return db('users').where(filter).first();
}
module.exports = {
    register, 
    findByEmail,
    findByUsername,
    findById,
    update, 
    filterBy, 
    sendEmail,

}