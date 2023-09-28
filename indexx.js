var express = require('express');
const app = express();
var passwordHash = require("password-hash");
const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static("public"));
const port = 3007

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render('home');
})

app.get("/signin", (req,res) => {
    res.render('signin');
})
app.get("/brazil", (req,res) => {
    res.render('brazil');
    console.log(req.body);
})
app.get("/aus", (req,res) => {
    res.render('aus');
    console.log(req.body);
})
app.get("/maldives", (req,res) => {
    res.render('maldives');
    console.log(req.body);
})
app.get("/kerala", (req,res) => {
    res.render('kerala');
    console.log(req.body);
})
// Define a route for the traveling map page










    app.post("/signupsubmit", function(req, res) {
        console.log(req.body);
        db.collection("userDemo")
            .where(
                Filter.or(
                    Filter.where("email", "==", req.body.email),
                    Filter.where("user_name", "==", req.body.user_name)
                )
            )
            .get()
            .then((docs) => {
                if (docs.size > 0) {
                    res.send("Hey, this account already exists with the email and username.");
                } else {
                    db.collection("userDemo")
                        .add({
                            user_name: req.body.user_name,
                            email: req.body.email,
                            password: passwordHash.generate(req.body.password),
                        })
                        .then(() => {
                            // // Specify the correct file path to your "signin" page
                            // res.sendFile(__dirname + "/views/signin");

                            // const filePath = path.join(__dirname, "views", "signin");
                            // res.sendFile(filePath);
                            res.redirect("/signin");
                        })
                        .catch(() => {
                            res.send("Something Went Wrong");
                        });
                }
            });
    });
    
    





    app.post("/signinsubmit", function(req,res){
        db.collection("userDemo")
            .where("email", "==",req.body.email)
            .get()
            .then((docs) => {
                let verified = false;
                docs.forEach((doc) => {
                    verified = passwordHash.verify(req.body.password, doc.data().password)
                });

                if(verified){
                    // res.sendFile(__dirname + "/views/" + "dashboard");
                    res.redirect("/dashboardd");
                } else{
                    res.send("Fail");
                }
            })
    })
    app.get("/contact",(req,res) =>{
           res.render('contact');
          })


    // app.post("/contactsubmit", function(req,res){
    //     db.collection("userDemo")
    //         .where("name", "==",req.body.name)
    //         .where("email", "==",req.body.email)
    //         .where("number", "==",req.body.number)
    //         .where("message", "==",req.body.message)
    //         .get()
    //         .then((docs) => {
    //             let verified = false;
    //             docs.forEach((doc) => {
    //                 verified = passwordHash.verify(req.body.email, doc.data().email)
    //             });

    //             if(verified){
    //                 // res.sendFile(__dirname + "/views/" + "dashboard");
    //                 res.redirect("/dashboard");
    //             } else{
    //                 res.send("Fail");
    //             }
    //         })
    //     })


        app.get("/contactsubmit", (req, res) => {
                const name = req.query.name;
                const email = req.query.email;
                const number= req.query.number;
                const message = req.query.message;
            
                // Adding new data to the collection
                db.collection('userDemo').add({
                    name: name,
                    email: email,
                    number:number,
                    message: message,
                })
                .then((docs) => {
                    if(docs.size > 0) {
                                        res.send("Hey this account is already exits with email and username")
                                    } else{
                                        db.collection("userDemo")
                                            .add({
                                                user_name:req.body.user_name,
                                                email:req.body.email,
                                                password:passwordHash.generate(req.body.password),
                                            })
                                            .then(() => {
                                                res.sendFile(__dirname + "/views/" + "contact");
                                            })
                                            .catch(() => {
                                                res.send("Something Went Wrong")
                                            });
                                    }
                                });
                        });
            
                // 
            
    // app.get("/contact",(req,res) =>{
    //     res.render('contact');
    //   })
      
    //   app.post('/contactsubmit',(req,res) => {
          
    //     const name = req.body.name;
    //     const email = req.body.email;
    //     const number= req.body.number;
    //     const message = req.body.message;
    //     db.collection('userDemo')
    //         .add({
    //           name:name,
    //           email:email,
    //           number:number,
    //           message:message,
    //         })
    //         .then(() => {
    //           res.render("contact");
    //         });
      
    //   });
     
   

app.get("/signup", (req, res) => {
    res.render('signup'); 
});

app.get("/home", (req, res) => {
    res.render('home'); 
});

app.get("/dashboardd", (req, res) => {
    res.render('dashboardd'); 
});
app.get("/travellingmap", (req, res) => {
    res.render('travellingmap');
});




app.get("/logout", (req, res) => {
    res.render('logout'); 
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
 });
 
//app.listen(port, () => {
    //console.log(Server is running on port ${port});
//});