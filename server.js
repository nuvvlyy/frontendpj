//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
// app.use(express.static('/dist/frontend'));
//
// app.get('/*', function(req,res) {
//   res.sendFile(path.join(__dirname,'/dist/frontend/index.html'));
// });
app.use(express.static(path.join(__dirname, '/dist/frontend/')));
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/dist/frontend/"));
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4200);
// "postinstall": "ng build --prod --base-href frontend --build-optimizer --vendor-chunk --named-chunks false --output-hashing all
