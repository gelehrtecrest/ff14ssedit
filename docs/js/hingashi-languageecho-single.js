var jcrop_api;
var img_height;
var img_width;
var rawcanvas;
var rawctx;
var rawscale;
var pensize;
var pencolor;
var penalpha;
var mouseX;
var mouseY;
 
function dispLoading(){
  $("#loadingdiv").append('<img id="loadinggif" src="/static/loading.gif" />');
}
 
// Loadingイメージ削除関数
function removeLoading(){
  $("#loadinggif").remove();
}

$(function(){

  //初期値（サイズ、色、アルファ値）の決定
  pensize = 2;
  pencolor = "#FFFFFF";
  penalpha = 1.0;
  rawscale = 1.0;

  //ペンの値修正
  $('#black').click(function(){
    pencolor = "#000000";
  });
  $('#white').click(function(){
    pencolor = "#FFFFFF";
  });
  $('#large').click(function(){
    pensize = 5;
  });
  $('#small').click(function(){
    pensize = 2;
  });
 
  //マウス継続値の初期値、ここがポイント
  mouseX = "";
  mouseY = "";
 
  $("#devsubmit").click(function(){
    $(".dev").each(function(i, elem) {
      var label = $(elem).find('select').val();
      var filename = $(elem).find('input').val();
      if(label != ''){
        $.ajax({
          type: "POST",
          url: "/hingashi/dev",
          data: {
            "label": label,
            "filename": filename
          },
        });
      }
    });
    alert('ありがとうございます');
  });
  $('#translate').click(
    function(){
      var fd = new FormData();
      var flag = $('input[name=auto]:checked').val();
      if(flag == 1){
        var canvas = document.getElementById("canvas");
        fd.append('canvasfile', canvas.toDataURL());
      } else {
        rawcanvas = document.getElementById("rawcanvas");
        fd.append('canvasfile', rawcanvas.toDataURL());
      }
      fd.append('flag', $('input[name=auto]:checked').val());
      dispLoading();
      $.ajax({
        type: "POST",
        url: '/hingashi/tasks/single',
        data : fd,
        processData: false,
        contentType: false,
        timeout: 100000,
      })
      .done(function(data) {
          console.log(data);
          $('#devdiv').empty();
          var words = "";
          var hiragana_words = ""
          $.each(data, function(i, value){
            words += value['word'];
            var div = '<div class="dev"><input value="' + value['filename'] + '" style="display: none;"/><img class="col-2" src ="/' + value['filename'] + '" ><select class="selectpicker col-10">';
            var wordarrays = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん', 'が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',  '文字がおかしい'];
             var wordarrays2 = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'hu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n', 'ga', 'gi', 'gu', 'ge', 'go', 'za', 'zi', 'zu', 'ze', 'zo', 'da', 'di', 'du', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po',  'empty'];
             var wordarrays3 = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'hu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n', 'ga', 'gi', 'gu', 'ge', 'go', 'za', 'zi', 'zu', 'ze', 'zo', 'da', 'di', 'du', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po',  ''];
           for(var j=0; j < wordarrays.length; j++) {
              if(value['word'] == wordarrays3[j]) {
                div += '<option value="' + wordarrays2[j] + '" selected="selected">' + wordarrays[j] + '</option>';
                if(value['word'] != ''){
                  hiragana_words += wordarrays[j];
                }
              } else {
                div += '<option value="' + wordarrays2[j] + '">' + wordarrays[j] + '</option>';
              }
            };
            div += '</select></div>';
            $('#devdiv').append(div);
          });
          $('#translate_text').val(hiragana_words);
          $('#sns_text').val('「' + hiragana_words + '」と翻訳されました http://languageecho.com #FF14 #エオルゼア文字 #言語を超える力 #LanguageEcho');
          var $widget = $("#twitter-widget-0");
          src = $widget.attr("src"),
          url = src.replace(/\&text=.*\&/, "&text=" + encodeURIComponent('「' + words + '」と翻訳されました') + "&");
        
          $widget.attr({src: url});
          $("#box").html("").append($widget);
          removeLoading();
      })
      .fail(function(xhr, textStatus, errorThrown) {
          alert("Sorry! Something wrong!");
          removeLoading();
      });
    }
  );

  $('#upfile').change(function (){
    var files = this.files;
    var reader = new FileReader();
    $('.jcrop-holder').remove();
    //jcrop_api.destroy();
    $("#translate").prop("disabled", true);
    $("#rawcanvas").hide();
    $("#canvas").hide();
    reader.onload = function( event ) {
      var imgreader;
      if(!files[0]) return;
      load(files[0], function(loadcanvas) {
        var loadctx = loadcanvas.getContext('2d');
        var max_width = $(window).width() - 50;
        var scale = 1.0;
        if(max_width < loadcanvas.width){
          scale = max_width / loadcanvas.width;
        }
        var loadimage = new Image();
        loadimage.crossOrigin = "Anonymous";
        loadimage.onload = function(event){
          loadcanvas.width = loadcanvas.width * scale;
          loadcanvas.height = loadcanvas.height * scale;
          loadctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, this.width * scale, this.height * scale)
          imgreader = loadcanvas.toDataURL();
          $('#loadimg').prop('src',imgreader);
          $("#loadimg").bind("load",function(){
            var cnvs = document.getElementById('canvas');
            var ctx = cnvs.getContext('2d');
            rawcanvas = document.getElementById('rawcanvas');
            rawctx = rawcanvas.getContext('2d');
            var img = new Image();
            img.src = imgreader;
            img.onload = function() {
              img_height = img.height;
              img_width = img.width;
              var x = $('#x').val();
              var y = $('#y').val();
              var w = $('#w').val();
              var h = $('#h').val();
              if(w != 0 && h != 0){
                ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
                rawctx.drawImage(img, x, y, w, h, 0, 0, w, h);
              } else {
                rawctx.drawImage(img, 0, 0);
                ctx.drawImage(img, 0, 0);
              }
              setCanvasEvent();

              var r = parseInt($('#r').val());
              var g = parseInt($('#g').val());
              var b = parseInt($('#b').val());
              var t = parseInt($('#t').val());

              setcanvas(r, g, b, t, true);
 
              //jcrop_api.setImage(reader.result);
              jcrop_api = $.Jcrop('#loadimg');
              jcrop_api.setOptions({
                onSelect: updateCoords,
                boxWidth: $(window).width() - 50,
                boxHeight: 1000,
                //maxSize: [ 1000, 2000 ],
              });
              // 一旦、1つめ以外のjcrop-holderを隠す
              $(".jcrop-holder").each(function(i) {
                if(i > 0){
                  $(this).hide();
                }
              });
            }
            img.src = imgreader;
          });
        }
        loadimage.src = loadcanvas.toDataURL();
      });
    };
    reader.readAsDataURL( files[0] );

    jcrop_api = $.Jcrop('#loadimg');
  });

  function load(file, callback) {
    // canvas: true にすると canvas に画像を描画する(回転させる場合は必須オプション)
    var options = {canvas: true};

    loadImage.parseMetaData(file, function (data) {
      if (data.exif) {

        // options の orientation は小文字。 exif.getの 'Orientation' は先頭大文字
        // ここでcanvasの回転を指定している
        options.orientation = data.exif.get('Orientation');
      }
      // 画像の読み込み。完了時に callback が呼び出される
      loadImage(file, callback, options);
    });
  }

  
  $('.rgbnum' ).change( 'input', function () {
    $('#r').val($('#rn').val());
    $('#g').val($('#gn').val());
    $('#b').val($('#bn').val());
    $('#t').val($('#tn').val());
    changergb();
  });

  $('.rgb' ).change( 'input', function () {
    changergb();
  });

  function changergb() {
    var r = parseInt($('#r').val());
    var g = parseInt($('#g').val());
    var b = parseInt($('#b').val());
    var t = parseInt($('#t').val());

    var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
    $('#color').css('background-color', color);
    setcanvas(r, g, b, t, false)
  };

  $('input[name=auto]' ).change( 'input', function () {
    if($('input[name=auto]:checked').val() === '1'){
      $('.manual').show();
    } else {
      $('.manual').hide();
    }
    var r = parseInt($('#r').val());
    var g = parseInt($('#g').val());
    var b = parseInt($('#b').val());
    var t = parseInt($('#t').val());

    setcanvas(r, g, b, t, true);
  });

  $('input[name="mode"]').change( function() {  
    if($('input[name=mode]:checked').val() == 'pen'){
      $('#penmode').show();
    } else {
      $('#penmode').hide();
    }
  });
});

