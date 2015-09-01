/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// SSRPG戦場クラス
var CSsrpgBattleField = function() {
    
    // 初期化処理
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#999999";
        
        // ラベル作成
        var lblMsg = new Label( "SSRPG BattleField Page." );
        lblMsg.x = 10;
        lblMsg.y = 10;
        lblMsg.font = "16px cursive";
        lblMsg.textAlign = "left";
        this._scene.addChild( lblMsg );

        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        // 背景
        this._field = new Sprite(100, 100);
        {
            var surf = new Surface(100, 100);
            surf.context.beginPath();
            surf.context.fillStyle = "rgba(255,0,0,0.5)";
            surf.context.rect(0, 0, 100, 100);
            surf.context.stroke();
            this._field.image = surf;
        }
        this._scene.addChild( this._field );
        
        //
        this._player = new Sprite(32, 32);
        this._surf = new Surface(32, 32);
        this._surf.context.beginPath();
        this._surf.context.fillStyle = "rgba(252,0,0,0.8)";
        this._surf.context.fillRect(0, 0, 32, 32);
        this._surf.context.stroke();
        this._player.image = this._surf;
        this._scene.addChild( this._player );
    };
    
    return this;
};


