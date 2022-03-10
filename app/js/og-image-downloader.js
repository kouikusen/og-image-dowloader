const request = require("request");
const cheerio = require("cheerio");
const lines = [];
const urlList = [];

var c = 1;

const toggleTrendImage = function () {
  var trendImage = document.getElementById("trend-image-section");
  if (trendImage.style.display === "none") {
    trendImage.style.display = "flex";
  } else {
    trendImage.style.display = "none";
  }
};

const togglePrImagesList = function () {
  var trendImage = document.getElementById("pr-images-list");
  if (trendImage.style.display === "none") {
    trendImage.style.display = "block";
  } else {
    trendImage.style.display = "none";
  }
};

// ヘッダー画像を作成
const headerImage = function () {
  // 選択されたタイプを取得
  var types = document.getElementsByName("header-image-type");
  var type_value;
  for (var i = 0; i < types.length; i++) {
    if (types[i].checked) {
      type_value = types[i].value;
    }
  }

  // ヘッダー画像のサイズを設定
  let width, height;
  if (type_value === "bythem") {
    width = 600;
    height = 355;
  } else if (type_value === "business") {
    width = 600;
    height = 322;
  } else if (type_value === "trend") {
    width = 600;
    height = 324;
  } else if (type_value === "tripeditor") {
    width = 600;
    height = 463;
  } else if (type_value === "editor") {
    width = 600;
    height = 400;
  }

  readUrl("header", width, height, type_value);
};

const makeTrendImage = function (number) {
  let canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var title = document.getElementById("trend-" + number + "-title").value;
  var name = document.getElementById("trend-" + number + "-name").value;
  var url = document.getElementById("trend-" + number + "-url").value;
  var canvasId = "trend-" + number + "-canvas.jpg";
  var imagesZone = document.getElementById("trend-" + number + "-images");
  console.log(title, name, url);

  canvas_width = 570;

  canvas.width = canvas_width;
  canvas.height = 306;
  canvas.id = canvasId;

  //ヘッダーを定義
  var headers = {
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
  };

  //オプションを定義
  var options = {
    url: url,
    method: "GET",
    headers: headers,
  };

  //リクエスト送信
  request(options, function (error, response, body) {
    //コールバックで色々な処理
    if (error || !body) {
      return;
    }

    const $ = cheerio.load(body);

    // set ogp image url
    if ($("meta[property='og:image']").attr("content")) {
      var imgurl2 = $("meta[property='og:image']").attr("content");
    }

    // set on page
    if (imgurl2) {
      var img = new Image();
      img.onload = function (e) {
        ctx.drawImage(img, 0, 0);

        var img2 = new Image();
        img2.onload = function (e) {
          ctx.drawImage(img2, 0, 96);
          //--- set title
          ctx.font = "bold 23px 'Noto Sans JP',Sans-serif";
          ctx.fillStyle = "rgba(256, 256, 256)";
          ctx.textBaseline = "hanging";
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 4;

          //入力文字を1文字毎に配列化
          var aryText = title.split("");
          //出力用の配列を用意
          var aryRow = [];
          aryRow[0] = "";
          var row_cnt = 0;
          var row_string_cnt = 21;

          //横幅と1行あたりの文字数から、文字サイズを算出
          var font_size = Math.round(canvas_width / row_string_cnt);

          //入力1文字毎にループ　改行コードもしくは折り返しで配列の添え字を足す
          for (var i = 0; i < aryText.length; i++) {
            var text = aryText[i];
            if (aryRow[row_cnt].length >= row_string_cnt) {
              row_cnt++;
              aryRow[row_cnt] = "";
            }
            if (text == "\n") {
              row_cnt++;
              aryRow[row_cnt] = "";
              text = "";
            }
            aryRow[row_cnt] += text;
          }

          //文字の表示　y軸とx軸をループする
          let aryStr = [];
          for (var i = 0; i < aryRow.length; i++) {
            aryStr = aryRow[i].split("");
            for (var j = 0; j < aryStr.length; j++) {
              ctx.fillText(aryStr[j], j * font_size + 3, i * font_size + 220);
              console.log(aryStr[j]);
            }
          }

          //--- set name
          ctx.font = "13px 'Noto Sans JP',Sans-serif";
          //入力文字を1文字毎に配列化
          var aryText2 = name.split("");
          //出力用の配列を用意
          var aryRow2 = [];
          aryRow2[0] = "";
          row_cnt = 0;
          row_string_cnt = 40;

          //横幅と1行あたりの文字数から、文字サイズを算出
          font_size = Math.round(canvas_width / row_string_cnt);

          //入力1文字毎にループ　改行コードもしくは折り返しで配列の添え字を足す
          for (var i = 0; i < aryText2.length; i++) {
            var text2 = aryText2[i];
            if (aryRow2[row_cnt].length >= row_string_cnt) {
              row_cnt++;
              aryRow2[row_cnt] = "";
            }
            if (text2 == "\n") {
              row_cnt++;
              aryRow2[row_cnt] = "";
              text2 = "";
            }
            aryRow2[row_cnt] += text2;
          }

          //文字の表示　y軸とx軸をループする
          aryStr = [];
          for (var i = 0; i < aryRow2.length; i++) {
            aryStr = aryRow2[i].split("");
            for (var j = 0; j < aryStr.length; j++) {
              ctx.fillText(aryStr[j], j * font_size + 3, i * font_size + 275);
              console.log(aryStr[j]);
            }
          }
        };
        img2.src = "./img/trend-black-bg.png";

        // ページにCanvasとファイルネーム表示
        imagesZone.innerHTML = "";
        imagesZone.append(canvas);
      };
      img.src = imgurl2;
    }
  });
};

