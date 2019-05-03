// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var {AStar, Grid, Node} = require("AStar");

cc.Class({
    extends: cc.Component,

    properties: {
        Ball1: cc.Prefab,
        Ball2: cc.Prefab,
        Ball3: cc.Prefab,
        Ball4: cc.Prefab,
        Ball5: cc.Prefab,
        Ball6: cc.Prefab,
        gameContent: cc.Node,
        help: cc.Sprite,
        setting: cc.Sprite,
        scoreLabel: cc.Label,
        tipText: cc.RichText
    },

    onLoad () {        
        //默认隐藏提示信息
        if (this.tipText != null){
        this.tipText.node.active = false;
    }
        //行列数
        this.row = 14;        
        this.col = 10;        
        this.maxNodes = this.row * this.col;               
        
        //每次增加小球数
        this.addBallsCount = 4;        
        //棋盘边距
        this.paddingLeft = 16;        
        this.paddingTop = 150;
        
        //格子尺寸
        this.gridSize = 50; 
        
        //棋盘在坐标系的起始位置(根据cocos 坐标系统推算)
        this.posTop = 480 - this.paddingTop;        
        this.posLeft = -270 + this.paddingLeft;        
        
        //记录选中的格子
        this.node1 = undefined;        
        this.node2 = undefined;        
        
        //是否正在移动小球
        this.movingBall = false;        
        
        //游戏是否已经结束
        this.gameOver = false;        
        
        //用于存放将要被清掉的小球的数组
        this.toClearBallsArr = [];        
        
        //游戏得分
        this.score = 0;        
        this.displayScore = 0;        
        this.updateScore();        
        
        //开始创建棋盘并添加小球
        let maxCount = this.row * this.col;
        let startCount = Math.round(maxCount * 0.1);        
        //创建一个随机棋盘，得到的是一个二维数组，结构如[[0,1,1,0],[0,1,0,0]...]
        let startArr = this.getRandomArr(maxCount, startCount);        
        
        this.grid = new Grid(this.col, this.row);        
        this.aStar = new AStar();        
        
        this.mapArr = [];        
        this.nodesArr = [];        
        for (let i = 0; i < this.col; i++) {
            let arr = [];            
            this.mapArr.push(arr);            
            for (let j = 0; j < this.row; j++) {
                let value = startArr.pop();
                let node;                
                if (value) {
                    let randomId = parseInt(cc.random0To1() * 6 + 1);
                    let Prefab = this['Ball' + randomId];
                    let newBall = cc.instantiate(Prefab);
                    newBall.type = randomId;                    
                    this.gameContent.addChild(newBall);
                    newBall.setPosition(cc.p(this.posLeft + 25 + i * 50, this.posTop - 25 - j * 50));                    
                    //newBall.scale = 0.3;
                    node = {ball: newBall, val: value, x: i, y: j}
                    arr.push(node);                    
                    this.grid.setWalkable(i, j, false);
                } else {                    
                    this.grid.setWalkable(i, j, true);
                    node = {ball: undefined, val: value, x: i, y: j};
                    arr.push(node);
                }                
                this.nodesArr.push(node);
            }
        }
                        
        this.node.on('touchend', this.onTouchEnd.bind(this));        
        this.sound1.node.on('touchend', function () {            
            //静音
        }.bind(this));        
            
        this.sound2.node.on('touchend', function () {            
            //解除
        }.bind(this));

        let _this = this;        
        this.help.node.on('touchend', function () {            
            //显示帮助
        }.bind(this));        
            
        this.setting.node.on('touchend', function () {            
            //显示设置面板
        }.bind(this));
    },

    onTouchEnd: function (e) {        
        if (this.movingBall) {
            console.log('正在移动小球');            
            return;
        }        
        if (this.gameOver) {
            console.log('游戏已结束');            
            return;
        }        
        //获取点击的位置，并根据点击位置获取到对应的格子。
        let x = e.touch._point.x;
        let y = e.touch._point.y;

        x = x - this.paddingLeft;
        y = this.node.height - this.paddingTop - y;
        console.log(x, y);
        let colId = Math.floor(x / this.gridSize);
        let rowId = Math.floor(y / this.gridSize);        
        if (!(colId >= 0 && colId < this.col && rowId >= 0 && rowId < this.row)) {
            console.log('没有选中格子');            
            return;
        }
        let clickNode = this.mapArr[colId][rowId];        

        //
        if (!this.node1) {            
            //第一点击的是小球，只需要记录一下
            if (clickNode.ball) {                
                //console.log('选中了小球：', rowId, colId);
                this.node1 = this.mapArr[colId][rowId];
            } else {                //console.log('请选择一个小球');
                this.AudioPlayer.playSound('warm');
            }
        } else {            
            if (clickNode.ball) {                
                //第二次点击的还是小球，也是记录一下，替代第一次点击的小球
                //console.log('重新选中了小球：', rowId, colId);
                this.node1 = this.mapArr[colId][rowId];
            } else {                
                //第二次点击的如果是空格子，就开始处理移动小球逻辑了
                //设置网格，开始寻路
                this.node2 = this.mapArr[colId][rowId];                
                this.grid.setStartNode(this.node1.x, this.node1.y);                
                this.grid.setEndNode(this.node2.x, this.node2.y);                
                this.grid.setWalkable(this.node1.x, this.node1.y, true);                
                if (this.aStar.findPath(this.grid)) {                    
                    //找到了通路
                    let pathArr = this.aStar.get_path();
                    pathArr.shift();
                    let ball = this.mapArr[this.node1.x][this.node1.y].ball;                    
                    this.movingBall = true;                    
                    this.grid.setWalkable(this.node2.x, this.node2.y, false);                    
                    this.node2.ball = ball;                    
                    this.mapArr[this.node1.x][this.node1.y].ball = undefined;
                    let _this = this;                    
                    this.moveBall(ball, pathArr, function () {
                        _this.movingBall = false;
                    });
                }
            }
        }
    },

    updateScore: function () {        
        this.scoreLabel.string = this.displayScore;
    },    
    
    moveBall: function (ball, pathArr, onComplete) {        
        let node = pathArr.shift();        
        let newPosition = cc.p(this.posLeft + 25 + node.x * this.gridSize, this.posTop - 25 - node.y * this.gridSize);
        ball.setPosition(newPosition);        
        let _this = this;        
        if (pathArr.length) {
            setTimeout(() => {
                _this.moveBall(ball, pathArr, onComplete)
            }, 50);
        } else {
            onComplete();
        }
    },

    //创建一个包含指定数量真值的二维数组
    getRandomArr: function (maxNum, trueNum) {
        let arr = [];        
        for (let i = 0; i < maxNum; i++) {
            arr.push(i > trueNum - 1 ? 0 : 1);
        }

        arr.sort(function () {            
            return cc.random0To1() > 0.5 ? 1 : -1;
        })        
            
        return arr;
    },

    update (dt) {
    //选中的小球的动画    
    if (this.node1 && this.node1.ball) {
        let ball = this.node1.ball;
        let scale = ball.scale;
        let scaleDirection = ball.scaleDirection || -1;        
        if (scaleDirection === -1) {            
            scale -= 0.02;            
            if (scale <= 0.7) {
                ball.scaleDirection = 1;
            }
        } else {            
            scale += 0.02;            
            if (scale >= 1) {
                ball.scaleDirection = -1;
            }
        }
        ball.scale = scale;
    }
}
});