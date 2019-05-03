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
        bgMusic: {
            type: cc.AudioClip,            
            default: null
        },
        select: {
            type: cc.AudioClip,          
            default: null
        },
        lose: {
            type: cc.AudioClip,            
            default: null
        },
        clear: {
            type: cc.AudioClip,            
            default: null
        },
        warm: {
            type: cc.AudioClip,            
            default: null
        },
        move: {
            type: cc.AudioClip,            
            default: null
        },
        gameOver: {
            type: cc.AudioClip,            
            default: null
        },
        mute: false
    },

    onLoad () {
        console.log('AudioClip onload');
    },

    playBgMusic: function () {        
        if (!this.mute && this.bgMusicChannel === undefined) {            
            this.bgMusicChannel = cc.audioEngine.play(this.bgMusic, true, 0.5);
        }
    },

    switchMute: function () {        
        this.mute = !this.mute;        
        if (this.mute) {            
            this.stopBgMusic();
        } else {            
            this.playBgMusic();
        }
    },

    stopBgMusic: function () {        
        if (this.bgMusicChannel !== undefined) {
            cc.audioEngine.stop(this.bgMusicChannel);            
            this.bgMusicChannel = undefined;
        }
    },

    playSound: function (sound, vol) {        
        if (!this.mute) {
            cc.audioEngine.play(this[sound], false, vol || 1);
        }
    }
});
