$(document).ready(function(){
	//Canvas stuff

    var canvas = $("#canvas")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	high_score = 0;
	var cw = 44;
	var d;
	var food;
	var score;
	var snake_array; //an array of cells to make up the snake
	
	function init()
	{
		d = "right"; //default direction
		create_snake();
		create_food(); 
		
		score = 0;
		
		//move the snake every 120ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 120);
	}
	init();
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x:i, y:2});
		}
	}
	
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//This will create a cell with x/y between 0-44
	}
	
	function paint()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		
		if(nx == -1 || nx >= w/cw-1 || ny == -1 || ny >= h/(cw)-1 || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			return;
		}
		
		
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		paint_cell(food.x, food.y);
		ctx.font = "20px Georgia";
		if(score > high_score)high_score = score;
		var score_text = "score : " + score;
		ctx.fillText(score_text, 150, h-5);

		var high_score_text = "High score : " + high_score;
		ctx.fillText(high_score_text, 5, h-5);
	}
	
	function paint_cell(x, y)
	{
		ctx.fillStyle = "black";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//control snake with keyboard
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
	
})