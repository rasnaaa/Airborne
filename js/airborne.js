//Anuthida Lertnamwongwan

window.onload = function () {
	var game = new Phaser.Game(400, 580, Phaser.CANVAS);
	
	//the plane
	var plane;
	
	//will make plane fall
	var planeGravity = 800;
	
	//speed of the plane
	var planeSpeed = 125;
	
	//	power of the bird's thrust	
	var planeFlapPower = 300;
	
	//	time between the pipes
	var pipeInterval = 2000;
	
	//space between two pipes in pixels
	var pipeHole =120;
	
	var pipeGroup;
	
	//keep count of score
	var score =0;
	
	//text to display the score
	var scoreText;
	
	//to display previous top scores
	var topScore;
	
	
	
	var play = function(game){}
     
     play.prototype = {
		preload:function(){
			game.load.image("plane", "img/plane.png"); 
			game.load.image("pipe", "img/pipe.png");
			game.load.image("Pause","img/pause.png");
			game.load.image("Play", "img/play.png");
		},
		
		create:function(){
			pipeGroup = game.add.group();
			score = 0;
			topScore = localStorage.getItem("topAirborneScore")==null?0:localStorage.getItem("topAirborneScore");
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Georgia"
				
			});
		
			pause = game.add.sprite(0,50,"Pause");
			pause.inputEnabled = true;
			pause.events.onInputUp.add(function(){
				game.paused=true;
				
			});
			 game.input.onDown.add(unpause, self);
			function unpause(event){
				if (game.paused){
			game.paused = false;		
				}
			};
			

			updateScore();
			game.stage.backgroundColor = "#CEF6F5";
			game.stage.disableVisibilityChange = true;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			plane = game.add.sprite(80,240,"plane");
			plane.anchor.set(0.5);
			game.physics.arcade.enable(plane);
			plane.body.gravity.y = planeGravity;
			game.input.onDown.add(flap, this);
			game.time.events.loop(pipeInterval, addPipe); 
			addPipe();
			
		},
		 
		update:function(){
			game.physics.arcade.collide(plane, pipeGroup, die);
			if(plane.y>game.height){
				die();
			}	
		}
	}
     
     game.state.add("Play",play);
     game.state.start("Play");
	
     
     function updateScore(){
		scoreText.text = "Score: "+score+"\nBest: "+topScore;	
	}
 
	function flap(){
		plane.body.velocity.y = -planeFlapPower;	
	}
	
	function addPipe(){
		var pipeHolePosition = game.rnd.between(50,430-pipeHole);
		var upperPipe = new Pipe(game,320,pipeHolePosition-480,-planeSpeed);
		game.add.existing(upperPipe);
		pipeGroup.add(upperPipe);
		var lowerPipe = new Pipe(game,320,pipeHolePosition+pipeHole,-planeSpeed);
		game.add.existing(lowerPipe);
		pipeGroup.add(lowerPipe);
	}
	
	function die(){
		localStorage.setItem("topAirborneScore",Math.max(score,topScore));	
		window.alert("Game Over!");
		game.state.start("Play");	
	}
	
	Pipe = function (game, x, y, speed) {
		Phaser.Sprite.call(this, game, x, y, "pipe");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.velocity.x = speed;
		this.giveScore = true;	
	};
	
	
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	
	Pipe.prototype.update = function() {
		if(this.x+this.width<plane.x && this.giveScore){
			score+=0.5;
			updateScore();
			this.giveScore = false;
		}
		if(this.x<-this.width){
			this.destroy();
		}
	};

}