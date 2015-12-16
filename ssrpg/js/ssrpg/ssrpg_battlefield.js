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
        // スタートステート
        iNoState: -1,
        iBeginGameState: 0,
        
        // プレイヤーステート
        iStartPlayerState: 101,
        iTurnStart: 102,
        iSelectUnit: 103,
        iSelectMovePos: 104,
        iPlayerUnitMoveMotion: 105,
        iDecideMovePos: 106,
        iSelectAction: 107,
        iCalcActionArea: 108,
        iSelectActionPos: 109,
        iActionExecute: 110,
        iCheckAfterAction: 111,
        iEndPlayerState: 112,
        
        // エネミーステート
        iStartEnemyState: 201,
        iEnemyTurnStart: 202,
        iEnemySelectUnit: 203,
        iEnemySelectMovePos: 204,
        iEnemyUnitMoveMotion: 205,
        iEnemySelectAction: 206,
        iEnemyCalcActionArea: 207,
        iEnemySelectActionPos: 208,
        iEnemyActionExecute: 209,
        iEnemyCheckAfterAction: 210,
        iEnemyTurnEnd: 211,
        iEndEnemyState: 212,
        
        // バトルエンドチェック
        iBattleEndCheckState: 300,
        
        // バトルエンドステート
        iEndBattleState: 1000,
        iBattleResultState: 1001,
        iEndGameState: 1002
    }
};

// 共通処理関連
var CSsrpgBattleCommon = function( _scene ) {
    
    // シーンの取得
    this._scene = _scene;
    
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

        var _posTmp = _common.GetScrPos( x, y );

        var _chara = new Sprite( iWidth, iHeight );
        _chara.image = _surf;
        _chara.x = _posTmp.x;
        _chara.y = _posTmp.y;

        _chara._param = param;
        _chara._team = iTeam;
        _chara._pos = {
            x: x,
            y: y
        };

        this._scene.addChild( _chara );

        return _chara;
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

        var _posTmp = _common.GetScrPos( x, y );

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
                surf.context.fillStyle = "rgba(255,0,0,0.4)";
                break;
            case _gDefSsrpgBattleField.EffectiveAreaType.iDefence:
                surf.context.fullStyle = "rgba(0,255,0,0.4)";
                break;
        };

        //surf.context.rect( 0, 0, iWidth, iHeight );
        surf.context.fillRect( 5, 5, 50, 50 );
        surf.context.stroke();

        var _posTmp = _common.GetScrPos( x, y );

        var _field = new Sprite( iWidth, iHeight );
        _field.image = surf;
        _field.x = _posTmp.x;
        _field.y = _posTmp.y;

        this._scene.addChild( _field );

        return _field;
    };

};
var _common = null;

// ステータスウィンドウ
var CSsrpgBattleStatesWindow = function( _scene ) {
    // シーンの取得
    this._scene = _scene;
    
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
        this.aryObjStatesWindow[ 0 ] = _common.CreateChara( -1, 6, 0 );
        this.aryObjStatesWindow[ 1 ] = _common.CreateLabel( 100, 400, "ユニット名" );
        this.aryObjStatesWindow[ 2 ] = _common.CreateLabel( 10, 455, "Unit Name" );
        this.aryObjStatesWindow[ 3 ] = _common.CreateLabel( 10, 475, "Unit Jobs" );
        this.aryObjStatesWindow[ 4 ] = _common.CreateLabel( 100, 420, "Lv : " + 20 );
        this.aryObjStatesWindow[ 5 ] = _common.CreateLabel( 100, 440, "Hp : " + 20 + " / " + 20 );
        this.aryObjStatesWindow[ 6 ] = _common.CreateLabel( 100, 460, "Tp : " + 20 + " / " + 20 );
        this.aryObjStatesWindow[ 7 ] = _common.CreateLabel( 200, 420, "Atk : " + 20 );
        this.aryObjStatesWindow[ 8 ] = _common.CreateLabel( 200, 440, "Def : " + 20 );
        this.aryObjStatesWindow[ 9 ] = _common.CreateLabel( 200, 460, "Agi : " + 20 );
        this.aryObjStatesWindow[ 10] = _common.CreateLabel( 300, 420, "Int : " + 20 );
        this.aryObjStatesWindow[ 11] = _common.CreateLabel( 300, 440, "Mnd : " + 20 );
        this.aryObjStatesWindow[ 12] = _common.CreateLabel( 300, 460, "Luk : " + 20 );
        this.aryObjStatesWindow[ 13] = _common.CreateLabel( 400, 420, "Mov : " + 3 );
        this.aryObjStatesWindow[ 14] = _common.CreateLabel( 400, 440, "Type : " + "重步" );
    };

    // 関数：ステ窓描画
    this.DrawWindowCharaStates = function( _chara )
    {
        this.aryObjStatesWindow[ 0 ].image = _chara.image;
        this.aryObjStatesWindow[ 1 ].text = _chara._param.sClass;    //"ユニット名"
        this.aryObjStatesWindow[ 2 ].text = _chara._param.sName;     //"Unit Name";
        // this.aryObjStatesWindow[ 3 ].text = _chara.param.sClass;    //"Unit Jobs";
        this.aryObjStatesWindow[ 4 ].text = "Lv : " + _chara._param.iLv; //20;
        this.aryObjStatesWindow[ 5 ].text = "Hp : " + _chara._param.iHp[0] + " / " + _chara._param.iHp[1];    //20 + " / " + 20;
        this.aryObjStatesWindow[ 6 ].text = "Tp : " + _chara._param.iTp[0] + " / " + _chara._param.iTp[1];    //20 + " / " + 20;
        this.aryObjStatesWindow[ 7 ].text = "Atk : " + _chara._param.iAtk;   //20;
        this.aryObjStatesWindow[ 8 ].text = "Def : " + _chara._param.iDef;   //20;
        this.aryObjStatesWindow[ 9 ].text = "Agi : " + _chara._param.iAgi;   //20;
        this.aryObjStatesWindow[ 10].text = "Int : " + _chara._param.iInt;   //20;
        this.aryObjStatesWindow[ 11].text = "Mnd : " + _chara._param.iMnd;   //20;
        this.aryObjStatesWindow[ 12].text = "Luk : " + _chara._param.iLuk;   //20;
        this.aryObjStatesWindow[ 13].text = "Mov : " + _chara._param.iMov;   //3;
        // this.aryObjStatesWindow[ 14].text = "Type : " + "重步";
    };
};
var _statesWindow = null;

