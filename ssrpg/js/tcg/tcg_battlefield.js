/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _gTcgBattleField = {
    CardChip: {
        iSizeX: 40,
        iSizeY: 60
    }
};

// TCG戦場クラス
var CTcgBattleField = function() {
    
    // 初期化処理
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#999999";
        
        // ラベル作成
        this.lblPage = this.createLabel( 10, 10, "TCG BattleField Page." );
        this.lblPage.font = "32px cursive";

        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        // カードチップの試作
        this.createLabel( 10, 450, "Player_A Life = 20" );
        this.createLabel( 10, 470, "Player_B Life = 20" );
        
        // Player_A 手札
        this.createChip( 100, 370 );
        this.createChip( 150, 370 );
        this.createChip( 200, 370 );
        this.createChip( 250, 370 );
        this.createChip( 300, 370 );
        
        // Player_A 場
        this.createChip( 100, 260 );
        this.createChip( 150, 260 );
        this.createChip( 200, 260 );
        
        // Player_A 山札
        this.createChip( 430, 250 );
        this.createChip( 435, 255 );
        this.createChip( 440, 260 );

        // Player_A 捨て山
        this.createChip( 430, 350 );
        
        // Player_A プレイヤー情報
        this.createChip( 10, 250 );
        this.createChip( 10, 300 );
        this.createChip( 10, 350 );
    };
    
    // ラベルの作成
    this.createLabel = function(iPosX, iPosY, sStrMsg)
    {
        // ラベル作成
        var lbl = new Label( sStrMsg );
        lbl.x = iPosX;
        lbl.y = iPosY;
        lbl.font = "16px cursive";
        lbl.textAlign = "left";
        
        this._scene.addChild( lbl );
        return lbl;
    };
    
    // カードチップの作成
    this.createChip = function(iPosX, iPosY)
    {
        var iSizeX = _gTcgBattleField.CardChip.iSizeX;
        var iSizeY = _gTcgBattleField.CardChip.iSizeY;

        var _field = new Sprite(iSizeX, iSizeY);
        
        {
            var surf = new Surface(iSizeX, iSizeY);
            surf.context.beginPath();
            surf.context.fillStyle = "rgba(255,0,0,0.5)";
            surf.context.rect(0, 0, iSizeX, iSizeY);
            //surf.context.fillRect(0, 0, iSizeX, iSizeY);
            surf.context.stroke();
            _field.image = surf;

            _field.x = iPosX;
            _field.y = iPosY;
        }
        
        this._scene.addChild( _field );
    };
    
    return this;
};


