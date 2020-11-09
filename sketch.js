var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage;
var obstaclesGroup, obstacle;

var score=0;

var gameOver, restart;
localStorage["HighestScore"] = 0;


function preload(){
  bg=loadImage("bg.png")
  mario_running =   loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  groundImage = loadImage("ground2.png");
  
  brickImage = loadImage("brick.png");
  
  obstacleimage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
 mario = createSprite(50,140,20,20);
 mario.addAnimation("running",mario_running);
 mario.addAnimation("collided",mario_collided);
 mario.scale=1;

  ground =createSprite(200,190,1500,20);
  ground.addImage(groundImage);
 // ground.x=ground.width/2;
  ground.velocityX=-(6+3*score/100);
  ground.scale=0.6;

  invisibleGround=createSprite(200,180,1000,20);
  invisibleGround.visible=false;
  
  restart=createSprite(250,110,10,10);
  restart.addImage(restartImg);
  restart.visible=false;
  restart.scale=0.4;

   gameOver=createSprite(250,90,10,10);
   gameOver.addImage(gameOverImg);
   gameOver.visible=false;
   gameOver.scale=0.5;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  console.log(gameState)
 
  if (gameState===PLAY){
    if(ground.x<0){
      ground.x=ground.width/2;
    
    }
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && mario.y >= 150) {
      mario.velocityY = -12;
    }
    
  
    mario.velocityY = mario.velocityY + 0.8
  
   /* if (ground.x < 0){
      ground.x = ground.width/2;
    }*/
  
    mario.collide(invisibleGround);
    spawnBricks();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
      gameState = END;
  }
  if(bricksGroup.isTouching(mario)){
    score=score+50;
    bricksGroup.destroyEach();
  }

  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  stroke("red");
  fill("red");
  textSize(18);
  text("Score :"+score,510,30);
  
  drawSprites();
  
  
 
}
function spawnBricks() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    brick = createSprite(600,120,40,10);
    brick.y = Math.round(random(80,120));
    brick.addImage(brickImage);
    brick.scale = 0.9;
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 200;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    bricksGroup.add(brick);
  }
  
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
     obstacle = createSprite(600,145,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
   // var rand = Math.round(random(1,6));
   obstacle.addAnimation("Obstacle",obstacleimage);
    
    
    //assign scale and lifetime to the obstacle           
    
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}