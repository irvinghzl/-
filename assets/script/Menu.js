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
        startBtn : {
            default : null,
            type : cc.Button
        }
        
    },

    

    onLoad () {
        //场景加载时执行
        //侦听touchend事件来触发开始游戏方法。不能用click,否则在微信中失效
        this.startBtn.node.on('touchend',this.startGame.bind(this));
    },
    
    startGame : function () {
        //调用系统方法加载Game场景
        cc.director.loadScene('Game');
    }
    

    
});