function setcanvas(r, g, b, t, rawcanvasrewriteflag) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    rawcanvas = document.getElementById('rawcanvas');
    rawctx = rawcanvas.getContext('2d');
    var img = new Image();
    img.src = $('#loadimg').attr('src');

    var x = $('#x').val();
    var y = $('#y').val();
    var w = $('#w').val();
    var h = $('#h').val();

    img.onload = function() {
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      if(rawcanvasrewriteflag){
        rawctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      }
      rawscale = $('#rawcanvas').width() / rawcanvas.width;
      setCanvasEvent();
      var src = rawctx.getImageData(0, 0, rawcanvas.width, rawcanvas.height);
      var dst = ctx.createImageData(canvas.width, canvas.height);

      for (var i = 0; i < src.data.length; i=i+4) {
        if((src.data[i] < r + t && src.data[i] > r - t) &&
            (src.data[i+1] < g + t && src.data[i+1] > g - t) &&
            (src.data[i+2] < b + t && src.data[i+2] > b - t)){
          // グレースケール化
          var pixel = abs(src.data[i] - r) + abs(src.data[i+1] - g) + abs(src.data[i+2] - b);
　　　　　// 数値化
          d = parseInt(pixel)

          dst.data[i]   = d;
          dst.data[i+1]   = d;
          dst.data[i+2]   = d;
        } else {

          dst.data[i]   = 255;
          dst.data[i+1]   = 255;
          dst.data[i+2]   = 255;
        }
        dst.data[i+3] = src.data[i+3];
      }

      ctx.putImageData(dst, 0, 0);

      var img_jpeg_src = canvas.toDataURL("image/jpeg");
      document.getElementById("canvasupfile").src = img_jpeg_src;
    }
}

