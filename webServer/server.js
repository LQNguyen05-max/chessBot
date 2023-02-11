const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 


const app = express();
const port = 3000;

const jsChessEngine = require('js-chess-engine');
game = new jsChessEngine.Game();

chessStatus = game.exportJson();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join('../chess-bot-client/build')));


app.listen(port, () => {
   console.log("ChessBot server online!");
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});



app.post('/move/:from/:to', (req,res) => {
  const fromRequest = req.params.from
  const toRequest = req.params.to
  console.log(fromRequest, toRequest);

  try {
    const moveResponse = game.move(fromRequest, toRequest);
    res.send({message: moveResponse});

  }
  catch (error){
    console.log(error);
    res.status(404).json({error: "move error"})
  }

  game.printToConsole();
  chessStatus = game.exportJson()
})

app.get('/status', (req, res) => {
  console.log('Status Sent!');
  res.send(chessStatus);
})

app.post('/aimove/:level', (req, res) => {
  const levelRequest = req.params.level;
  
  try {
    const aiMoveResponse = game.aiMove(levelRequest);
    res.send({message: aiMoveResponse})
  }
  catch (error) {
    console.log(error);
    res.status(404).json({error: "ai move error"})
  }
  game.printToConsole();
  chessStatus = game.exportJson()

})

app.post('/resetGame', (req, res) => {
  game = new jsChessEngine.Game();
  chessStatus = game.exportJson();
  game.printToConsole();

  res.send("success!")
})