// テスト情報（決め打ちのステージ情報）
var CSsrpgBattleTestInfo = function() {
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
    this._aryChara = [
        [ 5, 0, 0, _aryCharaParam[0] ],
        [ 5, 1, 0, _aryCharaParam[1] ],
        [ 5, 2, 0, _aryCharaParam[2] ],
        [ 5, 3, 0, _aryCharaParam[3] ],

        [ 0, 2, 1, _aryCharaParam[4] ],
        [ 0, 3, 1, _aryCharaParam[5] ],
        [ 0, 4, 1, _aryCharaParam[6] ],
        [ 0, 5, 1, _aryCharaParam[7] ]
    ];
    
};
var _testinfo = null;

// マネージャー
var CSsrpgBattleManager = function() {
    
};
var _manager = null;

// SSRPG戦場クラス
var CSsrpgBattleField = function() {
    
    
    // 初期化処理
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 共通部分初期化
        _common = new CSsrpgBattleCommon( this._scene );
        
        // ステータスウィンドウ
        _statesWindow = new CSsrpgBattleStatesWindow( this._scene );
        
        // テスト情報
        _testinfo = new CSsrpgBattleTestInfo();
        
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
        
        
        // マネージャーオブジェクト
        this._lblManager = _common.CreateLabel( 0, 0, "" );
        this._lblManager._parent = this;
        this._lblManager._info = {
            _map: {},
            _chara: {},
            _movearea: {},
            _actarea: {}
        };
        this._lblManager._iSelectedUnit = null;
        this._lblManager._iSelectedPos = null;
        this._lblManager._iGameState = _gDefSsrpgBattleField.GameState.iBeginGameState;
        this._lblManager.addEventListener( "enterframe", function()
        {
            var _parent = this._parent;
            
            // ステート別処理
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
                    var _posTmp = _common.GetScrPos( _getPos.x, _getPos.y );
                    
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

                    var _aryAttack = [
                        [_pos.x-1, _pos.y],
                        [_pos.x+1, _pos.y],
                        [_pos.x, _pos.y-1],
                        [_pos.x, _pos.y+1]
                    ];
                    
                    this._funcActionAreaTouchStart = function()
                    {
                        this._parent._iSelectedPos = this._Pos;            
                    };
                    
                    this._aryActMap = [];
                    for ( var i = 0; i < _aryAttack.length; i++ )
                    {
                        var _ActMapTmp = _common.CreateEffectiveAreaChip( _aryAttack[i][0], _aryAttack[i][1], 0 );
                        _ActMapTmp.addEventListener( "touchstart", this._funcActionAreaTouchStart );
                        _ActMapTmp._parent = this;
                        _ActMapTmp._Pos = {
                            x: _aryAttack[i][0],
                            y: _aryAttack[i][1]
                        };
                        this._aryActMap.push( _ActMapTmp );
                    }
                    
                    this._iGameState = _gDefSsrpgBattleField.GameState.iSelectActionPos;
                    this._iSelectedPos = null;
                    break;
                
                // 行動位置選択ステート
                case _gDefSsrpgBattleField.GameState.iSelectActionPos:
                    if ( this._iSelectedPos !== null )
                    {
                        this._iGameState = _gDefSsrpgBattleField.GameState.iActionExecute;
                        
                        // 行動範囲MAPチップを削除
                        for ( var i = 0; i < this._aryActMap.length; i++ )
                        {
                            this._parent._scene.removeChild( this._aryActMap[i] );
                        }
                    }
                    break;
                    
                // 行動実行ステート
                case _gDefSsrpgBattleField.GameState.iActionExecute:
                    var _aryChara = this._info._chara;
                    var hogeKeys = Object.keys( _aryChara );
                    for (var i = 0, len = hogeKeys.length; i < len; i++) 
                    {
                        if ( 
                            this._iSelectedPos.x === _aryChara[ hogeKeys[ i ] ]._pos.x &&
                            this._iSelectedPos.y === _aryChara[ hogeKeys[ i ] ]._pos.y
                            )
                        {
                            // ダメージ処理
                            _aryChara[ hogeKeys[i] ]._param.iHp[0] -= 100;
                        }
                    }
                    this._iGameState = _gDefSsrpgBattleField.GameState.iCheckAfterAction;
                    break;
                    
                // 行動後チェック
                case _gDefSsrpgBattleField.GameState.iCheckAfterAction:
                    // 行動後のユニット消滅処理
                    // 敵全滅で味方側の勝ち
                    var result = this.CheckAfterAction();
                    if ( result.a === false )       alert( "BattleEnd" );
                    else if ( result.b === false )  alert( "BattleEnd" );
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEndPlayerState;
                    break;
                    
                // プレイヤーステートの終了
                case _gDefSsrpgBattleField.GameState.iEndPlayerState:
                    alert( "EndPlayerState" );
                    this._iGameState = _gDefSsrpgBattleField.GameState.iStartEnemyState;
                    break;
                
                // エネミーステートの開始
                case _gDefSsrpgBattleField.GameState.iStartEnemyState:
                    alert( "StartEnemyState" );
                    this._iSelectedUnit = null;
                    this._iSelectedPos = null;
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyTurnStart;
                    break;
                    
                // エネミーターン開始
                case _gDefSsrpgBattleField.GameState.iEnemyTurnStart:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemySelectUnit;
                    break;
                    
                // エネミーユニット選択
                case _gDefSsrpgBattleField.GameState.iEnemySelectUnit:
                    var _aryChara = this._info._chara;
                    var hogeKeys = Object.keys( _aryChara );
                    for (var i = 0, len = hogeKeys.length; i < len; i++) 
                    {
                        if ( 
                            _aryChara[ hogeKeys[ i ] ]._team === 1 &&
                            _aryChara[ hogeKeys[ i ] ]._param.iHp[ 0 ] > 0
                            )
                        {
                            // 異動先の仮決め
                            this._iSelectedUnit = i;
                            this._iSelectedPos = {
                                x: _aryChara[ hogeKeys[ i ] ]._pos.x + 1,
                                y: _aryChara[ hogeKeys[ i ] ]._pos.y
                            };
                            break;
                        }
                    }
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemySelectMovePos;
                    break;
                    
                // エネミー移動先選択
                case _gDefSsrpgBattleField.GameState.iEnemySelectMovePos:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyUnitMoveMotion;
                    break;
                    
                // エネミー移動モーション
                case _gDefSsrpgBattleField.GameState.iEnemyUnitMoveMotion:
                    var _aryChara = this._info._chara;
                    var _chara = _aryChara[ this._iSelectedUnit ];
                    
                    _chara._pos.x = this._iSelectedPos.x;
                    _chara._pos.y = this._iSelectedPos.y;
                    var _posTmp = _common.GetScrPos( _chara._pos.x, _chara._pos.y );
                    _chara.x = _posTmp.x;
                    _chara.y = _posTmp.y;
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemySelectAction;
                    break;
                    
                // エネミー行動選択
                case _gDefSsrpgBattleField.GameState.iEnemySelectAction:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyCalcActionArea;
                    break;
                
                // エネミー行動範囲計算
                case _gDefSsrpgBattleField.GameState.iEnemyCalcActionArea:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemySelectActionPos;
                    break;
                    
                // エネミー行動位置選択
                case _gDefSsrpgBattleField.GameState.iEnemySelectActionPos:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyActionExecute;
                    break;
                    
                // エネミー行動実行
                case _gDefSsrpgBattleField.GameState.iEnemyActionExecute:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyCheckAfterAction;
                    break;
                    
                // エネミー行動後チェック
                case _gDefSsrpgBattleField.GameState.iEnemyCheckAfterAction:
                    // 行動後のユニット消滅処理
                    // 味方全滅で負け
                    var result = this.CheckAfterAction();
                    if ( result.a === false )       alert( "BattleEnd" );
                    else if ( result.b === false )  alert( "BattleEnd" );
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEnemyTurnEnd;
                    break;
                    
                // エネミーターン終了
                case _gDefSsrpgBattleField.GameState.iEnemyTurnEnd:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEndEnemyState;
                    break;
                    
                // エネミーステートの終了
                case _gDefSsrpgBattleField.GameState.iEndEnemyState:
                    alert( "EndEnemyState" );
                    this._iSelectedUnit = null;
                    this._iSelectedPos = null;
                    this._iGameState = _gDefSsrpgBattleField.GameState.iBattleEndCheckState;
                    break;
                    
                // バトル終了チェックステート
                case _gDefSsrpgBattleField.GameState.iBattleEndCheckState:
                    alert( "CheckBattleEnd" );
                    this._iGameState = _gDefSsrpgBattleField.GameState.iStartPlayerState;
                    break;
                    
                // バトル終了ステート
                case _gDefSsrpgBattleField.GameState.iEndBattleState:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iBattleResultState;
                    break;
                    
                // バトル結果ステート
                case _gDefSsrpgBattleField.GameState.iBattleResultState:
                    this._iGameState = _gDefSsrpgBattleField.GameState.iEndGameState;
                    break;
                    
                // ゲーム終了ステート
                case _gDefSsrpgBattleField.GameState.iEndGameState:
                    this._iGameState = -1;
                    break;
            }
        } );
        
        // CheckAfterAction
        // 行動後のユニット消滅チェック
        this._lblManager.CheckAfterAction = function ()
        {
            var _result = {
                a: false,
                b: false
            };
            
            // すべてのユニットを監視
            var _aryChara = this._info._chara;
            var hogeKeys = Object.keys( _aryChara );
            for (var i = 0, len = hogeKeys.length; i < len; i++) 
            {
                // HPが０以下になった時消滅
                var _chara = _aryChara[ hogeKeys[ i ] ];
                if ( _chara._param.iHp[ 0 ] <= 0 )
                {
                    // シーンから削除する
                    this._parent._scene.removeChild( _aryChara[ hogeKeys[i] ] );            
                }
                else
                {
                    // ユニットの存在するチームはtrueを返すようにする
                    if ( _chara._team === 0 )   _result.a = true;
                    else                        _result.b = true;
                }
            }
            
            return _result;
        };
        
        // 後ろ枠の作成
        _statesWindow.CreateBackSpace();
        // ステ窓(モック)
        _statesWindow.CreateWindowStates();
        _statesWindow.CreateWindowCharaStates();
        
        // マップタッチ時のイベント（試作）
        this._funcMapTouchStart = function()
        {
            this._parent._lblManager._iSelectedPos = this._Pos;            
        };
        
        // ユニットタッチ時のイベント（試作）
        this._funcUnitTouchStart = function()
        {
            // ステータスウィンドウの描画
            _statesWindow.DrawWindowCharaStates( this );
            // ユニット選択インデックスを渡す
            this._parent._lblManager._iSelectedUnit = this;
        };
        
        // 背景チップ作成
        for(var j=0; j<6; j++)
        {
            for(var i=0; i<6; i++)
            {
                // マップの作成
                var _mapTmp = _common.CreateChip( i, j );
                _mapTmp.addEventListener( "touchstart", this._funcMapTouchStart );
                _mapTmp._parent = this;
                _mapTmp._Pos = {
                    x: i,
                    y: j
                };
                
                // マネージャーの情報管理
                this._lblManager._info._map[ (j*6) + j ] = _mapTmp;
            }
        }
        
        // ユニットの配置
        for ( var i=0; i<_testinfo._aryChara.length; i++ )
        {
            // ユニットの作成
            var _charaTmp = _common.CreateChara( _testinfo._aryChara[i][0], _testinfo._aryChara[i][1], _testinfo._aryChara[i][2], _testinfo._aryChara[i][3] );
            _charaTmp.addEventListener( "touchstart", this._funcUnitTouchStart );
            _charaTmp._parent = this;
            _charaTmp._iIndex = i;
            _charaTmp._pos = {
                x: _testinfo._aryChara[i][0],
                y: _testinfo._aryChara[i][1]
            };
            
            // マネージャーの情報管理
            this._lblManager._info._chara[ i ] = _charaTmp;
        }
    };
    
    return this;
};


