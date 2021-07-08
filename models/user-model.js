const db = require('../db/dbConfig');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// server function to register a new user
async function register(user) {
    try {
        user.password = await bcrypt.hash(user.password, 14);

        const id = await db('users').insert(user);
        return findByEmail(user.email);
    } catch (err) {
        console.log(err)
    }
}

// Finds a user by email in the database
async function findByEmail(email) {
    console.log(email)
    try {
        const user = await db('users').select('*').where({ email }).first();
        console.log(user)
        return user;
    } catch (err) {
        console.log(err)
    }
}

// Finds a user by username in the database
async function findByUsername(username) {
    try {
        const user = await db('users').select('*').where(username).first();
        return user;
    } catch (err) {
        console.log(err)
    }
}

// Finds a user by ID
async function findById(id) {
    try {
        return db('users').select('*').where(id).first();
    } catch (err) {
        console.log(err)
    }
}

// function to send the email to reset a user's password: uses sgMail
async function sendEmail(email, token) {
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
        .then(() => {
            console.log('email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}
async function update(id, changes) {
    if (changes) {
        return db('users').where({ id }).update(changes)
            .catch(err => {
                console.log(err)
            })
    }
}

// Filter function
function filterBy(filter) {
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