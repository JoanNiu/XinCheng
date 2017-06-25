const http=require("http");
const express=require("express");
const mysql=require("mysql");
const qs=require("querystring");

//创建连接池
var pool=mysql.createPool({
    host:"w.rdc.sae.sina.com.cn",
    database:"app_joan",
    user:"1j1k1o2z10",
    port:3306,
    password:"iy0zkhxlhwyhh5x2kj23kw3k3ykzyl05k51z3iyi",
    connectionLimit:30
});

var app=express();
http.createServer(app).listen(5050);

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

