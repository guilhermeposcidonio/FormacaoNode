const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const appointmentService = require('./services/AppointmentService');
const AppointmentService = require('./services/AppointmentService');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/agendamento');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/cadastro', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  var status = appointmentService.Create(req.body.name, req.body.email, req.body.description, req.body.cpf, req.body.date, req.body.time);
  if (status) {
    res.redirect('/');
  } else {
    res.send('Ocorreu uma falha !! ');
  }
});

app.get('/getcalendar', async (req, res) => {
  var appointments = await AppointmentService.GetAll(false);
  res.json(appointments);
});

app.get('/event/:id', async (req, res) => {
  var appointment = await AppointmentService.GetById(req.params.id);
  console.log(await AppointmentService.GetById(req.params.id));
  res.render('event', { appo: appointment });
});

app.post('/finish', async (req, res) => {
  var id = req.body.id;
  var result = await AppointmentService.Finish(id);
  res.redirect('/');
});

app.get('/list', async (req, res) => {
  // await AppointmentService.Search('');
  var appos = await AppointmentService.GetAll(true);
  res.render('list', { appos });
});

app.get('/searchresult', async (req, res) => {
  var appos = await AppointmentService.Search(req.query.search);
  res.render('list', { appos });
});

var pollTime = 5000;

setInterval(async () => {
  await AppointmentService.SendNotification();
}, pollTime);

app.listen(8080, () => {});
