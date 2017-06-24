const http=require("http");
const express=require("express");
const mysql=require("mysql");
const qs=require("querystring");

//创建连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    database:"xincheng",
    user:"root",
    password:"",
    connectionLimit:10
});

var app=express();
http.createServer(app).listen(8990);

//访问静态资源中间件
app.use(express.static("./"));

//注册
app.post("/zhuce",(req,res)=>{
    console.log(1);
    req.on("data",(buf)=>{
        var obj=qs.parse(buf.toString());
        console.log(obj);
        pool.getConnection((err,conn)=>{
            if(err) throw err;
            conn.query("INSERT INTO users VALUES(null,?,?,?)",[obj.uname,obj.email,obj.upwd],(err,result)=>{
                if(err) throw err;
                console.log(result);
                res.json({code:1,msg:"success!"});
                conn.release();
            })
        })
    })
});
//登陆
app.post("/login",(req,res)=>{
    req.on("data",(buf)=>{
        var obj=qs.parse(buf.toString());
        pool.getConnection((err,conn)=>{
            if(err) throw err;
            conn.query("SELECT * FROM users WHERE uname=? AND upwd=?",[obj.uname,obj.upwd],(err,result)=>{
                if(err) throw err;
                console.log(result);
                if(result){
                    res.json({code:1,msg:"success!"});
                }
                conn.release();
            })
        })
    })
})

