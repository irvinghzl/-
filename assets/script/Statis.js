// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        restartBtn:{
            default: null,
            type : cc.Button
        },
        recordScore : {
            default: null,
            type : cc.Label
        },
        currentScore : {
            default : null,
            type : cc.Label
        },
    },

    

    onLoad () {
        this.restartBtn.node.on('touchend',this.restartGame.bind(this));
    },
    restartGame : function () {
        //调用系统方法加载Game场景
        cc.director.loadScene('Game');
    },
    gameOver : function () {
        var recordScore = cc.sys.localStorage.getItem('recordScore');
        var currentScore = cc.sys.localStorage.getItem('currentScore');
        //显示分数
        this.score.string = this.currentScore;
        //显示最高分
        this.recordScore = recordScore;
        if (recoredScore){
            //判断当前分数是否大于最高分
            if(recoredScore < this.currentScore){
                //储存最高分数
                cc.sys.localStorage.setItem('recordScore', this.currentScore);
            }else {
                cc.sys.localStorage.setItem('recoredScore', this.recordScore);
            }
        }
    }
});
