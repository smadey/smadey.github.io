/*
init(speed,divid,width,height,completeFunc,type)
作用： 库件初始化
参数：
speed:游戏速度设定
divid:传入一个div的id，库件进行初始化的时候，会自动将canvas加入到此div内部
width:游戏界面宽
height:游戏界面高
completeFunc:游戏初始化后，调用此函数
type：当为null时，会先进行页面的onload操作，如果你的init函数调用是在onload之后，那么需要将此参数设为LEvent.INIT
*/
init(30, "tetris", 320, 480, main);

var loadingLayer;
var backLayer;
var graphicsMap;
var loadIndex = 0;

//锁定按键
var keylock = false;
//按键
var KEY = { LEFT: 65, RIGHT: 68, UP: 87, DOWN: 83, CHANGE: 74, STOP: 75, SPACE: 32 };

var imglist = {};
var imgData = new Array(
		{ name: "b0", path: "./js/tetris/images/00.png" },
		{ name: "b1", path: "./js/tetris/images/f0.png" },
		{ name: "b10", path: "./js/tetris/images/ff.png" }
	);

function main(){
    /*
    LLoadManage.load($list,$onupdate,$oncomplete)
    作用： 读取图片组
    参数：
    $list：图片数组，格式见 imgData
    $onupdate：读取中调用函数，一般用来显示游戏进度
    $oncomplete：全部图片读取完成后调用函数
    */
    loadingLayer = new LoadingSample1();
    addChild(loadingLayer);
    LLoadManage.load(
        imgData,
        function (progress) {
            loadingLayer.setProgress(progress);
        },
        function (result) {
            imglist = result;
            removeChild(loadingLayer);
            loadingLayer = null;
            //图片加载完成，进行其他处理
            gameInit();
        }
    );
}
function gameInit(event) {
    // legendLoadOver();
    /*
    LGraphics类 LGraphics()
    作用： LGraphics类包含一组可用来创建矢量形状的方法。
    详细说明： LGraphics类包含一组可用来创建矢量形状的方法。 支持绘制的显示对象有LSprite对象。LSprite类中包括 graphics 属性，该属性是一个 LGraphics 对象。

    backLayer = new LSprite();
    addChild(backLayer);
    //绘制一个矩形
    backLayer.graphics.drawRect(10,"#000000",[0, 0, 800, 400],true,"#cccc80");
    */
    backLayer = new LSprite();
    backLayer.graphics.drawRect(1, "black", [0, 0, 320, 480], true, "#cccccc");
    addChild(backLayer);

    /*
    LTextField类 LTextField()
    作用： 用于创建显示对象以显示和输入文本
    详细说明： LTextField 类用于创建显示对象以显示和输入文本。
    可用属性：
    type:类型
    x:坐标x
    y:坐标y
    text:作为文本字段中当前文本的字符串
    font:文字的格式
    size:文字大小
    color:文字颜色
    visible:是否可见，当设为false的时候，该LBitmap对象不可视，且内部所有处理都将停止
    weight:文字粗细
    stroke:文字的stroke属性，当为true时，可以设置lineWidth线宽
    lineWidth:文字线宽，当stroke属性为true时有效
    textAlign:文字左右对齐方式
    textBaseline:文字上下对齐方式
    */
    var title = new LTextField();
    title.x = 50;
    title.y = 100;
    title.size = 30;
    title.text = "俄罗斯方块";
    backLayer.addChild(title);

    var startBtn = addButton("游戏开始", 150, 30, 40, 5);
    startBtn.x = 80;
    startBtn.y = 300;
    backLayer.addChild(startBtn);

    //在这里给startBtn(开始按钮) 对象加上一个鼠标事件
    startBtn.addEventListener(LMouseEvent.MOUSE_DOWN, gameToStart);

	//添加键盘事件
	LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_DOWN, onkeydown);
	LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_UP, keyover);
}

