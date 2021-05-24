//gameState
var PLAY = 1;
var END = 0;
var gamestate = PLAY;

//vampire
var vampire, vampire_running, vampire_collided;

//ground
var ground, invisibleGround, groundImage;

//backGround
var bg, bgImg;

//bloodBag
var bloodBagGroup, bloodBagImage;

//var torches & windows = obstacle's
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

//backup obstacle's variable
var obstacle5, obstacle6;

//score
var score = 0;

//gameOver & restart
var gameOver, gameOverImg, restart, restartImg;

//torches group;
//var torchesGroup;

//sounds
//-
//-

function preload(){
    //sounds
    //-
    //-
    
    //background
    bgImg = loadImage("bg.png");

    //vampire_running & vampire_collided
    vampire_running = loadAnimation("V1.png","V2.png","V3.png");
    vampire_collided = loadAnimation("vampire_collided.png");

    //groundImage
    groundImage = loadImage("ground2.png");

    //bloodBag
    bloodBagImage = loadImage("bloodbag.png");

    //obstacles(Window's & Torches)
    obstacle1 = loadImage("window1.png");
    obstacle2 = loadImage("window2.png");
    obstacle3 = loadImage("torch2.png");
    obstacle4 = loadImage("torchObstacle1.png");

    //gameOverImg & restartImg
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

 function setup(){
    //canvas 
    createCanvas(windowWidth, windowHeight);    //displayWidth & displayHeight are used for running this game in any device.

    //vampire
    vampire = createSprite(50, height -70, 20, 50);
     
     //vampire Animantion
     vampire.addAnimation("running", vampire_running);
     vampire.addAnimation("collided", vampire_collided);

      //vampire scale not sure yet
      //-
      //-
      //-

    //invisibleGround
    invisibleGround = createSprite(width/2, height -10, width, 125);   //"width" it will atomatically check the resolution and keep
                                                                       //invisble ground in whole display according the codinates 
    invisibleGround.visible = false;

    //ground
    ground = createSprite(width/2, height, width, 2);
    ground.addImage("ground", groundImage);
    ground.x = ground.width/2;
    ground.velocityX = -(6 + 3*score/100);

    //gameOver
    gameOver = createSprite(width/2, height/2 -50);
    gameOver.addImage(gameOverImg);
    //gameOver.scale = __
    gameOver.visible = false;

    //restart
    restart = createSprite(width/2, height/2);
    restart.addImage(restartImg);
    //restart.scale = __
    restart.visible = false;

    //groups
    bloodBagGroup = new Group();
    obstaclesGroup = new Group();
    //torchesGroup = new Group();
   
    //score
    score = 0;
 }

 function draw(){
     //vampire debug
     vampire.debug = false; //we don't want green circle now(turn false to true for showing debug circle)

     //background
     background(bgImg);

     //score
     textSize(20);
     fill("black");
     text("Score: " + score, 30, 50);

     //if() condition for gameState
     if(gamestate === PLAY){
         score = score + Math.round(getFrameRate()/60);
         ground.velocityX = -(6 + 3*score/100);

         if((touches.length > 0 || keyDown("SPACE")) && vampire.y >= height-120){
             //jump sound
             vampire.velocityY = -20;
             touches = [];

          //if(keyDown("SHIFT")){
             // vampire.velocityY = -40;
          //}   
         }

    //Gravity
    vampire.velocityY = vampire.velocityY + 0.8;

    //if() condition for ground
    if(ground.x < 0){
        ground.x = ground.width/2;
    }

    //vampire collide with invisible ground
    vampire.collide(invisibleGround);
    spawnbloodBag();
    spawnObstacles();
    //spawnTorches();
     

     //if() condition for obstacleGroup touching  vampire
     if(obstaclesGroup.isTouching(vampire)){
         //collidedSound
         gameState = END;
     }
     //if(torchesGroup.isTouching(vampire)){
       //  gameState = END;
     //}
    }
 else if(gameState === END) {
     
    //gameOver & restart visiblity
    gameOver.visible = true;
     restart.visible = true;

   //Stopping every objects;
   ground.velocityX = 0;
   vampire.velocityY = 0;
   obstaclesGroup.setVelocityXEach(0);
   bloodBagGroup.setVelocityXEach(0);
   torchesGroup.setVelocityXEach(0);

   //change the vampire animation
   vampire.changeAnimation("collided", vampire_collided);

   //lifetime to object's
   obstaclesGroup.setLifetimeEach(-1);
   bloodBagGroup.setLifetimeEach(-1);
   torchesGroup.setLifetimeEach(-1);

   //reset button
   if(touches.length > 0 || mousePressedOver(restart)){
       reset();
       touches = []
   }
 }

 drawSprites();
}

//function's

// (1) spawn bloodBag()
function spawnbloodBag(){
  if(frameCount % 60 === 0){
      //bloodBag
      var bloodBag = createSprite(width + 20, height -600, 40, 10);
      var r = Math.round(random(1,2));
      switch(r) {
          case 1: bloodBag.addImage(bloodBagImage);
                  break;
          case 2: bloodBag.addImage(obstacle4);
                  break;
         default: break;
      }
       bloodBag.scale = 0.3;
       bloodBag.velocityX = -3;

       //life time
       bloodBag.lifetime = 600;

       //depth
       bloodBag.depth = vampire.depth;
       vampire.depth = vampire.depth + 1;

       //adding Each bloodBag to group
       bloodBagGroup.add(bloodBag);
  }
}

// (2) spawn Obstacles()
function spawnObstacles(){
if(frameCount % 60 === 0 ){
    //obstacle
    var obstacle = createSprite(600, height -150, 20, 30);
    obstacle.setCollider('circle', 0, 0, 45);
    //obstacle.debug = true
    obstacle.velocityX = -(  6 + 3*score/100);

    //generate randome obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      //case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }

    obstacle.scale = 0.5
    obstacle.lifetime = 600;

    //depth
    obstacle.depth = vampire.depth;
    vampire.depth = vampire.depth + 1;

    //adding Each obstacle to group
    obstaclesGroup.add(obstacle);
 }
}

//try
//function spawnTorches(){
 //if(frameCount % 60 === 0){
  //   var torches = createSprite(600, height - 95, 20, 30);
  //   torches.setCollider('circle', 0, 0, 45);
  //   torches.velocityX = -(6 + 3*score/100);
//
   //  var ranndom = Math.round(random(1,2));
   //  switch(random){
   //      case 1: obstacle.addImage(obstace3);
  //       break;
   //      default: break;
   //  }
//
     //torches.scale = __
    // torches.lifetime = 600;

     //depth
    // torches.depth = vampire.depth;
     //vampire.depth = vampire.depth + 1;

     //adding Each torch to group
     //torchesGroup.add(torches);
 //}
//}

// (3) fucntion reset
function reset(){
    //changing gameState to PLAY
    gameState = PLAY;

    //gameOver & restart visiblity
    gameOver.visible = false;
    restart.visible = false;

    //destroyEach
    obstaclesGroup.destroyEach();
    bloodBagGroup.destroyEach();

    //vampire animation change
    vampire.changeAnimation("running", vampire_running);

    //score
    score = 0
}