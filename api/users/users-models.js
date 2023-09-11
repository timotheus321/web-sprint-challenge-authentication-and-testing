const db = require('../../data/dbConfig');  



function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
    console.log("Filter used in findBy:", filter);
  return db('users').where(filter);
}

async function addUser(user) {
    console.log("User data in addUser:", user);
  const [id] = await db('users').insert(user, 'id');
  return findById(id);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

module.exports = {
    addUser,
    find,
    findBy,
    findById,
    
  };