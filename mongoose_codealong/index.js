const express = require('express');
const app = express();
const mongoose = require('mongoose');
const comment = require('./schemas/comment');
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



app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.get('/posts/:title', (req, res) => {
    console.log('find Post by', req.params.title)
    Post.findOne({
        title: req.params.title
    })
    .then(post => {
        console.log('Here is the Post', post.title);
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
        body: req.body.body
    })
    .then(post => {
        console.log('New Post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});


app.put('/posts/:title', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ title: req.params.title })
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findOneAndUpdate({ title: req.params.title }, 
        { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.title}`)
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



app.delete('/posts/:title', (req, res) => {
    Post.findOneAndRemove({ title: req.params.title })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.title} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});



//===========================Comments


app.get('/comment', (req, res) => {
    Comments.find({})
    .then(comment => {
        console.log('All comment', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.get('/comment/:header', (req, res) => {
    console.log('find user by', req.params.header)
    Comments.findOne({
        header: req.params.header
    })
    .then(comment => {
        console.log('Here is the user', comment.title);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


app.post('/comment', (req, res) => {
    Comments.create({
        header: req.body.header,
        content: req.body.content
    })
    .then(comment => {
        console.log('New comment =>>', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});


app.put('/comment/:header', (req, res) => {
    console.log('route is being on PUT')
    Comments.findOne({ header: req.params.header })
    .then(foundComments => {
        console.log('Comments found', foundComments);
        Comments.findOneAndUpdate({ header: req.params.header }, 
        { 
            header: req.body.header ? req.body.header : foundComments.header,
            body: req.body.body ? req.body.body : foundComments.body
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



app.delete('/comment/:header', (req, res) => {
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

