const canvas = document.getElementById('canvasTest');
const ctx = canvas.getContext('2d');



let x = 0
let y = 0
let directionHorizontal = true
let directionVertical = true

function gameLoop(){

    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width = screen.width,canvas.height = screen.height)

    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 100, 100);
    
    if(directionHorizontal){
        x+=3
    }
    else{
        x-=3
    }
    if(directionVertical){
        y+=3
    }
    else{
        y-=3
    }
    
    if(x>screen.width-100 || x<0){
        directionHorizontal = !directionHorizontal
    }
    else if(y>screen.height-100|| y<0){
        directionVertical = !directionVertical
    }

}
setInterval(gameLoop,1000 / 60)