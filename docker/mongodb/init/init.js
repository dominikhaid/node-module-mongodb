db.createUser(
{
    user: "myUser",
    pwd: "myPassword",
    roles: [
      { role: "readWrite", db: "public" }
    ]
})



// db.createCollection( 'users',
//    {
//      capped: false,
//      autoIndexId: true       // Added in MongoDB 3.4
//    }
// )