// 絶対値を求める
function abs(val) {
  return val < 0 ? -val : val;
};

function updateCoords(c){
  $("#translate").prop("disabled", false);
  $('#rawcanvas').show();
  $('#canvas').show();

  $('#x').val(c.x);
  $('#y').val(c.y);
  $('#w').val(c.w);
  $('#h').val(c.h);
  var cnvs = document.getElementById('canvas');
  var ctx = cnvs.getContext('2d');
  rawcanvas = document.getElementById('rawcanvas');
  rawctx = rawcanvas.getContext('2d');
  var img = new Image();
  img.src = $('#loadimg').attr('src');
  img.onload = function() {
    ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h);
    rawctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h);
    setCanvasEvent();

    var r = parseInt($('#r').val());
    var g = parseInt($('#g').val());
    var b = parseInt($('#b').val());
    var t = parseInt($('#t').val());

    setcanvas(r, g, b, t);
  }

  $('canvas').attr({
    'width': c.w,
    'height': c.h
  });
};

function setCanvasEvent() {
  rawcanvas.addEventListener('mousemove', onMove, false);
  rawcanvas.addEventListener('mousedown', onClick, false);
  rawcanvas.addEventListener('mouseup', drawEnd, false);
  rawcanvas.addEventListener('mouseout', drawEnd, false);
  rawcanvas.addEventListener('touchmove', onMoveTouch, false);
  rawcanvas.addEventListener('touchstart', onClickTouch, false);
  rawcanvas.addEventListener('touchend', drawEnd, false);
}

