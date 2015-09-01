/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CHighAndLow = function() {
    
    _giResultNumber = 0;
    
    _gCHighAndLow_RootGame = null;
    
    this.lblNum = null;
    _glblRecentNum = null;
    _glblresult = null;
    
    _gAryInputNum = new Array();
    
    this.initialize = function( _game ) 
    {
        // シーン作成
        _gCHighAndLow_RootGame = _game;
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#99FF99";
        
        // 乱数
        _giResultNumber = parseInt( Math.random() * 200 );
        
        // ラベル作成
        var lblTitle = new Label( "Mini-Game High and Low." );
        lblTitle.x = 10;
        lblTitle.y = 10;
        lblTitle.font = "24px cursive";
        this._scene.addChild( lblTitle );
        
        // ラベル作成
        this.lblNum = new Label( "00" );
        this.lblNum.x = 10;
        this.lblNum.y = 50;
        this.lblNum.font = "75px cursive";
        this.lblNum.textAlign = "center";
        this._scene.addChild( this.lblNum );
        
        // ラベル作成
        var lblRec = new Label( "Recent Input Number." );
        lblRec.x = 10;
        lblRec.y = 150;
        lblRec.font = "16px cursive";
        lblRec.textAlign = "left";
        this._scene.addChild( lblRec );
        
        // ラベル作成
        _glblRecentNum = new Label( "___" );
        _glblRecentNum.x = 10;
        _glblRecentNum.y = 170;
        _glblRecentNum.font = "16px cursive";
        _glblRecentNum.textAlign = "left";
        this._scene.addChild( _glblRecentNum );
        
        // ラベル作成
        _glblResult = new Label( "Non Input." );
        _glblResult.x = 10;
        _glblResult.y = 250;
        _glblResult.font = "16px cursive";
        _glblResult.textAlign = "left";
        this._scene.addChild( _glblResult );
        
        // イベント追加
        this._scene.addEventListener( "touchstart", function() {
          //_gCHighAndLow_RootGame.popScene();
        });
        
        
        // 入力領域のデザイン変更
        var input_back = new Sprite();
        input_back.x = 10;
        input_back.y = 200;
        input_back.width = 150;
        input_back.height = 50;

        // 入力ボックス
        var input = new Entity();
        input.x = 12 + 10;
        input.y = 12 + 200;
        input.width = 140;
        input.height = 25;
        input._element = document.createElement('input');
        input._element.setAttribute("id", "input_box");
        input.backgroundColor = 'rgba(0,0,0,0)';
                
        var button = new Sprite( 16, 16);
        button.image = this._game.assets[ "http://jsrun.it/assets/3/o/3/1/3o319.png" ];
        button.x = 12 + 10 + 150;
        button.y = 200 + 15;
        button.font = "24px cursive";
        button.toucheEnabled = true;
        button.addEventListener( Event.TOUCH_START, function(){
            //console.log("button touch!");
            //console.log( input._element.value );
            // output.text = input._element.value;
            
            var iValue = Number( input._element.value );
            _gAryInputNum.push( iValue );
            _gRefreshInputNum();
            
            if ( _giResultNumber === iValue )
            {
                //console.log( "Goal!" );
                _glblResult.text = iValue + " is Hit!";
                alert( "GOAL!!" );
            }
            else if ( _giResultNumber > iValue )
            {
                //console.log( "Low!" );
                //alert( "Low!" );
                _glblResult.text = iValue + " is Low!";
            }
            else if ( _giResultNumber < iValue )
            {
                //console.log( "High!" );
                _glblResult.text = iValue + " is High!";
            }
        });
        
        this._scene.addChild( input_back );
        this._scene.addChild( input );
        this._scene.addChild( button );
       
        this._game.pushScene( this._scene );
    };
    
    this.event_InputNumber = function()
    {
        
    };
    
    this.refreshInputNum = function()
    {
        _glblRecentNum.text = "";
        for ( var i=0; i<_gAryInputNum.length; i++ )
        {
            _glblRecentNum.text += String(_gAryInputNum[i]) + ", ";
        }
    };
    
    _gRefreshInputNum = this.refreshInputNum;
    
    return this;
};


