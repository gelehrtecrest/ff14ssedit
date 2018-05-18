(function($){
	//画像関連
	var img;
	var img2;
	var stage;

	//画像ロード
	function loadImage (imageData, logoImageData){
		//画像のロード
		//画像が選択されている時のみ合成
		if(imageData !== null) {
			var baseImg2 = new Image();
			baseImg2.src = imageData;
			img2 = new createjs.Bitmap(baseImg2);
			$('#result').attr({
				'width': baseImg2.width,
				'height': baseImg2.height
			});
		}

		stage = new createjs.Stage('result');
	}

	//ロゴを合成する処理
	function genImage (imageIni){
		// 文字合成
		var content = $('#text').val();
		img = new createjs.Text(content);
		img.color = $('#color').val();
		img.font = $('#style').val() + ' ' + $('#px').val() + $('#font').val();

		//合成画像の設定
		//上下は10ピクセルごと移動
		img.x = imageIni.xPos * 10;
		img.y = imageIni.yPos * 10;
		//拡縮は10％ずつ
		img.scaleX = img.scaleX * (1 + imageIni.Scale / 10);
		img.scaleY = img.scaleY * (1 + imageIni.Scale / 10);

		// rawcanvasがベース
		var rawcanvas = document.getElementById('rawcanvas');
		var baseImg = new Image();
		baseImg.src = rawcanvas.toDataURL();
		img2 = new createjs.Bitmap(baseImg);
		$('#result').attr({
			'width': baseImg.width,
			'height': baseImg.height
		});

		stage = new createjs.Stage('result');
		//ステージ生成
		stage.addChild(img2);
		stage.addChild(img);

		//ステージ反映
		stage.update();
	}

	$(function(){
		//設定のデフォルト値
		$('#text').val('Copyright (C) 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.');
		$('#color').val('white');
		$('#style').val('');
		$('#font').val('/1.5 Meiryo,sans-serif');
		$('#px').val('75px');

		//読込画像のオブジェクト
		var imageIni = {
			xPos : 8,
			yPos : 8,
			Scale : 8,
			imageData : null,
			logoImageData : null,
			resetImage : function(){
				this.xPos = 8;
				this.yPos = 8;
				this.Scale = 8;
			},
			makeImage : function(){
				//if(this.imageData !== null) {
					//loadImage(this.imageData, this.logoImageData);
					genImage(this);
				//}
			}
		};

		//get情報
		var url = location.href;
		var parameters = url.split('?');
		var queries = (parameters[1] || 'dummy=dummy').split('&');
		i = 0;

		for(i; i < queries.length; i ++) {
			var t = queries[i].split('=');
			if(t['0'] == 'logourl'){
				$('#logourl').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'xpos'){
				imageIni.xPos = parseFloat(t['1']);
			} else if(t['0'] == 'ypos'){
				imageIni.yPos = parseFloat(t['1']);
			} else if(t['0'] == 'scale'){
				imageIni.Scale = parseFloat(t['1']);
			} else if(t['0'] == 'text'){
				$('#text').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'color'){
				$('#color').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'style'){
				$('#style').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'font'){
				$('#font').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'px'){
				$('#px').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'title'){
				$('title').text(decodeURIComponent(t['1']));
				$('h1').text(decodeURIComponent(t['1']));
			} else if(t['0'] == 'comment'){
				$('#comment').text(decodeURIComponent(t['1']));
			}
		}

		//イベント関連処理
		//画像読込
		/*
		$('#getfile').change(function (){
			//読み込み
			var fileList =$('#getfile').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);

			//読み込み後
			$(reader).on('load',function(){
				$('#preview').prop('src',reader.result);
				imageIni.imageData = reader.result;
			});
		});
		*/
		$('#rawcanvas').change(function (){
			//読み込み
			var rawcanvas = document.getElementById('rawcanvas');
			baseImg.src = rawcanvas.toDataURL();
			img2 = new createjs.Bitmap(baseImg);
		});
	
		//ボタンイベントまとめ
		$('.btn').on('click',function(e){
			if (e.target.id === 'update'){
			}else if (e.target.id === 'up'){
				imageIni.yPos -= 1;
			}else if (e.target.id === 'down'){
				imageIni.yPos += 1;
			}else if (e.target.id === 'left'){
				imageIni.xPos -= 1;
			}else if (e.target.id === 'right') {
				imageIni.xPos += 1;
			}else if (e.target.id === 'zoomin') {
				imageIni.Scale += 1;
			}else if (e.target.id === 'zoomout') {
				imageIni.Scale -= 1;
			}else if (e.target.id === 'reset'){
				imageIni.resetImage();
			}else if (e.target.id === 'dl'){
				return;
			}

			//画像操作時は再描画を行う
			//if(imageIni.imageData !== null){
				imageIni.makeImage();
			//}else{
			//	$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			//}

			//画面操作時はURLを再生成する
			write_settingurl(imageIni);
		});

		$(document).on('input', '.input', function() {
			//input操作時は再描画を行う
			//if(imageIni.imageData !== null){
				imageIni.makeImage();
			//}else{
			//	$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			//}

			//input操作時はURLを再生成する
			write_settingurl(imageIni);
		});

		//初回URL生成
		write_settingurl(imageIni);
	});

	// URL生成
	function geturl(imageIni) {
		var url;
		var baseurl = location.href.split('?')[0];
		url = baseurl;

		//設定をgetに追加
		//text
		url = url + '?text=' + encodeURIComponent($('#text').val());
		url = url + '&color=' + encodeURIComponent($('#color').val());
		url = url + '&px=' + encodeURIComponent($('#px').val());
		url = url + '&style=' + encodeURIComponent($('#style').val());
		url = url + '&font=' + encodeURIComponent($('#font').val());
		//ロゴ位置・サイズ
		url = url + '&xpos=' + imageIni.xPos;
		url = url + '&ypos=' + imageIni.yPos;
		url = url + '&scale=' + imageIni.Scale;
		//ロゴ読み出し場所
		if($('input[name=logo]:checked').val() === 'local'){
			url = url + '&logo=local';
		}
		//タイトル
		url = url + '&title=' + encodeURIComponent($('title').text());
		//コメント
		url = url + '&comment=' + encodeURIComponent($('#comment').text());
		return url;
	}

	// URL書き込み
	function write_settingurl(imageIni) {
		var url = geturl(imageIni);
		$('#settingurl a').text(url);
		$('#settingurl a').attr('href', url);
	}
})($);
