var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var cloudImg,cloud;

var obstacleImg1, obstacleImg2, obstacleImg3, obstacleImg4 ,obstacleImg5 ,obstacleImg6 ;
var obstacle;

var randomnum;

var newImage;

var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOverImg, restartImg, gameOver, restart;

var jumpSound , checkPointSound, dieSound;


function preload(){
  //loading the image for when the trex is running and collides with the obstacle
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //loading ground Image
  groundImage = loadImage("ground2.png");
  
  //loading cloud image
  cloudImg = loadImage("cloud.png");
  
  //loading images of different obstacles
  obstacleImg1 = loadImage("obstacle1.png");
  obstacleImg2 = loadImage("obstacle2.png");
  obstacleImg3 = loadImage("obstacle3.png");
  obstacleImg4 = loadImage("obstacle4.png");
  obstacleImg5 = loadImage("obstacle5.png");
  obstacleImg6 = loadImage("obstacle6.png");
  
  //loading gameover and restart images
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  //loading sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
  
  //create a ground sprite
  ground = createSprite(trex.x + 150,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating invisible ground
  invisibleGround = createSprite(trex.x + 250,190,600,10);
  invisibleGround.visible = false; 
  
  //create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //creating sprite for the game over image
  gameOver = createSprite(trex.x + 250,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //creating sprite for the restart image
  restart = createSprite(trex.x + 250,130);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw() {
  //set background color
  background(180);

  //setting score text according to position of trex
  text("Score: "+ score, trex.x+450,50);

  //setting position of different sprites according to position of trex
  invisibleGround.x = trex.x+ 250;
  gameOver.x = trex.x + 250;
  restart.x = trex.x + 250;
  
  //setting camera position 250 pixels ahead of trex'x position to get central view
  camera.position.x = (trex.x)+250;

  //adding conditions when gameState is play
  if(gameState === PLAY){
    //moving the trex
    trex.velocityX = 6
    
    //increasing the score by dividing the frameRate by 60
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space")&& trex.y >= 160) {
      //making trex jump
      trex.velocityY = -13;
      //adding sound to it
      jumpSound.play();
    }
    
    if (ground.x < trex.x - 50){
      //creating an infinite ground
      ground.x = trex.x + 150
    }
    
    //making the gameover and restart sprite invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //creating gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //subtracting 6 from camera position because due to trex's velocity 6 pixels is being incremented
    var cam = camera.position.x - 6

    //creating obstacle each time cam is a multiple of 100
    if(cam%100 === 0){
      spawnObstacles(); 
    }

    //creating cloud each time cam is a multiple of 100
    if(cam%150 === 0){
      spawnClouds(); 
    }

    //playing a sound in each 100 points
    if(score%100 === 0 && score>0) {
      checkPointSound.play();
    }
    
    if(obstaclesGroup.isTouching(trex)) {
      //switching to gameState end
      gameState = END;
      //playing sound
      dieSound.play();
    }
  }
  
  else if(gameState === END){
    //stop the ground
    trex.velocityX = 0;
    
    //changing trex's animation
    trex.changeAnimation("collided", trex_collided);
    
    //setting velocity to zero
    trex.velocityY = 0;
    
    //setting lifetime to -1 so that it never becomes 0 and the sprites don't disappear
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    
    //making the gameover and restart sprite visible
    gameOver.visible = true;
    restart.visible = true;
    
    //calling in reset function when pressed restart
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset() {
  //switching to gameState play
  gameState = PLAY;
  
  //setting score back to 0
  score = 0;
  
  //changing the animation to running
  trex.changeAnimation("running", trex_running);
  
  //destroying the clouds and obstacles
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}

//function to spawn the clouds
function spawnClouds(){
   cloud = createSprite(trex.x+550,50);
   cloud.addImage(cloudImg);
   
   cloud.scale = 0.5;
   
   //making clouds appear at random heights
   cloud.y = Math.round(random(10,100));
   
   //to keep trex in forefront and cloud in background
   cloud.depth = trex.depth;
   trex.depth = trex.depth +1;
   
   //giving lifetime to avoid memory leak
   cloud.lifetime = 150;
   
   //adding cloud to the group
   cloudsGroup.add(cloud);
}

function spawnObstacles() {
    obstacle = createSprite (trex.x + 550,170);
    
    obstacle.scale = 0.5;

    //giving lifetime to avoid memory leak
    obstacle.lifetime = 150;
    
    //creating different shaped obstacles randomly
    randomnum = Math.round(random(1,6));
    switch(randomnum) {
      case 1 : obstacle.addImage(obstacleImg1);
               break;
      case 2 : obstacle.addImage(obstacleImg2);
               break;
      case 3 : obstacle.addImage(obstacleImg3);
               break;
      case 4 : obstacle.addImage(obstacleImg4);
               break;
      case 5 : obstacle.addImage(obstacleImg5);
               break;
      case 6 : obstacle.addImage(obstacleImg6);
               break;
      default: break;
    }
  //adding obstacles to the group
  obstaclesGroup.add(obstacle);
}