//マウス動いていて、かつ左クリック時に発火。
function onMove(e) {
  if($('[name=mode]:checked').val() == 'pen'){
    if (e.buttons === 1 || e.witch === 1) {
      var rect = e.target.getBoundingClientRect();
      var X = ~~(e.clientX - rect.left);
      var Y = ~~(e.clientY - rect.top);
      X = X / rawscale;
      Y = Y / rawscale;
      //draw 関数にマウスの位置を渡す
      draw(X, Y);
    }
  }
};

//マウスが左クリックされると発火。
function onClick(e) {
  if (e.button === 0) {
    var rect = e.target.getBoundingClientRect();
    var X = ~~(e.clientX - rect.left);
    var Y = ~~(e.clientY - rect.top);
    if($('[name=mode]:checked').val() == 'pen'){
      X = X / rawscale;
      Y = Y / rawscale;
     //draw 関数にマウスの位置を渡す
      draw(X, Y);
    } else {
      spuit(X, Y);
    }
  }
};

//タッチパネル上で指を動かしている時
function onMoveTouch(e) {
  if($('[name=mode]:checked').val() == 'pen'){
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var X = ~~(e.touches[0].clientX - rect.left);
    var Y = ~~(e.touches[0].clientY - rect.top);
    X = X / rawscale;
    Y = Y / rawscale;
    //draw 関数にマウスの位置を渡す
    draw(X, Y);
  }
};

//タッチパネルを触った時
function onClickTouch(e) {
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  var X = ~~(e.touches[0].clientX - rect.left);
  var Y = ~~(e.touches[0].clientY - rect.top);
  if($('[name=mode]:checked').val() == 'pen'){
    X = X / rawscale;
    Y = Y / rawscale;
    //draw 関数にマウスの位置を渡す
    draw(X, Y);
  } else {
    spuit(X, Y);
  }
};



//渡されたマウス位置を元に直線を描く関数
function draw(X, Y) {
  rawctx.beginPath();
  rawctx.globalAlpha = penalpha;
  //マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
  if (mouseX === "") {
    //継続値が初期値の場合は、現在のマウス位置をスタート位置とする
    rawctx.moveTo(X, Y);
  } else {
    //継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
    rawctx.moveTo(mouseX, mouseY);
  }
  //lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
  rawctx.lineTo(X, Y);
  //直線の角を「丸」、サイズと色を決める
  rawctx.lineCap = "round";
  rawctx.lineWidth = pensize * 2;
  rawctx.strokeStyle = pencolor;
  rawctx.stroke();
  //マウス継続値に現在のマウス位置、つまりゴール位置を代入
  mouseX = X;
  mouseY = Y;
};
 
//左クリック終了、またはマウスが領域から外れた際、継続値を初期値に戻す
function drawEnd() {
  mouseX = "";
  mouseY = "";
  var r = parseInt($('#r').val());
  var g = parseInt($('#g').val());
  var b = parseInt($('#b').val());
  var t = parseInt($('#t').val());
  setcanvas(r, g, b, t, false);
}

function spuit(X, Y) {
  var imagedata = rawctx.getImageData(0, 0, rawcanvas.width, rawcanvas.height);
  var data = imagedata.data;  
  var i = parseInt(((Y * rawcanvas.width) + X) * 4);
  var r = parseInt(data[i]);        
  var g = parseInt(data[i+1]);
  var b = parseInt(data[i+2]);
  $('#r').val(r);
  $('#g').val(g);
  $('#b').val(b);
  $('#rn').val(r);
  $('#gn').val(g);
  $('#bn').val(b);
  var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
  $('#color').css('background-color', color);
  setcanvas(r, g, b, t, false);
}
