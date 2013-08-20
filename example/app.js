'use strict';
Error.stackTraceLimit = Infinity;
var express = require('express'),
    http = require('http'),
    path = require('path'),
    formage = require('../index');


require('../CompileTempletes.js');

var app = express();

app.set('port', process.env.PORT || 8080);
app.set('mongo', process.env.MONGO_URL || 'mongodb://localhost/formage-admin-example');
app.set("view options", { layout: false, pretty: true });

app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('magical secret admin'));
app.use(express.cookieSession({cookie: { maxAge: 1000 * 60 * 60 *  24 }}));
app.use(express.static(path.join(__dirname, 'public')));
formage.serve_static(app, express);

app.configure('development', function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

app.use(app.router);

require('mongoose').connect(app.get('mongo'));
var admin = formage.init(app, express, require('./models'), {
    title: 'Formage-Admin Example'
});

admin.registerAdminUserModel();

app.get('/', function(req, res){
    res.redirect('/admin');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app;
