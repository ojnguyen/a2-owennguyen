const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

/* Explaination of server:
  - This function(request, response) does not run now. Node stores it and calls it once per incoming HTTP request (GET, POST, etc.).
  - On a request, Node creates BOTH a request object and a response object.
  - Request object
    - Method (GET, POST, etc.), URL (path and query string), and header info
  - Response object
    - Initially empty (but already wired to client's open socket)
    - Status code, header info, and body content
    - "Returning" something is just writing into the response object
  - Again, both objects wrap the same 2-way TCP connection that was opened by the client (browser) when it made the request.
*/
const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

// NOTE: Data sent to the server via POST is stringified JSON, so we need to parse it into an object before we can use it
const handlePost = function( request, response ) {
  let dataString = ''

  // NOTE: The request object is a readable stream of data
  // Each time a "chunk" of data is available ('data' event), the callback will be called with that chunk
  request.on( 'data', function( data ) {
      dataString += data 
  })

  // When the request is finished being sent ('end' event), the callback will be called
  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

    // change this to incorporate data
    response.end('test')
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   // The function passed to readFile will read the file and then call the function with either an error or the file content
   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
