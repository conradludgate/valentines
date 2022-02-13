import Keyboard from "./dist/keyboard.js";

let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
});
document.body.appendChild(app.view);

let alex_sprite = PIXI.Sprite.from("assets/alex-64.png");
let conrad_sprite = PIXI.Sprite.from("assets/conrad-64.png");

alex_sprite.x = -32;
alex_sprite.y = -32;
conrad_sprite.x = -32;
conrad_sprite.y = -32;

const heart_txt = PIXI.Texture.from('assets/heart-64.png');

const alex = new PIXI.Container();
alex.addChild(alex_sprite);
app.stage.addChild(alex);

const conrad = new PIXI.Container();
conrad.addChild(conrad_sprite);
app.stage.addChild(conrad);

conrad.y = 40;
alex.y = window.innerHeight - 40;

let speed = 5;

app.ticker.add(function (time) {
    if (Keyboard.isKeyDown('ArrowLeft', 'KeyA')) {
        alex.x -= time * speed;
        alex.scale.x = 1;
    }
    if (Keyboard.isKeyDown('ArrowRight', 'KeyD')) {
        alex.x += time * speed;
        alex.scale.x = -1;
    }

    if (alex.x < 32) alex.x = 32;
    if (alex.x > (window.innerWidth - 32)) alex.x = (window.innerWidth - 32);
});

let hearts = [];
let hcdwn = 0;
let hps = 3;

app.ticker.add(function (time) {
    hcdwn = Math.max(hcdwn - time, 0);
    if (Keyboard.isKeyDown('Space') && hcdwn === 0) {
        let heart_sprite = new PIXI.Sprite(heart_txt);
        heart_sprite.x = -32;
        heart_sprite.y = -32;

        const heart = new PIXI.Container();
        heart.addChild(heart_sprite);
        app.stage.addChild(heart);

        heart.x = alex.x;
        heart.y = alex.y;

        hearts.push(heart);
        hcdwn += 60 / hps;
    }

    hearts.forEach((heart) => {
        heart.y -= time * speed;
    })
    hearts = hearts.filter((heart) => {
        if (heart.y > 40) {
            return true;
        } else {
            app.stage.removeChild(heart);
            return false;
        }
    })
});

let conrad_cdwn = 0;
let conrad_speed = 0;

app.ticker.add(function (time) {
    conrad_cdwn = Math.max(conrad_cdwn - time, 0);
    if (conrad_cdwn === 0) {
        let conrad_goal = Math.random() * (window.innerWidth - 64);
        console.log(conrad_goal);
        conrad_cdwn = 60;
        conrad_speed = (conrad_goal - conrad.x) / 120;
    }
    conrad.x += time * conrad_speed;
});

let conrad_heart_cdwn = 40;

let conrad_hearts = [];
app.ticker.add(function (time) {
    conrad_heart_cdwn = Math.max(conrad_heart_cdwn - time, 0);
    if (conrad_heart_cdwn === 0) {
        let heart_sprite = new PIXI.Sprite(heart_txt);
        heart_sprite.x = -32;
        heart_sprite.y = -32;

        const heart = new PIXI.Container();
        heart.addChild(heart_sprite);
        app.stage.addChild(heart);

        heart.x = conrad.x;
        heart.y = conrad.y;

        conrad_hearts.push(heart);
        conrad_heart_cdwn += Math.random() * 60 + 20;
    }

    conrad_hearts.forEach((heart) => {
        heart.y += time * speed;
    })
    conrad_hearts = conrad_hearts.filter((heart) => {
        if (heart.y > 40) {
            return true;
        } else {
            app.stage.removeChild(heart);
            return false;
        }
    })
});

app.ticker.add(function (_time) {
    Keyboard.update()
});
