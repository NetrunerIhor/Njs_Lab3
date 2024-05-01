const http = require("http");
const fs = require('fs');
const os = require('os');
const zlib = require('zlib');

const server = http.createServer((request, response) => {
    response.setHeader("Content-Type", 'text/html; charset=utf-8;')
    
    if(request.url === "/home" || request.url === '/'){
        // response.writeFile("<h1>Сервер на Node.js[Михайлюк Ігор Ігорович]</h1>"0)
        fs.readFile("./home.html", (error,data) =>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            else{
                const dataText = data.toString();
                response.end(dataText);
            }  
        })
    }
    else if(request.url === '/about'){
        fs.readFile("./about.html", (error,data) =>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            else{
                const dataText = data.toString();
                response.end(dataText);
            }  
        })
    }
    else if(request.url ==='/getdata'){
        let now = Date.now();
        let timestamp = new Date(now).toISOString();
        let user = os.userInfo().username;

        let data = {
            date: timestamp,
            user: user
        };
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(data));
    }
    else if(request.url ==='/myfile'){
        var fileData = "data error";
        fs.readFile('./myfile.txt',(error,data) =>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            fileData = data.toString();
            
        })
        fs.readFile("./myfile.html", (error,data) =>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            else{
                const dataText = data.toString().replace(/{fileData}/g, fileData);
                response.end(dataText);
            }  
        })
    }
    else if(request.url === '/mydownload'){
        fs.access('./myfile2.txt',(error)=>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            else{
                response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Content-Disposition': 'attachment; filename="file2.txt"'
                  });
                  const fileStream = fs.createReadStream('./myfile2.txt');
                  fileStream.pipe(response);
                  response.end();
            }
        })
    }
    else if(request.url === '/myarchive'){
        fs.access('./myfile.txt',(error)=>{
            if(error){
                response.statusCode = 500;
                response.end("server error");
            }
            else{
                fs.readFile("./myfile.txt",(error,data)=>{
                    if(error){
                        response.statusCode = 500;
                        response.end("server error");
                    }
                    else{
                        zlib.gzip(data,(error,compressedData)=>{
                            if(error){
                                response.statusCode = 500;
                                response.end("server error");
                            }
                            else{
                                response.writeHead(200,{
                                    'Content-Type': 'application/gzip',
                                    'Content-Disposition': 'attachment; filename="file1.txt.gz"' 
                                });
                                response.end(compressedData);
                            }
                        });
                    }
                });

            }
        })
    }
    else{
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('404 Not Found');
    }
    // response.end("Hello Word!");
});
server.listen(3000);
