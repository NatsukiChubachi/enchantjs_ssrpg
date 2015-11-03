// EnchantJs初期化処理
enchant();

_gGame = null;

// ウィンドウのOnLoad処理
window.onload = function(){
    
    // ゲームウィンドウのコア設定
    // var game = new Core(500, 250);              // 画面の横幅、縦幅
    var game = new Core(500, 500);              // 画面の横幅、縦幅
    game.fps = 30;                              // フレーム数
    
    _gGame = game;                              // ゲームクラスの実体
    
    // データのプリロード
    game.preload(                           // ファイルのプリロード
        "dat\\chara1.png",
        "http://jsrun.it/assets/3/o/3/1/3o319.png" 
        ); 
    
    // ゲームのOnLoad時の処理
    game.onload = function(){
        
        /*
        var label = new Label('GameStart <br/>');  // ラベルの追加
        
        var red = new Sprite(120, 120);            // 赤四角の追加
        red.backgroundColor = 'red';
        red.moveTo(520, 360);
        game.rootScene.addChild(red);             // 赤四角をrootSceneに追加
        
        var blue = new Sprite(120, 120);          // 青四角の追加
        blue.backgroundColor = 'blue';
        game.rootScene.addChild(blue);            // 青四角をrootSceneに追加
        
        blue.on('touchstart', function(evt){      // 青四角のイベント追加
            label.text += 'blue touchstart <br/>';
            red.dispatchEvent(evt);
        });
        
        blue.addEventListener('touchstart', function() { // 青四角のイベント追加
          blue.x += 10;
        });
        
        red.on('touchstart', function(evt){              // 赤四角のイベント追加
            label.text += 'red touchstart <br/>';
        });
        
        game.rootScene.addChild(label);                  // ラベルをrootSceneに追加
        */
        
        /*
        // 二つ目のシーン
        var second = new Scene();
        second.backgroundColor = "#FF9999";
        var secondMessage = new Label("Hello, secondScene");
        secondMessage.x = 10;
        secondMessage.y = 10;
        second.addChild(secondMessage);
        
        game.pushScene(second);


        // 三つめのシーン
        var third = new Scene();
        third.backgroundColor = "#99FF99";
        var thirdMessage = new Label("Hello, thirdScene");
        thirdMessage.x = 10;
        thirdMessage.y = 10;
        third.addChild(thirdMessage);
        
        second.addEventListener("touchstart", function() {
          game.pushScene(third);
        });
        
        third.addEventListener("touchstart", function() {
          game.replaceScene(second);
        });
        */
       
        /*
        // HighAndLow
        var _newScene = new CHighAndLow();
        _newScene.initialize( game );
        */
        
        // SSRPG
        var _newScene = new CSsrpgTop();
        _newScene.initialize( game );
        
        /*
        // TCG
        var _newScene = new CTcgTop();
        _newScene.initialize( game );
        */
    };
    
    // ゲーム処理のスタート
    game.start();
};