// 原稿URLリストを取得、処理
const readUrl = function (type, width, height, headerType) {
  // get url list from textarea
  let list = document.getElementById(type + "-url-list");
  let arrayOfLines = list.value.split("\n");

  // get strings with 'http' value
  var filtered = arrayOfLines.filter(function (value, index, arr) {
    return value.indexOf("http") > -1;
  });

  // print filtered url list
  let resultList = "";
  filtered.forEach(function (value, index, arr) {
    if (type === "content") {
      getOGImages(value, index, type, 350, 188);
    } else {
      getOGImages(value, index, type, width, height, headerType);
    }

    resultList += index + 1 + "<br>";
    resultList += value + "<br><br>";

    if (value === "http") {
      document.getElementById("PR-list").innerHTML += index + 1 + ", ";
    }
  });
  document.getElementById(type + "-result").innerHTML = resultList;
};

// OGP画像を取得、処理
const getOGImages = function (url, a, type, canvasW, canvasH, headerType) {
  //ヘッダーを定義
  var headers = {
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
  };

  //オプションを定義
  var options = {
    url: url,
    method: "GET",
    headers: headers,
  };

  //リクエスト送信
  request(options, function (error, response, body) {
    //コールバックで色々な処理
    if (error || !body) {
      return;
    }

    const $ = cheerio.load(body);

    // set ogp image url
    if ($("meta[property='og:image']").attr("content")) {
      var imgurl2 = $("meta[property='og:image']").attr("content");
    }

    // set on page
    if (imgurl2) {
      console.log("download: " + (a + 1) + ".jpg\nfrom: " + imgurl2);

      a++;
      if (type === "header") {
        var filename = "header.jpg";
      } else if (a < 10) {
        var filename = "0" + a + ".jpg";
      } else {
        var filename = "" + a + ".jpg";
      }

      // define og image URL
      var url = imgurl2;
      const THUMBNAIL_WIDTH = canvasW; // 画像リサイズ後の横の長さ
      const THUMBNAIL_HEIGHT = canvasH; // 画像リサイズ後の縦の長さ
      var img = new Image();
      img.onload = function (e) {
        var width, height;
        if (THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT > img.width / img.height) {
          // 横長の画像は横のサイズを指定値にあわせる
          var ratio = img.height / img.width;
          width = THUMBNAIL_WIDTH;
          height = THUMBNAIL_WIDTH * ratio;
        } else {
          // 縦長の画像は縦のサイズを指定値にあわせる
          var ratio = img.width / img.height;
          width = THUMBNAIL_HEIGHT * ratio;
          height = THUMBNAIL_HEIGHT;
        }

        if (width > this.maxWidth) {
          height = Math.round((height * this.maxWidth) / width);
          width = this.maxWidth;
        }

        let canvasId = filename;
        let canvas = document.createElement("canvas");
        canvas.width = THUMBNAIL_WIDTH;
        canvas.height = THUMBNAIL_HEIGHT;
        canvas.id = canvasId;

        var ctx = canvas.getContext("2d");
        // 白背景にする、画像を貼り付ける
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 350, 188);
        ctx.drawImage(img, 0, 0, width, height);
        console.log(img.width, img.height);

        // ページにCanvasとファイルネーム表示
        let imagesZone = document.getElementById(type + "-images");
        let p = document.createElement("p");
        p.innerHTML = "<br>" + filename;
        imagesZone.append(p);
        imagesZone.append(canvas);

        if (headerType) {
          // ヘッダー画像タイトル入れ
          headerImageProcess(headerType, canvas);

          // tripeditor sp ヘッダー作成
          if (headerType === "tripeditor") {
            let canvas2 = document.createElement("canvas");
            var ctx2 = canvas2.getContext("2d");
            canvas2.id = "header_sp.jpg";

            canvas2.width = 480;
            canvas2.height = 463;

            ctx2.drawImage(img, 0, 0, width, height);
            headerImageProcess(headerType, canvas2);
            let p2 = document.createElement("p");
            p2.innerHTML = "<br>header_sp.jpg";
            imagesZone.append(p2);
            imagesZone.append(canvas2);
          }
        }
      };
      img.src = url;
      // request(imgurl2).pipe(fs.createWriteStream(filename));
      c++;
    }
  });
};

