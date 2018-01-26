var array_data   = [0, 0, 0, 0, 1500, 1500, 1, 1],
    array_graphA = [],
    array_graphB = [];

var vale_A, vale_B, sumA, sumB, RA, RB, EA, EB, K=16;

var radioNodeListA, radioNodeListB;

function radio_rendou(){
  // form要素を取得
  var element = document.getElementById("plus");

  // form要素内のラジオボタングループ(name="battleAとbattleB")を取得
  radioNodeListA = element.battleA;
  radioNodeListB = element.battleB;

  // 選択状態の値(value)を取得しvale_A,Bにそれぞれ代入
  vale_A = radioNodeListA.value;
  vale_B = radioNodeListB.value;

  // 勝負の結果を1 or -1 or 0.5で表す
  if ( vale_A === "winA" ) {
    radioNodeListB[1].checked = true;
    vale_A = 1;
    vale_B = -1;
  } else if (vale_A === "loseA") {
    radioNodeListB[0].checked = true;
    vale_A = -1;
    vale_B = 1;
  } else if (vale_A === "drawA") {
    radioNodeListB[2].checked = true;
    vale_A = 0.5;
    vale_B = 0.5;
  // } else if (vale_B === "winB" ) {
  //   radioNodeListA[1].checked = true;
  // } else if (vale_B === "loseB") {
  //   radioNodeListA[0].checked = true;
  // } else if (vale_B === "drawB") {
  //   radioNodeListA[2].checked = true;
  }
}

function calculation() {
  if (vale_A == undefined || vale_B == undefined) {
    console.log("non");
  } else {

    sumA = array_data[2] + vale_A;
    sumB = array_data[3] + vale_B;

    RA = array_data[4]+32*(sumA - array_data[6]);
    RB = array_data[5]+32*(sumB - array_data[7]);

    EA = 1 / (1+(Math.pow(K,(RB-RA)/400)));
    EB = 1 / (1+(Math.pow(K,(RA-RB)/400)));

    array_data.splice(0, 7, vale_A, vale_B, sumA, sumB, RA, RB, EA, EB);

    array_graphA.push(RA);
    array_graphB.push(RB);
    push();
    graph();
  }
}

function reset() {
  for (var j = 0; j <= 2; j++) {
    eval('radioNodeListA['+ j +'].checked = false;');
    eval('radioNodeListB['+ j +'].checked = false;');
  }
}

var table = document.getElementById('result');

function push() {
  var tr = table.insertRow(-1);

  var td1 = tr.insertCell(-1);
  var td2 = tr.insertCell(-1);
  var td3 = tr.insertCell(-1);
  var td4 = tr.insertCell(-1);
  var td5 = tr.insertCell(-1);
  var td6 = tr.insertCell(-1);
  var td7 = tr.insertCell(-1);
  var td8 = tr.insertCell(-1);

  // 表記用四捨五入
  var dataRA= (Math.round(array_data[4] * 100))/100;
  var dataRB= (Math.round(array_data[5] * 100))/100;
  var dataEA= (Math.round(array_data[6] * 1000))/1000;
  var dataEB= (Math.round(array_data[7] * 1000))/1000;

  td1.innerHTML = array_data[0];
  td2.innerHTML = array_data[1];
  td3.innerHTML = array_data[2];
  td4.innerHTML = array_data[3];
  td5.innerHTML = dataRA;
  td6.innerHTML = dataRB;
  td7.innerHTML = dataEA;
  td8.innerHTML = dataEB;

  // for (var i = 0; i <= 7; i++) {
  //   var tr = table.insertRow(-1);
  //   eval('var td'+i+'= tr.insertCell(-1);');
  //   eval('td'+i+'.innerHTML = array['+i+'];');
  // }
}

//------------------------------------------------------
function graph() {
  // この10個のデータを折れ線グラフにする
  var dataset =[ 2,0,0,0,0,0,0,0,1,1 ];
  // var dataset = array_graphA;
  // console.log(dataset);
  // var dataset =[1500, 1544.508163729992, 1615.4565138112716];


  // 50x50のsvg領域を作る
  var w = 20000;
  var h = 20000;
  var svg = d3.select('#graph')
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // datasetを{x,y}の座標の配列に変換する。
  // X座標は、領域全体を個数で割って全体を使えるようにする。
  // 原点が左上なので、Y座標は最大値から引き算する
  // それぞれ2ずらしているのは、0地点の場合に線が欠けるため。
  var  pathinfo = [];
  var b_x = w / dataset.length;
  for (var i=0; i<dataset.length; i++) {
    pathinfo.push({x:b_x*i+2, y:((h-2) - dataset[i]*10) });
  }

  // 座標データから折れ線グラフ用のコマンドを作るための関数を用意
  var d3line = d3.svg.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;})
    .interpolate("linear"); // エッジがシャープな折れ線を指定。
   // 参考 https://www.dashingd3js.com/svg-paths-and-d3js

  // 実際に線を引く。
  svg.append("path")
    .attr("d", d3line(pathinfo)) // さきほどの関数に座標の配列を引数で渡す
    .style("stroke-width", 2) // 線の太さを決める
    .style("stroke", "steelblue") // 色を決める
    .style("fill", "none");
}