var frameend = true;
var leftBtn;
var rightBtn;
var downBtn;
var changeBtn;
var stopBtn;
function gameToStart(){
    //游戏开始，刷新控件，设定结束标识和游戏进程锁定标识
	backLayer.removeAllChild();
    //将原来加载在backLayer上的事件全部移除
	backLayer.die();

	_stop = false;
	frameend = true;

    //速度显示
	speedLabel = new LTextField();
	speedLabel.x = 250;
	speedLabel.y = 200;
	backLayer.addChild(speedLabel);

    //得分显示
	scoreLabel = new LTextField();
	scoreLabel.x = 250;
	scoreLabel.y = 250;
	backLayer.addChild(scoreLabel);

    //左
	leftBtn = addButton("←",60,60,20,20);
	leftBtn.x = 10;
	leftBtn.y = 390;
	backLayer.addChild(leftBtn);

    //右
	rightBtn = addButton("→",60,60,20,20);
	rightBtn.x = 80;
	rightBtn.y = 390;
	backLayer.addChild(rightBtn);

    //下
	downBtn = addButton("↓",60,60,20,20);
	downBtn.x = 150;
	downBtn.y = 390;
	backLayer.addChild(downBtn);

    //变换
	changeBtn = addButton("change",70,60,10,20);
	changeBtn.x = 230;
	changeBtn.y = 390;
	backLayer.addChild(changeBtn);

    //暂停
	stopBtn = addButton("stop", 70, 60, 15, 20);
	stopBtn.x = 230;
	stopBtn.y = 300;
	backLayer.addChild(stopBtn);

    //游戏主框体
	graphicsMap = new LSprite();
	backLayer.addChild(graphicsMap);
    //游戏开始
	gameStart();

    /*
    LAnimation.addEventListener(type,listener)
    作用： 注册事件侦听器对象，以使侦听器能够接收事件通知
    参数：
    type：事件的类型，LAnimation是LSprite的子类，所以首先支持 LSprite 的所有事件类型，另外还增加了LEvent.COMPLETE事件，表示一行图片组播放完成。
    listener：处理事件的侦听器函数
    */
	backLayer.addEventListener(LEvent.ENTER_FRAME, onframe);

    //添加按钮事件
	leftBtn.addEventListener(LMouseEvent.MOUSE_DOWN, moveleft);
	rightBtn.addEventListener(LMouseEvent.MOUSE_DOWN, moveright);
	downBtn.addEventListener(LMouseEvent.MOUSE_DOWN, movedown);
	changeBtn.addEventListener(LMouseEvent.MOUSE_DOWN, movechange);
	stopBtn.addEventListener(LMouseEvent.MOUSE_DOWN, movestop);

    //按钮松开
	backLayer.addEventListener(LMouseEvent.MOUSE_UP, keyover);
}
/*
设置左移状态
*/
function moveleft() {
    if (myKey.keyControl > 0) return;
    myKey.keyControl = 37;
}
/*
设置右移状态
*/
function moveright() {
    if (myKey.keyControl > 0) return;
    myKey.keyControl = 39;
}
/*
设置下移状态
*/
function movedown(){
	if(myKey.keyControl > 0)return;
	myKey.keyControl = 40;
}
/*
设置变换状态
*/
function movechange(){
	if(myKey.keyControl > 0)return;
	myKey.keyControl = 32;
}
/*
设置按键结束状态
*/
function keyover() {
    myKey.keyControl = 0;
    myKey.speedCotrol = 0;
    myKey.changeOver = false;
}
/*
设置暂停
*/
function movestop() {
    frameend = !frameend;
    if (stopBtn != null)
        stopBtn.bitmap_over.childList[0].text = stopBtn.bitmap_up.childList[0].text = frameend ? "stop" : "start";
}
/*
按键按下
*/
function onkeydown(e) {
    if (keylock) return;
    switch (e.keyCode) {
        case KEY.LEFT: moveleft(); break;
        case KEY.RIGHT: moveright(); break;
        case KEY.DOWN: movedown(); break;
        case KEY.CHANGE: movechange(); break;
        case KEY.STOP: movestop(); break;
        case KEY.SPACE: if (_stop == null || _stop) gameToStart(); break;
    }
}
/*
游戏运行主程序
*/
function onframe() {
    //frameend为锁定标识
    if (!frameend) return;
    //_stop为停止标识
    if (_stop) return;

    frameend = false; //锁定状态

    //将当前活动box从map去除
    minusBox();

    //变换
    if (myKey.keyControl == 32 && !myKey.changeOver) {
        changeBox();
    }
    //左移;checkPlus(nx,ny)检查当前box是否可向map中相对point偏移量为(nx,ny)处移动
    if (myKey.keyControl == 37 && checkPlus(-1, 0)) {
        if (myKey.speedCotrol == 0 || myKey.speedCotrol >= 4) {
            //alert("point.x--");
            point.x--;
        }
        myKey.speedCotrol++;
    }
    //右移;checkPlus(nx,ny)检查当前box是否可向map中相对point偏移量为(nx,ny)处移动
    if (myKey.keyControl == 39 && checkPlus(1, 0)) {
        if (myKey.speedCotrol == 0 || myKey.speedCotrol >= 4) {
            point.x++;
        }
        myKey.speedCotrol++;
    }
    //下移
    if (speed == 0 || myKey.keyControl == 40) {
        //checkPlus(nx,ny)检查当前box是否可向map中相对point偏移量为(nx,ny)处移动
        if (checkPlus(0, 1)) {
            point.y++;
        } else {
            //将当前活动box填充进map中
            plusBox();
            //检查是否可以消层
            removeBox();
            //获取下一个box
            getNewBox();

            //当下一个box放不进map时游戏结束
            if (!checkPlus(0, 0)) {
                _stop = true;
                gameOver();
                return;
            }
        }
        speed = speedMax;
    } else {
        speed--;
    }
    //将当前活动box填充进map中(如果消层的话是新box)
    plusBox();

    drawMap();
    frameend = true;
}
//游戏结束
function gameOver(){
	backLayer.removeChild(leftBtn);
	backLayer.removeChild(rightBtn);
	backLayer.removeChild(downBtn);
	backLayer.removeChild(changeBtn);
	backLayer.removeChild(stopBtn);

	var startBtn = addButton("重新开始",150,30,40,5);
	startBtn.x = 80;
	startBtn.y = 300;
	backLayer.addChild(startBtn);
	startBtn.addEventListener(LMouseEvent.MOUSE_DOWN, gameToStart);
}

/*
    addButton 方法 addButton(lbl, w, h, x, y)
    作用： 用于创建按钮
    参数：
    lbl:按钮文本
    w:宽度
    h:高度
    x:坐标x
    y:坐标y
*/
function addButton(lbl, w, h, x, y) {
    var up = new LSprite();
    up.graphics.drawRect(1, "black", [0, 0, w, h], true, "#999999");
    var txt = new LTextField();
    txt.x = x;
    txt.y = y;
    txt.text = lbl;
    up.addChild(txt);

    var over = new LSprite();
    over.graphics.drawRect(1, "black", [0, 0, w, h], true, "#cccccc");
    var txt1 = new LTextField();
    txt1.x = x;
    txt1.y = y;
    txt1.text = lbl;
    over.addChild(txt1);

    /*
    LButton类 LButton(up,over)
    作用： 继承自LSprite类的一个子类，用来生成按钮
    参数：
    up:按钮的弹起状态(可以是LSprite类型或者LBitmap类型)
    over:按钮的按下状态(可以是LSprite类型或者LBitmap类型)
    */
    var btn = new LButton(up, over);
    return btn;
}
