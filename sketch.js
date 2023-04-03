//objetos
var gameOver
var GMimage
var gmtext
var gmtextimg
var trex,score;
var trex_running;
var trex_collided ;
var ground;
var invisibleGround;
var groundImage;
var cloud, cloudImage;
var obstaclesGroup;
var cloudsGroup;
//estados de juego
var gamestate = 1
var PLAY = 1
var END = 0
function preload(){
//animacion de t rex  
trex_running = loadAnimation("dinosaurio.png","dinosaurios2.png")
//imagenes de los objetos
cloudImage = loadImage("lanube.png");
groundImage = loadImage("ground2.png");
obstacle1 = loadImage("loscactus.png");
obstacle2 = loadImage("elcactus.png");
obstacle3 = loadImage("loscactus.png");
obstacle4 = loadImage("elcactus.png");
obstacle5 = loadImage("loscactus.png");
obstacle6 = loadImage("elcactus.png");
GMimage = loadImage("restart.png");
gmtextimg = loadImage("gameover.png");
trex_collided = loadAnimation("dinosaurioperdi.png")
Sound=loadSound("jump.mp3")
Sound1=loadSound("die.mp3")
Sound2=loadSound("checkpoint.mp3")
}
function setup() {
  //la pantalla
  createCanvas(windowWidth,windowHeight);
  //suelo falso
  ground = createSprite(width/2,height-10,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //trex
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)

  trex.scale = 0.7;
  //suelo real
  invisibleGround = createSprite(width/2,height-5,width,1);
  invisibleGround.visible = false;
  //puntaje

cloudsGroup = createGroup();
obstaclesGroup = createGroup();


gameOver = createSprite(width/2,height/2-50)
gameOver.addImage("restart",GMimage)
gameOver.scale=0.8
gameOver.visible=false;

gmtext = createSprite(width/2,height/2)
gmtext.addImage("gameov",gmtextimg)
gmtext.scale = 0.5
gmtext.visible=false
trex.setCollider("circle",0,0,40);
trex.debug=false

score=0;

}


function draw() {

  background(250);
  text("Puntuación:"+score,width-100,50);
  if(gamestate === PLAY) {
    ground.velocityX = -(4+3*score/100)
    score=score+Math.round(getFrameRate()/60)
    if(score>0 && score%100===0){
      Sound2.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if((touches.length>0 || keyDown("space"))&& trex.y >= height-100) {
      trex.velocityY = -10;
      Sound.play();
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)){
      gamestate = END
      Sound.play();
    }

  }
  else if(gamestate === END){
  ground.velocityX=0;
  trex.velocityY=0;
  trex.changeAnimation("collided",trex_collided)
  obstaclesGroup.setVelocityXEach(0)
  cloudsGroup.setVelocityXEach(0)
  trex.velocityY = trex.velocityY + 0.8;
  gameOver.visible = true
  gmtext.visible = true
  if(mousePressedOver(gameOver)){
  reset();

  }

  
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1); 
  }
 
  
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  drawSprites();

}
function reset(){
gamestate = PLAY
gmtext.visible = false
gameOver.visible = false
trex.changeAnimation("running",trex_running)
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
score=0;
}



function spawnClouds(){
  if(frameCount%60===0){
    cloud =createSprite(width,100,40,10);
    cloud.addImage(cloudImage);
  cloud.velocityX = -3;
  cloud.y = Math.round(random(10,height-200));
  cloud.scale= 1;
  cloud.depth = trex.depth ;
  trex.depth = trex.depth +1;
cloud.lifeTime = 200;
cloudsGroup.add(cloud);
  }
}
function spawnObstacles(){
if(frameCount%60 === 0){
var obstacle = createSprite(width,height-20,width,125)
obstacle.velocityX=-(6+score/100);

var rand= Math.round(random(1,6))
switch(rand){
case 1: obstacle.addImage(obstacle1)
break
case 2: obstacle.addImage(obstacle2)
break
case 3: obstacle.addImage(obstacle3)
break
case 4: obstacle.addImage(obstacle4)
break
case 5: obstacle.addImage(obstacle5)
break
case 6: obstacle.addImage(obstacle6)
break
default:break
}
obstacle.scale = 1
obstacle.lifeTime=300
obstaclesGroup.add(obstacle)
}
}