

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


app.get('/comment/:email', (req, res) => {
    console.log('find user by', req.params.email)
    Comments.findOne({
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


app.post('/comment', (req, res) => {
    Comments.create({
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


app.put('/comment/:email', (req, res) => {
    console.log('route is being on PUT')
    Comments.findOne({ email: req.params.email })
    .then(foundComments => {
        console.log('Comments found', foundComments);
        Comments.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundComments.name,
            email: req.body.email ? req.body.email : foundComments.email,
            meta: {
                age: req.body.age ? req.body.age : foundComments.age,
                website: req.body.website ? req.body.website : foundComments.website
            }
        })
        .then(user => {
            console.log('Comments was updated', user);
            res.redirect(`/comment/${req.params.email}`)
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



app.delete('/comment/:email', (req, res) => {
    Comments.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});