// ヘッダー画像タイトル入れ
const headerImageProcess = function (headerType, canvas) {
  var ctx = canvas.getContext("2d");

  if (headerType === "business") {
    var img = new Image();
    img.onload = function (e) {
      ctx.drawImage(img, -85, 277);
    };
    img.src = "./img/business.png";
  } else if (headerType === "tripeditor") {
    var img = new Image();
    img.onload = function (e) {
      ctx.drawImage(img, 10, 14);
    };
    img.src = "./img/tripeditor.png";
  } else if (headerType === "editor") {
    var img = new Image();
    img.onload = function (e) {
      ctx.drawImage(img, 0, 0);
    };
    img.src = "./img/editor.png";
  } else {
    return;
  }
};

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log("... file[" + i + "].name = " + file.name);
        console.log(file);

        // 選択されたタイプを取得
        var types = document.getElementsByName("header-image-type");
        var type_value;
        for (var i = 0; i < types.length; i++) {
          if (types[i].checked) {
            type_value = types[i].value;
          }
        }

        makeSmall(file, file.name, type_value);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(
        "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
      );
    }
  }
}

function dragOverHandler(ev) {
  // console.log("File(s) in drop zone");
  document.getElementById("drop_zone").style.backgroundColor = "#e0e0e0";

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

// 画像リサイズfunction(ローカルから処理の場合)
function makeSmall(file, fileName, type_value) {
  // ヘッダー画像のサイズを設定
  let width, height;
  if (type_value === "bythem") {
    width = 600;
    height = 355;
  } else if (type_value === "business") {
    width = 600;
    height = 322;
  } else if (type_value === "trend") {
    width = 600;
    height = 324;
  } else if (type_value === "tripeditor") {
    width = 600;
    height = 463;
  } else if (type_value === "editor") {
    width = 600;
    height = 400;
  }else if (type_value === "regular_resize") {
      width = 350;
        height = 188;
  }

  const THUMBNAIL_WIDTH = width; // 画像リサイズ後の横の長さ
  const THUMBNAIL_HEIGHT = height; // 画像リサイズ後の縦の長さ

  if(type_value !== "regular_resize"){
    fileName = "header.jpg";
  }
  let canvasId = fileName;

  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    let img = new Image();
    img.onload = () => {
      var width, height;
      if (THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT > img.width / img.height) {
        // 横長の画像は横のサイズを指定値にあわせる
        var ratio = img.height / img.width;
        width = THUMBNAIL_WIDTH;
        height = THUMBNAIL_WIDTH * ratio;
      } else {
        // 縦長の画像は縦のサイズを指定値にあわせる
        var ratio = img.width / img.height;
        width = THUMBNAIL_HEIGHT * ratio;
        height = THUMBNAIL_HEIGHT;
      }

      if (width > this.maxWidth) {
        height = Math.round((height * this.maxWidth) / width);
        width = this.maxWidth;
      }

      let canvas = document.createElement("canvas");
      canvas.width = THUMBNAIL_WIDTH;
      canvas.height = THUMBNAIL_HEIGHT;
      canvas.id = canvasId;
      let ctx = canvas.getContext("2d");

      // 白背景にする
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 350, 188);

      headerImageProcess(type_value, canvas);

      // 画像を貼り付ける
      ctx.drawImage(img, 0, 0, width, height);

      // ページにCanvasとファイルネーム表示
      let imagesZone = document.getElementById("images_zone");
      let p = document.createElement("p");
      p.innerHTML = "<br><br>" + fileName;
      imagesZone.append(p);
      imagesZone.append(canvas);

      // tripeditor sp ヘッダー作成
      if (type_value === "tripeditor") {
        let canvas2 = document.createElement("canvas");
        var ctx2 = canvas2.getContext("2d");
        canvas2.id = "header_sp.jpg";

        canvas2.width = 480;
        canvas2.height = 463;

        ctx2.drawImage(img, 0, 0, width, height);
        headerImageProcess(type_value, canvas2);
        let p2 = document.createElement("p");
        p2.innerHTML = "<br>header_sp.jpg";
        imagesZone.append(p2);
        imagesZone.append(canvas2);
      }
    };
    img.src = e.target.result;
  };
}

// 画像ダウンロードFUNCTION
const downloadImages = function () {
  var zip = new JSZip();
  var count = 0;
  var zipFilename = "Pictures.zip";
  var allCanvas = document.getElementsByTagName("canvas");
  var links = [];

  // 全てのcanvasを取得
  Object.keys(allCanvas).forEach(function (key) {
    let link = document.createElement("a");
    link.href = this[key].toDataURL("image/jpg");
    console.log(link.href);
    links.push(link.href);
  }, allCanvas);

  // 全てのcanvasをzipに追加
  links.forEach(function (url, i) {
    var filename = allCanvas[i].id;
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        throw err; // or handle the error
      }
      zip.file(filename, data, { binary: true });
      count++;
      if (count == links.length) {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, zipFilename);
        });
      }
    });
  });
};

// 画像削除
const clearAllCanvas = function () {
    document.getElementById("images_zone").innerHTML = "";
    document.getElementById("header-images").innerHTML = "";
    document.getElementById("content-images").innerHTML = "";
}
