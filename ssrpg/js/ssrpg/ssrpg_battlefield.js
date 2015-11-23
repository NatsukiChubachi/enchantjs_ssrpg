/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _gSsrpgBattleField_MapChipSizeX = 60;
var _gSsrpgBattleField_MapChipSizeY = 60;

var _gDefSsrpgBattleField = {
    Window: {
        iWidth: 500,
        iHeight: 500
    },
    MapChip: {
        iOffsetX: 70,
        iOffsetY: 40,
        iWidth: 60,
        iHeight: 60
    },
    EffectiveAreaType: {
        iAttack: 0,
        iDefence: 1
    },
    GameState: {
        iNoState: -1,
        iBeginGameState: 0,
        iStartPlayerState: 1,
        iTurnStart: 2,
        iSelectUnit: 3,
        iSelectMovePos: 4,
        iPlayerUnitMoveMotion: 5,
        iDecideMovePos: 6,
        iSelectAction: 7,
        iCalcActionArea: 8
    }
};

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
        

        // モック
        // 
        
        // 関数：位置決定
        this.GetScrPos = function( x, y )
        {
            var _result = {
                x: 0,
                y: 0
            };
            
            var _iOffsetX = _gDefSsrpgBattleField.MapChip.iOffsetX;
            var _iOffsetY = _gDefSsrpgBattleField.MapChip.iOffsetY;
            var _iWidth = _gDefSsrpgBattleField.MapChip.iWidth;
            var _iHeight = _gDefSsrpgBattleField.MapChip.iHeight;
            
            _result.x = ( x * _iWidth ) + _iOffsetX;
            _result.y = ( y * _iHeight ) + _iOffsetY;

            return _result;
        };
        
        // ラベルの作成
        this.CreateLabel = function(iPosX, iPosY, sStrMsg)
        {
            // ラベル作成
            var _lbl = new Label( sStrMsg );
            _lbl.x = iPosX;
            _lbl.y = iPosY;
            _lbl.font = "16px cursive";
            _lbl.textAlign = "left";

            this._scene.addChild( _lbl );
            
            return _lbl;
        };
        
        // 背景枠の作成
        this.CreateBackSpace = function()
        {
            // 左枠
            {
                var iWinY = _gDefSsrpgBattleField.Window.iHeight;
                
                var iWidth = _gDefSsrpgBattleField.MapChip.iOffsetX;
                var iHeight = iWinY - _gDefSsrpgBattleField.MapChip.iOffsetY - 100;
                
                var _surf = new Surface( iWidth, iHeight );
                _surf.context.beginPath();
                _surf.context.fillStyle = "rgba(0,0,200,0.5)";
                _surf.context.fillRect( 0, 0, iWidth, iHeight );
                
                var _frame = new Sprite( iWidth, iHeight );
                _frame.image = _surf;
                _frame.x = 0;
                _frame.y = _gDefSsrpgBattleField.MapChip.iOffsetY;
                
                this._scene.addChild( _frame );
            }
            // 右枠
            {
                var iWinY = _gDefSsrpgBattleField.Window.iHeight;
                
                var iWidth = _gDefSsrpgBattleField.MapChip.iOffsetX;
                var iHeight = iWinY - _gDefSsrpgBattleField.MapChip.iOffsetY - 100;
                
                var _surf = new Surface( iWidth, iHeight );
                _surf.context.beginPath();
                _surf.context.fillStyle = "rgba(0,0,200,0.5)";
                _surf.context.fillRect( 0, 0, iWidth, iHeight );
                
                var _frame = new Sprite( iWidth, iHeight );
                _frame.image = _surf;
                _frame.x = 500 - _gDefSsrpgBattleField.MapChip.iOffsetX;
                _frame.y = _gDefSsrpgBattleField.MapChip.iOffsetY;
                
                this._scene.addChild( _frame );
            }
            // 真後ろ
            {
                var iWidth = _gDefSsrpgBattleField.Window.iWidth;
                var iHeight = _gDefSsrpgBattleField.MapChip.iOffsetY;
                
                var _surf = new Surface( iWidth, iHeight );
                _surf.context.beginPath();
                _surf.context.fillStyle = "rgba(0,100,100,0.5)";
                _surf.context.fillRect( 0, 0, iWidth, iHeight );
                
                var _frame = new Sprite( iWidth, iHeight );
                _frame.image = _surf;
                _frame.x = 0;
                _frame.y = 0;
                
                this._scene.addChild( _frame );
            }
        };
        
        // 関数：ステ窓
        this.CreateWindowStates = function()
        {
            var iWidth = 500;
            var iHeight = 100;
            
            var _surf = new Surface( iWidth, iHeight );
            _surf.context.beginPath();
            _surf.context.fillStyle = "rgba(200,200,200,0.75)";
            _surf.context.fillRect( 0, 0, iWidth, iHeight );
            _surf.context.stroke();
            
            var _window = new Sprite( iWidth, iHeight );
            _window.image = _surf;
            _window.x = 0;
            _window.y = 400;
            
            this._scene.addChild( _window );
            
            return _window;
        };
        
        // 関数：ステ窓文字
        this.CreateWindowCharaStates = function()
        {
            this.aryObjStatesWindow = [];
            this.aryObjStatesWindow[ 0 ] = this.CreateChara( -1, 6, 0 );
            this.aryObjStatesWindow[ 1 ] = this.CreateLabel( 100, 400, "ユニット名" );
            this.aryObjStatesWindow[ 2 ] = this.CreateLabel( 10, 455, "Unit Name" );
            this.aryObjStatesWindow[ 3 ] = this.CreateLabel( 10, 475, "Unit Jobs" );
            this.aryObjStatesWindow[ 4 ] = this.CreateLabel( 100, 420, "Lv : " + 20 );
            this.aryObjStatesWindow[ 5 ] = this.CreateLabel( 100, 440, "Hp : " + 20 + " / " + 20 );
            this.aryObjStatesWindow[ 6 ] = this.CreateLabel( 100, 460, "Tp : " + 20 + " / " + 20 );
            this.aryObjStatesWindow[ 7 ] = this.CreateLabel( 200, 420, "Atk : " + 20 );
            this.aryObjStatesWindow[ 8 ] = this.CreateLabel( 200, 440, "Def : " + 20 );
            this.aryObjStatesWindow[ 9 ] = this.CreateLabel( 200, 460, "Agi : " + 20 );
            this.aryObjStatesWindow[ 10] = this.CreateLabel( 300, 420, "Int : " + 20 );
            this.aryObjStatesWindow[ 11] = this.CreateLabel( 300, 440, "Mnd : " + 20 );
            this.aryObjStatesWindow[ 12] = this.CreateLabel( 300, 460, "Luk : " + 20 );
            this.aryObjStatesWindow[ 13] = this.CreateLabel( 400, 420, "Mov : " + 3 );
            this.aryObjStatesWindow[ 14] = this.CreateLabel( 400, 440, "Type : " + "重步" );
        };
        
        // 関数：ステ窓描画
        this.DrawWindowCharaStates = function( _chara )
        {
            this.aryObjStatesWindow[ 0 ].image = _chara.image;
            this.aryObjStatesWindow[ 1 ].text = _chara.param.sClass;    //"ユニット名"
            this.aryObjStatesWindow[ 2 ].text = _chara.param.sName;     //"Unit Name";
            // this.aryObjStatesWindow[ 3 ].text = _chara.param.sClass;    //"Unit Jobs";
            this.aryObjStatesWindow[ 4 ].text = "Lv : " + _chara.param.iLv; //20;
            this.aryObjStatesWindow[ 5 ].text = "Hp : " + _chara.param.iHp[0] + " / " + _chara.param.iHp[1];    //20 + " / " + 20;
            this.aryObjStatesWindow[ 6 ].text = "Tp : " + _chara.param.iTp[0] + " / " + _chara.param.iTp[1];    //20 + " / " + 20;
            this.aryObjStatesWindow[ 7 ].text = "Atk : " + _chara.param.iAtk;   //20;
            this.aryObjStatesWindow[ 8 ].text = "Def : " + _chara.param.iDef;   //20;
            this.aryObjStatesWindow[ 9 ].text = "Agi : " + _chara.param.iAgi;   //20;
            this.aryObjStatesWindow[ 10].text = "Int : " + _chara.param.iInt;   //20;
            this.aryObjStatesWindow[ 11].text = "Mnd : " + _chara.param.iMnd;   //20;
            this.aryObjStatesWindow[ 12].text = "Luk : " + _chara.param.iLuk;   //20;
            this.aryObjStatesWindow[ 13].text = "Mov : " + _chara.param.iMov;   //3;
            // this.aryObjStatesWindow[ 14].text = "Type : " + "重步";
        };
        
        // 関数：背景作成
        this.CreateChip = function( x, y )
        {
            var iWidth = _gDefSsrpgBattleField.MapChip.iWidth;
            var iHeight = _gDefSsrpgBattleField.MapChip.iHeight;
            
            var surf = new Surface( iWidth, iHeight );
            surf.context.beginPath();
            surf.context.fillStyle = "rgba(255,0,0,0.5)";
            surf.context.rect( 0, 0, iWidth, iHeight );
            surf.context.stroke();
            
            var _posTmp = this.GetScrPos( x, y );
            
            var _field = new Sprite( iWidth, iHeight );
            _field.image = surf;
            _field.x = _posTmp.x;
            _field.y = _posTmp.y;

            this._scene.addChild( _field );
            
            return _field;
        };
        
        // 関数：行動範囲チップ作成
        this.CreateEffectiveAreaChip = function( x, y, iType )
        {
            var iWidth = _gDefSsrpgBattleField.MapChip.iWidth;
            var iHeight = _gDefSsrpgBattleField.MapChip.iHeight;
            
            var surf = new Surface( iWidth, iHeight );
            surf.context.beginPath();
            
            switch( iType )
            {
                case _gDefSsrpgBattleField.EffectiveAreaType.iAttack:
                    surf.context.fillStyle = "rgba(255,255,0,0.5)";
                    break;
                case _gDefSsrpgBattleField.EffectiveAreaType.iDefence:
                    surf.context.fullStyle = "rgba(0,0,255,0.5)";
                    break;
            };
            
            surf.context.rect( 0, 0, iWidth, iHeight );
            surf.context.stroke();
            
            var _posTmp = this.GetScrPos( x, y );
            
            var _field = new Sprite( iWidth, iHeight );
            _field.image = surf;
            _field.x = _posTmp.x;
            _field.y = _posTmp.y;

            this._scene.addChild( _field );
            
            return _field;
        };
        
        // 関数：キャラ作成
        this.CreateChara = function( x, y, iTeam, param )
        {
            var iWidth = _gDefSsrpgBattleField.MapChip.iWidth;
            var iHeight = _gDefSsrpgBattleField.MapChip.iHeight;
            
            var _surf = new Surface( iWidth, iHeight );
            _surf.context.beginPath();
            
            switch( iTeam )
            {
                case 0:
                    _surf.context.fillStyle = "rgba(255,0,0,0.8)";
                    break;
                case 1:
                    _surf.context.fillStyle = "rgba(0,0,255,0.8)";
                    break;
                default:
                    _surf.context.fillStyle = "rgba(100,100,100,0.8)";
                    break;
            }
            
            _surf.context.fillRect( 5, 5, 50, 50 );
            _surf.context.stroke();
            
            var _posTmp = this.GetScrPos( x, y );
            
            var _chara = new Sprite( iWidth, iHeight );
            _chara.image = _surf;
            _chara.x = _posTmp.x;
            _chara.y = _posTmp.y;
            
            _chara.param = param;
            _chara._pos = {
                x: x,
                y: y
            };
            
            this._scene.addChild( _chara );
            
            return _chara;
        };
        
        // マネージャーオブジェクト
        this._lblManager = this.CreateLabel( 0, 0, "!" );
        this._lblManager._parent = this;
        this._lblManager._iSelectedUnit = null;
        this._lblManager._iSelectedPos = null;
        this._lblManager._iGameState = _gDefSsrpgBattleField.GameState.iBeginGameState;
        this._lblManager.addEventListener( "enterframe", function()
        {
            switch( this._iGameState )
            {
                // このシーンが開始する時のステート
                case _gDefSsrpgBattleField.GameState.iBeginGameState:
                    alert( "BeginGameState" );
                    alert( "StartPlayerState" );
                    this._iSelectedUnit = null;
                    this._iSelectedPos = null;
                    this._iGameState = _gDefSsrpgBattleField.GameState.iStartPlayerState;
                    break;
                    
                // プレイヤーターンの開始ステート
                case _gDefSsrpgBattleField.GameState.iStartPlayerState:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iSelectUnit;
                    break;
                
                // ユニット選択ステート
                case _gDefSsrpgBattleField.GameState.iSelectUnit:
                    if ( this._iSelectedUnit !== null )
                    {
                        alert( "SelectedUnit : " + this._iSelectedUnit );
                        this._iGameState = _gDefSsrpgBattleField.GameState.iSelectMovePos;
                    }
                    break;
                    
                // 移動位置選択ステート    
                case _gDefSsrpgBattleField.GameState.iSelectMovePos:
                    if ( this._iSelectedPos !== null )
                    {
                        alert( "SelectedPos : " + this._iSelectedPos );
                        this._iGameState = _gDefSsrpgBattleField.GameState.iPlayerUnitMoveMotion;
                    }
                    break;
                    
                // 移動待ちステート
                case _gDefSsrpgBattleField.GameState.iPlayerUnitMoveMotion:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iDecideMovePos;
                    break;
                    
                // 移動決定ステート
                case _gDefSsrpgBattleField.GameState.iDecideMovePos:
                    var _getPos = this._iSelectedPos;
                    var _posTmp = this._parent.GetScrPos( _getPos.x, _getPos.y );
                    
                    this._iSelectedUnit.x = _posTmp.x;
                    this._iSelectedUnit.y = _posTmp.y;
                    
                    this._iSelectedUnit._pos.x = _getPos.x;
                    this._iSelectedUnit._pos.y = _getPos.y;
                    
                    this._iGameState = _gDefSsrpgBattleField.GameState.iSelectAction;
                    break;
                    
                // 行動選択ステート
                case _gDefSsrpgBattleField.GameState.iSelectAction:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iCalcActionArea;
                    break;
                    
                // 行動範囲計算ステート
                case _gDefSsrpgBattleField.GameState.iCalcActionArea:
                    var _pos = this._iSelectedUnit._pos;
                    /*
                    this._parent.CreateEffectiveAreaChip( _pos.x, _pos.y, 0 );
                    this._parent.CreateEffectiveAreaChip( _pos.x - 1, _pos.y, 0 );
                    this._parent.CreateEffectiveAreaChip( _pos.x + 1, _pos.y, 0 );
                    this._parent.CreateEffectiveAreaChip( _pos.x, _pos.y - 1, 0 );
                    */
                    var _mapTmp = this._parent.CreateEffectiveAreaChip( _pos.x, _pos.y + 1, 0 );
                    _mapTmp.addEventListener( "touchstart", this._funcMapTouchStart );
                    _mapTmp._parent = this;
                    _mapTmp._Pos = {
                        x: _pos.x,
                        y: _pos.y + 1
                    };
                    
                    this._iGameState = -1;
                    break;
            }
        } );
        
        // 後ろ枠の作成
        this.CreateBackSpace();
        
        // ステ窓(モック)
        this.CreateWindowStates();
        this.CreateWindowCharaStates();
        
        // ユニットタッチ時のイベント（試作）
        this._funcMapTouchStart = function()
        {
            this._parent._lblManager._iSelectedPos = this._Pos;            
        };
        
        // 背景チップ作成
        for(var j=0; j<6; j++)
        {
            for(var i=0; i<6; i++)
            {
                var _mapTmp = this.CreateChip( i, j );
                _mapTmp.addEventListener( "touchstart", this._funcMapTouchStart );
                _mapTmp._parent = this;
                _mapTmp._Pos = {
                    x: i,
                    y: j
                };
            }
        }
        
        // ユニットパラメータの設定
        var _aryCharaParam = [
            {
                sClass: "テストユニット",
                sName: "Chara1",
                iLv: 1,
                iHp: [20, 20],
                iTp: [10, 10],
                iAtk: 10,
                iDef: 10,
                iAgi: 10,
                iInt: 10,
                iMnd: 10,
                iLuk: 10,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara2",
                iLv: 2,
                iHp: [21, 21],
                iTp: [11, 11],
                iAtk: 11,
                iDef: 11,
                iAgi: 11,
                iInt: 11,
                iMnd: 11,
                iLuk: 11,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara3",
                iLv: 3,
                iHp: [22, 22],
                iTp: [12, 12],
                iAtk: 12,
                iDef: 12,
                iAgi: 12,
                iInt: 12,
                iMnd: 12,
                iLuk: 12,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara4",
                iLv: 4,
                iHp: [23, 23],
                iTp: [13, 13],
                iAtk: 13,
                iDef: 13,
                iAgi: 13,
                iInt: 13,
                iMnd: 13,
                iLuk: 13,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara5",
                iLv: 1,
                iHp: [20, 20],
                iTp: [10, 10],
                iAtk: 10,
                iDef: 10,
                iAgi: 10,
                iInt: 10,
                iMnd: 10,
                iLuk: 10,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara6",
                iLv: 2,
                iHp: [21, 21],
                iTp: [11, 11],
                iAtk: 11,
                iDef: 11,
                iAgi: 11,
                iInt: 11,
                iMnd: 11,
                iLuk: 11,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara7",
                iLv: 3,
                iHp: [22, 22],
                iTp: [12, 12],
                iAtk: 12,
                iDef: 12,
                iAgi: 12,
                iInt: 12,
                iMnd: 12,
                iLuk: 12,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            },
            {
                sClass: "テストユニット",
                sName: "Chara8",
                iLv: 4,
                iHp: [23, 23],
                iTp: [13, 13],
                iAtk: 13,
                iDef: 13,
                iAgi: 13,
                iInt: 13,
                iMnd: 13,
                iLuk: 13,
                iMov: 1,
                arySpecial: [],
                aryCommand: []
            }
        ];
        
        // ユニット配置配列
        var _aryChara = [
            [ 5, 0, 0, _aryCharaParam[0] ],
            [ 5, 1, 0, _aryCharaParam[1] ],
            [ 5, 2, 0, _aryCharaParam[2] ],
            [ 5, 3, 0, _aryCharaParam[3] ],
            
            [ 0, 2, 1, _aryCharaParam[4] ],
            [ 0, 3, 1, _aryCharaParam[5] ],
            [ 0, 4, 1, _aryCharaParam[6] ],
            [ 0, 5, 1, _aryCharaParam[7] ]
        ];
        
        // ユニットタッチ時のイベント（試作）
        this._funcUnitTouchStart = function()
        {
            // alert( "Touch!" );
            
            // ステータスウィンドウの描画
            this._parent.DrawWindowCharaStates( this );
            
            // ユニット選択インデックスを渡す
            this._parent._lblManager._iSelectedUnit = this;
        };
        
        // ユニットの配置
        for ( var i=0; i<_aryChara.length; i++ )
        {
            var _charaTmp = this.CreateChara( _aryChara[i][0], _aryChara[i][1], _aryChara[i][2], _aryChara[i][3] );
            _charaTmp.addEventListener( "touchstart", this._funcUnitTouchStart );
            _charaTmp._parent = this;
            _charaTmp._iIndex = i;
            _charaTmp._pos = {
                x: _aryChara[i][0],
                y: _aryChara[i][1]
            };
        }
    };
    
    return this;
};


