const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Comment = require('./schemas/comment');
const Post = require('./schemas/post');
const User = require('./schemas/user');
const Port = 8000;
const mongoDB = 'mongodb://127.0.0.1/mongoose-codealong'


// const chris = new User({
//     name: 'Doug',
//     email: 'doug@gmail.com',
//     meta: {
//         age: 27,
//         website: 'https://chris.me'
//     }
// });

// chris.save((err) => {
//     if (err) return console.log(err);
//     console.log('user created')
// })


mongoose.connect(mongoDB, {useNewUrlParser: true});

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to mongoDB at', db.host,':', db.port);
})

db.once('error', (error) => {
    console.log(`Database error: ${error}`)
});


app.use(express.urlencoded({ extended: false}));


//==== HOME for POSTMAN

app.get('/' , (req, res) => {
    res.json({
        message: 'wellcome to our API'
    })
});

app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});


app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.redirect(`/users/${req.params.email}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});



app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


//======================================POST


app.get('/posts/:id', (req, res) => {
    console.log('find post by ID', req.params.id);
    // console.log(mongoose.Types.ObjectId(req.params.id))
    Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).populate('comments').exec()
    .then(post => {
        console.log('Here is the post', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/posts/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findById(req.params.id)
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findByIdAndUpdate(req.params.id, { 
                title: req.body.title ? req.body.title : foundPost.title,
                body: req.body.body ? req.body.body : foundPost.body,
        }, { 
            upsert: true 
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});


app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `Post ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});



//===========================Comments


app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comment => {
        console.log('All comment', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.get('/comments/:id', (req, res) => {
    console.log('find user by', req.params.id)
    Comment.findById(req.params.id)
    .then(comment => {
        console.log('Here is the user', comment.title);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('Heyyy, this is the post', post);
        // create and pust comment inside of post
        Comment.create({
            header: req.body.header,
            content: req.body.content
        })
        .then(comment => {
            post.comments.push(comment);
            // save the post
            post.save();
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.put('/comments/:header', (req, res) => {
    console.log('route is being on PUT')
    Comments.findOne({ header: req.params.header })
    .then(foundComments => {
        console.log('Comments found', foundComments);
        Comments.findOneAndUpdate({ header: req.params.header }, 
        { 
            header: req.body.header ? req.body.header : foundComments.header,
            content: req.body.content ? req.body.content : foundComments.content
        })
        .then(comment => {
            console.log('Comments was updated', comment);
            res.redirect(`/comment/${req.params.header}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});



app.delete('/comments/:header', (req, res) => {
    Comments.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.header} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


// app.get('/', (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) return res.send('Failed to find record', err);
//     res.send(users);
//   })
// });

// app.get('/findById/:id', (req, res) => {
//     User.findById(req.params.id, (err, users) => {
//       if (err) return res.send('Failed to find record', err);
//       res.send(users);
//     })
//   });

//Mongoose create statements





// User.create({
//     name: 'with Create()',
//     email: 'test@test.com'
// })


// Post.create({
//     content: 'This is Post content'
// });

// Mongoose update statements

// User.updateOne({name: 'Chris'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if (err) return console.error(err);
//     console.log(`updated user: ${updateOutcome.matchedCount}: ${updateOutcome.modifiedCount}`);
// });

// User.findOneAndUpdate({name: 'Chris'},
// {
//     meta: {
//         website: 'SomethingNew@mail.com'
//     }
// }, (err, user) => {
//     if (err) return console.error(err);
//     console.log(user)
// });

// mongoose delete statements


// deletes all
// User.remove({name: 'Chris'}, (err) => {
//     if (err) return console.error(err);
//     console.log('deleted')
// })

//deletes one
// User.findOneAndRemove({name: 'boddy'}, (err, user) => {
//     if (err) console.log(err);
//     console.log('deleted');
// });


// Post Schema with association to comments

// const newPost = new Post({
//     title: ' our first post',
//     body: 'some text for our body'
// });

// newPost.comments.push({
//     header: 'our first comment',
//     content: 'the firs text'
// });

// newPost.save( (err) => {
//     if (err) return console.log(err)
//     console.log('created')
// })


// const refPost = new Post({
//     title: 'Post with ref to comments',
//     body: 'ooh boy, here we go'
// })

// Post.findOne({}, (err, post) => {
//     Post.findById(order._id).populate('comments').exec((err, post) => {
//         console.log((post);
//     });
// })




app.listen(Port, () => {
    console.log('server running on port', Port);
})

