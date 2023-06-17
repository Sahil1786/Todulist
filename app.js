const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");





const app = express();



const workItems=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

// new date base in mongo db

mongoose.connect("mongodb://127.0.0.1:27017/todoListDb").then(()=>{
    console.log("Connected db");
  })
  .catch((err)=>{
    console.log(err)
  })
  

// mongo shema

const itemSchema={
    name:String
};
// mongo modle
const Item=mongoose.model("item",itemSchema);

// itmes
const item1=new Item({
    name:"welcome to your todolist!"
});
const item2=new Item({
    name:"exits todolist!"
});

const item3=new Item({
    name:"=new todolist!"
});

// for showing in server side 
const defultsItems=[item1,item2,item3];

const ListSchema={
  name:String,
  items:[itemSchema]
  
};

const List= mongoose.model("list",ListSchema);



// if item is not found the show the items

app.get("/", function (req, res) {
  Item.find({}).then((founditems)=>{
 
    if(founditems.length===0){
      Item.insertMany(defultsItems)
.then(()=>{
    console.log("sucessful save defultItems to db");
  })
  .catch((err)=>{
    console.log(err)
  })
  
res.redirect("/");

    }else{
      res.render("list", { ListTittle: "Today", newListItems:founditems });
    }
    
  })
  
  .catch((err)=>{
    console.log(err)
  })


   
    // res.render('list');

});

app.get("/:customListName",function(req,res){
const customListName= req.params.customListName;

List.findOne({name:customListName})
.then((foundList,err)=>{
  if(!err){
  if(!foundList){
    const list =new List({
      name:customListName,
      items:defultsItems
    
    })
    list.save();
    //for again do the same in the web side 
    res.redirect("/"    + customListName);
    
  
  }
  else{
    res.render("list",{ ListTittle: foundList.name, newListItems:foundList.items });
  }
}
})




});


app.post("/",function(req,res){
   const  itemName= req.body.newItem;
const ListName=req.body.List;


// POST IN TODO LIST ID DB
const item=new Item ({
  name:itemName
});

if(ListName==="Today"){
  item.save();
  res.redirect("/");
} else{
  foundlist=List.findOne({name:ListName})
    .then((foundList)=>{
      foundList.Item.push(item);
      foundList.save();
      res.redirect("/" + ListName);
      
    }
    
    
    
    
    
    )
}



 
    
});


app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId)
  .then(()=>{
    console.log("sucessfully deleted the item");
  })
  .catch((err)=>{
    console.log(err);
  });
  res.redirect("/");

})

app.post("/work",function(req,res){
    let item =req.body.newListItems;
    workItems.push(item);
    res.redirect("/work");
})


app.listen(3000, function () {
    console.log("server is running on port 3000");
})
