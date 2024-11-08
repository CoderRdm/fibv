const express = require ('express');
const app = express();
const path=require('path');
const userModel =require('./models/user');
const cookieParser =require('cookie-parser');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');

const sellerModel =require('./models/seller')
const gigModel=require('./models/gig')

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/', (req,res) => {
    
    res.render("index",);
  
})
app.get('/read', async (req,res) => {
    let users= await userModel.find();
    res.render("read",{users});
  
})
app.get('/readgig', async (req,res) => {
    let gigs= await gigModel.find();
    res.render("readgig",{gigs});
  
})
app.get('/readseller', async (req,res) => {
    let sellers= await sellerModel.find();
    res.render("readseller",{sellers});
  
})

app.get('/delete/:id', async (req,res) => {
    let users= await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
  
})
app.get('/edit/:id', async (req,res) => {
    let user= await userModel.findOne({_id:req.params.id});
    res.render("edit",{user});
  
})
app.post('/update/:id', async (req,res) => {
    let {name,email,image}=req.body;
    let user= await userModel.findOneAndUpdate({_id:req.params.id},{image,name,email},{new:true});
    res.redirect("/read");
  
})

app.post('/create', async (req,res) => {
let{name,email,password,age}=req.body;
bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(password,salt,async  (err,hash) => {
        let createduser= await userModel.create({
            name, 
            email,
           password: hash,
            age
        });
      
    })  
})

let token =jwt.sign({email},"secret");
res.cookie("cookie",token);

res.redirect("/");
});

app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
})

app.get("/login",function(req,res){
    res.render("login");
})


app.post('/creategig', async (req,res) => {
    let{title,price,category,description,workexperience}=req.body;
    let createdgig= await gigModel.create({
        title,
        price,
        category,
        description,
        workexperience
    });
    
    
    res.send(createdgig);
    console.log(createdgig)
    });

app.get('/tasks',(req,res) => {
    res.render("tasks");
  
}
)
app.get('/seller',(req,res) => {
    res.render("seller");
  
}
)
app.post('/createseller', async (req,res) => {
    let{bio,qualification,skills,residence}=req.body;
    let createdseller= await sellerModel.create({
        bio,
        qualification,
        skills,
        residence,
        
    });
    
    
    res.send(createdseller);
    console.log(createdseller)
    });


app.get('/uploadgig',(req,res) => {
    res.render("gig")
  
}

)

app.post("/uploadgig",async function(req,res){
    let user = await  userModel.findOne({email:req.body.email});
 console.log(user);
    if(!user) return res.send("something is wrong");
    bcrypt.compare(req.body.password,user.password,function (err, result)  {
     if(result)   
     {
         let token =jwt.sign({email:user.email},"secret");
 res.cookie("cookie",token);
 res.send("hjgedj")
     }
     
      
    }
    )
 
 })
 



app.get('/client',(req,res) => {
    res.send("chal rha client")
  
}
)
app.get('/clientorders',(req,res) => {
    res.send("chal rha client ke orders")
  
}
)







app.listen (3000);