import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";


let score = 0;
let hSpeed = 240;
let cloudSpeed = 100
let rotationAngle = 360
let gravity = 1800


kaboom();

// load a default sprite
loadSprite("bean", "./wheel.png");
loadSprite("cloud", "https://img.icons8.com/cotton/64/clouds--v1.png");
loadSprite("helicop", "https://img.icons8.com/external-konkapp-outline-color-konkapp/64/external-helicopter-transportation-konkapp-outline-color-konkapp.png");
loadSprite("person", './scooter (2).png')
loadSprite("grass", 'https://img.icons8.com/retro/32/000000/grass.png')
// loadSprite("background", './back2cropped.jpg')
loadSprite("star", "https://img.icons8.com/color-glass/25/christmas-star.png")

// sounds
loadSound("jump", "./boing.mp3");
loadSound("crash", "./gameover.wav");
loadSound("theme", "./backgroundSound.wav");

setGravity(gravity);

loadFont('gamefont', "./dilo-world-font/DiloWorld-mLJLv.ttf")
loadFont("scorefont", './Bungee/Bungee-Regular.ttf')

if(!localStorage.getItem("highScore")){
  localStorage.setItem("highScore",0);
}


// Function to save the high score to local storage
function saveHighScore(score) {
  localStorage.setItem("highScore", score);
}

// Function to retrieve the high score from local storage
function getHighScore() {
  return localStorage.getItem("highScore");
}

let a = 2;



scene("game", () => {

  
  setBackground(146, 189, 253)

  let inc = true;
  loop(1, () => {
    setBackground(146-a, 189-a, 253-a);
    if(inc){
      a+=2;
      if(a >= 190){
        inc = false        
      }
    }
    if(!inc){
      a-=2;
      if(a <= 10){
        inc = true;
      }
    }
    
  })


 
  const bean = add([
    sprite("bean"),
    pos(350, height() - 80), 
    area(), 
    body(),
    opacity(1),
    anchor("center"),
    scale(0.8)
  ]);
  bean.add([
    sprite("person"),
    anchor("botleft"),
    pos(-30, 30),
    outline(4),
    z(10),
    scale(0.2),
  ])
  bean.add([
    sprite("bean"),
    anchor("center"),
    rotate(0),
    {
      update() {
        this.angle += rotationAngle * dt()
      }
    },
    z(15)
  ]);
  

  // platform 
  add([
    rect(width(), 70),
    pos(0, height() - 60),
    outline(4), // position in world
    area(), // has a collider
    body({ isStatic: true }),
    color(55, 30, 14),
  ]);
  // green grass
  add([
    rect(width(), 10),
    pos(0, height() - 60),
    outline(4), // position in world
    area(), // has a collider
    body({ isStatic: true }),
    color(53, 153, 53),
  ]);


  let endTime = 2;
  function spawnTree() {
    add([
      rect(30, rand(24, 70)),
      area(),
      outline(4),
      pos(width(), height() - 60),
      anchor("botleft"),
      color(123, 134, 136),
      move(LEFT, hSpeed),
      "tree", // add a tag here
    ]);
    hSpeed += 5;
    rotationAngle += 10;
    endTime -= 0.02;
    gravity += 10;
    wait(rand(0.7, endTime), () => {
      spawnTree();
    });
  }
  spawnTree();
  
  function spawnGrass(){
    add([
      sprite("grass"),
      area(),
      pos(width(), height()-50),
      anchor("botleft"),
      move(LEFT, hSpeed),
      "grass", // add a tag here
      scale(rand(0.5,1))
    ]);
    wait(rand(1, 4), () => {
      spawnGrass();
    });
  }
  spawnGrass();
  

  function spawnClouds(){
    
    if(a<100)
    add([
      sprite("cloud"),
      area(),
      pos(width(), rand(100, 300)),
      opacity(0.8),
      anchor("botleft"),
      color(220, 234, 255),
      move(LEFT, cloudSpeed),
      "cloud", // add a tag here
      scale(rand(0.8, 1.2))
    ]);

    if(a>100)
    add([
      sprite("star"),
      area(),
      pos(width(), rand(100, 300)),
      anchor("botleft"),
      color(220, 234, 255),
      move(LEFT, cloudSpeed),
      "star", // add a tag here
    ]);

    wait(rand(1, 4.5), () => {
      spawnClouds();
    });
  }
  spawnClouds();

  function spawnHeli(){
  
    add([
      sprite("helicop"),
      area(),
      pos(0, rand(100, 300)),
      anchor("botright"),
      color(rand(80,250), rand(80,250), rand(80, 255)),
      move(RIGHT, cloudSpeed),
      "helicopter", // add a tag here
    ]);
    wait(rand(20, 35), () => {
      spawnHeli();
    }); 
  }
  spawnHeli();
  let themeMusic = play("theme", {
    volume: 0.4,
    loop: true,
  });
  bean.onCollide("tree", () => {
    addKaboom(bean.pos);
    play("crash");
    themeMusic.paused = true;
    shake();
    go("lose");
  });
  onKeyPress("up", () => {
    if (bean.isGrounded()) {
      play("jump");
      bean.jump();
    }
  });
  onClick(() => {
    if (bean.isGrounded()) {
      play("jump");
      bean.jump();
    }
  });

  const scoreLabel = add([
    text("Score : " + score, {
      font : "scorefont", 
    }), 
    pos(width()/2 - 150, 100),
    color(20+a,20+a,20+a)
  ]);

  add([
    text("High Score : " + getHighScore(), {
      font : "gamefont",
      size : 20
    }),
    pos(width()/2 - 130, 60),
    color(20+a,20+a,20+a)
  ])

  loop(0.1,()=>{
    score++;
    scoreLabel.text = "Score : " + score;
    if(score > 500){
      gravity = 2000;
    }
  })
});


go("game");

scene("lose", () => {

  // Check if the current score is higher than the stored high score
  if (score > getHighScore()) {
    saveHighScore(score);
  }

  setBackground(146-a, 189-a, 253-a);
  // platform 
  add([
    rect(width(), 70),
    pos(0, height() - 60),
    outline(4), // position in world
    area(), // has a collider
    body({ isStatic: true }),
    color(55, 30, 14),
  ]);
  // green grass
  add([
    rect(width(), 10),
    pos(0, height() - 60),
    outline(4), // position in world
    area(), // has a collider
    body({ isStatic: true }),
    color(53, 153, 53),
  ]);
  add([
    text("Game Over ! Press Enter to restart", {
      size: 40, // 48 pixels tall
      font: "gamefont", 
    }),
    pos(width()/2, height()/2-100),
    anchor("center"),
    color(20,20,20),
  ]);
  hSpeed = 240;
  add([
    text("Score : " + score, {font : "scorefont"}),
    pos(width() / 2, height() / 2),
    scale(2),
    anchor("center"),
    color(10,10,10),
  ]);
  add([
    text("High Score : " + getHighScore(), {
      font : "gamefont",
      size : 30
    }),
    pos(width()/2 - 110,height() / 2 + 80),
    color(20,20,20)
  ])
  onKeyPress("enter", () => {
    go("game");
    score = 0;
    a=2;
  });
});
