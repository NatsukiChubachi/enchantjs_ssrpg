/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _gTcgBattleField = {
    OwnerNumber: {
        iNoneState: -1,
        iPlayerA: 0,
        iPlayerB: 1
    },
    TurnState: {
        iNoneState: -1,
        iBattleStart: 0,
        iRefreshState: 1,
        iDrawState: 2,
        iMainState: 3,
        iBattleState: 4,
        iEndState: 5
    },
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
        this._lblPage = this.createLabel( 10, 10, "TCG BattleField Page." );
        this._lblPage.font = "32px cursive";

        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        // カードチップの試作
        this._lblLifeA = this.createLabel( 10, 450, "Player_A Life = 20" );
        this._lblLifeB = this.createLabel( 10, 470, "Player_B Life = 20" );
        
        // ターン制御変数
        this._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerA;
        this._iTurnState  = _gTcgBattleField.TurnState.iBattleStart;
        this._bStateMove = false;
        
        // 毎ループ判定処理
        this._lblManager = this.createLabel( 0, 0, "!" );
        this._lblManager._parent = this;
        this._lblManager.addEventListener("enterframe", function()
        {
            switch( this._parent._iTurnState )
            {
            case _gTcgBattleField.TurnState.iBattleStart:
                alert("BattleStart");
                this._parent._iTurnState = _gTcgBattleField.TurnState.iRefreshState;
                break;
            case _gTcgBattleField.TurnState.iRefreshState:
                // if ( this._parent._bStateMove )
                {
                    alert("RefreshState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iDrawState;
                }
                break;
            case _gTcgBattleField.TurnState.iDrawState:
                if ( this._parent._bStateMove )
                {
                    alert("DrawState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iMainState;
                }
                break;
            case _gTcgBattleField.TurnState.iMainState:
                if ( this._parent._bStateMove )
                {
                    alert("MainState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iBattleState;
                }
                break;
            case _gTcgBattleField.TurnState.iBattleState:
                if ( this._parent._bStateMove )
                {
                    alert("BattleState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iEndState;
                }
                break;
            case _gTcgBattleField.TurnState.iEndState:
                // if ( this._parent._bStateMove )
                {
                    alert("EndState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iRefreshState;
                    
                    if ( this._parent._iOwnerState === _gTcgBattleField.OwnerNumber.iPlayerA )
                    {
                        this._parent._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerB;
                    }
                    else
                    {
                        this._parent._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerA;
                    }
                }
                break;
            };
            
            // ステート移動フラグを戻す
            this._parent._bStateMove = false;
        });
        
        // ターン状態表示ラベル
        this._lblTurnState = this.createLabel( 250, 450, "TurnState: " );
        this._lblTurnState._parent = this;
        this._lblTurnState.addEventListener("enterframe", function() 
        {
            var sTmp = "TurnState: ";
            
            switch( this._parent._iOwnerState )
            {
            case _gTcgBattleField.OwnerNumber.iPlayerA:
                sTmp += "PlayerA, ";
                break;
            case _gTcgBattleField.OwnerNumber.iPlayerB:
                sTmp += "PlayerB, ";
                break;
            };
            
            switch( this._parent._iTurnState )
            {
            case _gTcgBattleField.TurnState.iBattleStart:
                sTmp += "BattleStart";
                break;
            case _gTcgBattleField.TurnState.iRefreshState:
                sTmp += "RefreshState";
                break;
            case _gTcgBattleField.TurnState.iDrawState:
                sTmp += "DrawState";
                break;
            case _gTcgBattleField.TurnState.iMainState:
                sTmp += "MainState";
                break;
            case _gTcgBattleField.TurnState.iBattleState:
                sTmp += "BattleState";
                break;
            case _gTcgBattleField.TurnState.iEndState:
                sTmp += "EndState";
                break;
            };
            
            this.text = sTmp;
        } );
        
        // テンポラリ変数
        var tmp;
        
        this.funcTouchStart = function()
        {
            // チップの移動
            // this.y += 1;
            
            // ステート変化
            this._parent._bStateMove = true;
            
            // スプライトの削除
            // this.parentNode.removeChild( this );
        };
        
        this.funcTouchChip = function()
        {
            if ( this._bSelected === true )
            {
                this._bSelected = false;
                this.scale( 0.5, 0.5 );
            }
            else if ( this._bSelected === false )
            {
                this._bSelected = true;
                this.scale( 2.0, 2.0 );
            }
        };
        
        this.funcChipFieldEnterFrame = function()
        {
            if ( this._iOwner === this._parent._iOwnerState )
            {
                if ( this._parent._iTurnState === _gTcgBattleField.TurnState.iRefreshState )
                {
                    this.rotation = 0.0;
                }

                if ( this._parent._iTurnState === _gTcgBattleField.TurnState.iEndState )
                {
                    this.rotation = 90.0;
                }
            }
        };
        
        var tmpPos;
        
        tmpPos = [ [ 450, 450 ] ];
        tmp = this.createChip( tmpPos[0][0], tmpPos[0][1] );
        tmp.addEventListener( "touchstart", this.funcTouchStart );
        
        tmpPos = [ 
            [100, 370],
            [150, 370],
            [200, 370],
            [250, 370],
            [300, 370]
        ];
        
        // Player_A 手札
        for ( var i = 0; i < 5; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp.addEventListener( "touchstart", this.funcTouchChip );
        }
       
        // Player_A 場
        tmpPos = [ 
            [100, 260],
            [150, 260],
            [200, 260]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp._iOwner = _gTcgBattleField.OwnerNumber.iPlayerA;
            tmp.addEventListener( "touchstart", this.funcTouchChip );
            tmp.addEventListener( "enterframe", this.funcChipFieldEnterFrame );
        }
        
        // Player_A 山札
        tmpPos = [
            [ 430, 250 ],
            [ 435, 255 ],
            [ 440, 260 ]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );

            if ( i === 0 )
            {
                tmp.addEventListener( "touchstart", this.funcTouchStart );
            }
        }

        // Player_A 捨て山
        tmpPos = [ [ 430, 350 ] ];
        tmp = this.createChip( tmpPos[0][0], tmpPos[0][1] );
        tmp.addEventListener( "touchstart", this.funcTouchStart );
        
        // Player_A プレイヤー情報
        tmpPos = [
            [ 10, 250 ],
            [ 10, 300 ],
            [ 10, 350 ]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp.addEventListener( "touchstart", this.funcTouchStart );
        }
        
        // Player_B 手札
        tmpPos = [
            [ 100, 120 - 60 ],
            [ 150, 120 - 60 ],
            [ 200, 120 - 60 ],
            [ 250, 120 - 60 ],
            [ 300, 120 - 60 ]
        ];
        
        for ( var i = 0; i < 5; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp.addEventListener( "touchstart", this.funcTouchChip );
        }
        
        // Player_B 場
        tmpPos = [
            [ 300, 240 - 60 ],
            [ 250, 240 - 60 ],
            [ 200, 240 - 60 ]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp._iOwner = _gTcgBattleField.OwnerNumber.iPlayerB;
            tmp.addEventListener( "touchstart", this.funcTouchChip );
            tmp.addEventListener( "enterframe", this.funcChipFieldEnterFrame );
        }
        
        // Player_B 山札
        tmpPos = [
            [ 30, 250 - 60 ],
            [ 35, 245 - 60 ],
            [ 40, 240 - 60 ]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            
            if ( i === 0 )
            {
                tmp.addEventListener( "touchstart", this.funcTouchStart );
            }
        }
        
        // Player_B 捨て山
        tmpPos = [ [ 30, 150 - 60 ] ];
        tmp = this.createChip( tmpPos[0][0], tmpPos[0][1] );
        tmp.addEventListener( "touchstart", this.funcTouchStart );
        
        // Player_B プレイヤー情報
        tmpPos = [
            [ 410, 250 - 60 ],
            [ 410, 200 - 60 ],
            [ 410, 150 - 60 ]
        ];
        
        for ( var i = 0; i < 3; i++ )
        {
            tmp = this.createChip( tmpPos[i][0], tmpPos[i][1] );
            tmp.addEventListener( "touchstart", this.funcTouchStart );
        }
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
    this.createChip = function( iPosX, iPosY ) 
    {
        // 大きさ
        var iWidth  = _gTcgBattleField.CardChip.iSizeX;
        var iHeight = _gTcgBattleField.CardChip.iSizeY;

        // スプライトの作成
        var _sprite = new Sprite( iWidth, iHeight );
        
        var surf = new Surface( iWidth, iHeight );
        surf.context.beginPath();
        surf.context.fillStyle = "rgba(255,0,0,0.5)";
        surf.context.rect( 0, 0, iWidth, iHeight );
        //surf.context.fillRect(0, 0, iSizeX, iSizeY);
        surf.context.stroke();
        _sprite.image = surf;

        _sprite.x = iPosX;
        _sprite.y = iPosY;

        // シーンに追加する
        this._scene.addChild( _sprite );
        
        // 親の設定
        _sprite._parent = this;
        
        _sprite._bSelected = false;
        
        // 作成したスプライトを返す
        return _sprite;
    };
    
    return this;
};


