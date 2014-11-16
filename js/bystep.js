
//MEMO:recipeDataを全部格納
var recipeObj ={
  
  //MEMO:recipe全部
  allRecipeObj : null,
  
  //MEMO:recipeのBodyのObj
  allRecipeBody: null,
  
  //MEMO:材料のObj
  materialObj: null,
  
  //MEMO:調理方法Obj
  articleObj: null,
  
};

//MEMO:動画を保存
var movieObj = {
  0:"./media/001.mp4",
  1:"./media/002.mp4",
  2:"./media/003.mp4",
  3:"./media/004.mp4",
  4:"./media/005.mp4",
  5:"./media/006.mp4",
};


//画面遷移をカウント(0: タイトル　1:材料　2以降の偶数:動画　3以降の奇:Recipe)
var sceneCounter = 0;

/**
 * Recipeが取得できたときのCallback
 */
function getRecipeCallback(){
  
  //MEMO:タイトルを表示
  $("ingredient-title").attr("アクアパッツア");
  
  //MEMO:材料画面を追加
  setIngredient();
  
  //MEMOタイトル画面に遷移
  changeNameContent();
  
}
 
/**
 * ロード完了時実行
 */
$(document).ready(function(){
  
  //MEMO:recipe取得
  getKashikoiOkazu();
  
  //MEMO:戻るボタン押下
  $(".no_img").click(function(){
    moveContent(false);
  });

  //MEMO:進むボタン押下
  $(".yes_img").click(function(){
    moveContent(true);
  });
  
});

/**
 * 画面を状況に応じて切り替える
 * @param {boolean} flg true:縦振り　false:横振り
 */
function moveContent(flg){
  
  //MEMO:不具合対策
  if(sceneCounter <= 0 && !flg)
    return false;
  
  if(flg){
    
    //MEMO:縦振り
    sceneCounter++;
    
  }else{
    
    //MEMO:横降り
    sceneCounter--;
    
  }
  
  //sceneCounterにあわして画面表示を変更する
  if(sceneCounter === 0){

    //MEMO:タイトル画面
    console.log("タイトル画面");
    changeNameContent();
    
  }else if(sceneCounter === 1){
    
    //MEMO:材料画面
    console.log("材料画面");
    changeIngredientContent();
    
  }else{
    
    if(sceneCounter % 2 === 0){
      console.log("動画画面　:　" + sceneCounter);
      changeMovieContent();

    }else if(sceneCounter % 2 === 1){
      console.log("レシピ画面 : " + sceneCounter);
      changeArticleContent();
      
    }
    
  }
  
  //MEMO:フッターのCounterを調節
  setFooter();
  
  return true;
  
}

/**
 * 動画画面に遷移する
 */
function changeMovieContent(){
  //MEMO:動画を設定
  setMovie();
  changeContent("movie-wrapper");
}

/**
 * レシピ画面に遷移する
 */
function changeArticleContent(){
  //MEMO:現在のレシピを表示
  setArticle();
  changeContent("article-wrapper");
}

/**
 * 材料画面に遷移する
 */
function changeIngredientContent(){
	changeContent("ingredient-wrapper");
}

/**
 * 料理名画面に遷移する
 */
function changeNameContent(){
	changeContent("name-wrapper");
}

/**
 * 表示しているcontentを切り替える
 *
 * @param {string} displayId 画面表示するIDを示す
 * @return {boolean} true:正常に終了　false:引数などに異常があり終了
 * @example れい
 *   changeContents("name-wrapper")
 */
function changeContent(displayId){

    //MEMO:NULLチェックとか存在を確認したりとか
    if(!displayId) return false;
    if(!$("#" + displayId))return false;

    //MEMO:全contebt非表示 //MEMO:ちらつきが不安...
    $(".content-wrapper").each(function(){
        $(this).css("display","none");
    });

    //MEMO:指定のcontentだけ表示
    $("#" + displayId).css("display","block");

    return true;

}

/**
 * かしこいおかず
 */
function getKashikoiOkazu(foodName){

  //MEMO:かしこいおかずから検索する
  var asahi_url = "http://54.92.123.84/search?q=Title:%E3%81%8B%E3%81%97%E3%81%93%E3%81%84%E3%81%8A%E3%81%8B%E3%81%9A%20AND%20Body:@tango@&ackey=688df3cc39cff9e0f8ba74c3fe48c7bca8f6f19d";
  var aqua = "アクア";

  //MEMO:検索する料理が指定されなければ、アクアで検索する(アクアパッツアがとれる）
  if(!foodName){
    foodName = aqua;
  }

  //MEMOe:かしこいおかずからXMLを取得する
  $.ajax({
    //url: asahi_url.replace("@tango@", foodName),
    url:"http://54.92.123.84/search?q=Title:%E3%81%8B%E3%81%97%E3%81%93%E3%81%84%E3%81%8A%E3%81%8B%E3%81%9A%20AND%20Body:%E3%82%A2%E3%82%AF%E3%82%A2&ackey=688df3cc39cff9e0f8ba74c3fe48c7bca8f6f19d",
    async: true,
    type:"GET",
    dataType: "xml",
    error: function(){
      //MEMO:もしエラーであれば、既存のJSONを使う
      console.log("PUBLIC XML error");
      
      var private_url ="/aqua.json";
      $.ajax({
	url:private_url,
	async: true,
	type:"GET",
	dataType: "xml",
	error:function(){
	  //MEMO:エラー時は再度getKashikoiOkazuを呼び出す //TODO:テスト
	  setTimeout("getKashikoiOkazu()",0);
	},
	success:function(xml){
	  console.log("PRIVATE XML");
	  purseRecipeData(xml);
	}
      });
     },
    success: function(xml){
      console.log("PUBLIC XML");
      purseRecipeData(xml);
    }
  });

}

/**
 * (朝日新聞)Dataをpurseる
 */
function purseRecipeData(xml){
  console.log("success");

  //MEMO:recipeの内容をpurseする
  $(xml).find("response").find("result").find("doc").each(function(i){
    
    //MEMO:全Dataを保持する。(Objの方は■で区切った配列(項目別))
    recipeObj.allRecipeBody = $(this).find("Body").text();
    recipeObj.allRecipeBody = recipeObj.allRecipeBody.replace("　【作り方】","■作り方");
    recipeObj.allRecipeBody = recipeObj.allRecipeBody.replace("　【材料】","■材料");
    recipeObj.allRecipeObj = recipeObj.allRecipeBody.split("■");
    
    //MEMO:
    var i = 0;
    while(recipeObj.allRecipeObj[i++]){
      if(recipeObj.allRecipeObj[i]){
	console.log(recipeObj.allRecipeObj[i]);
	
	//MEMO:各要素をObjに含ませる
	if(recipeObj.allRecipeObj[i].indexOf("材料") === 0){
	  
	  //MEMO:材料を格納)材料であれば、改行コードを<br/>に置換する.
	  recipeObj.materialObj = recipeObj.allRecipeObj[i].replace(/[\n\r]/g,",");
	  recipeObj.materialObj = recipeObj.materialObj.replace(/…/g,",");
	  recipeObj.materialObj = recipeObj.materialObj.replace(/,,/g,",");
	  recipeObj.materialObj = recipeObj.materialObj.split(",");
	  var a = ["", "123", "abc", "xyz", "", "987", "hoge", "", "fuga", 0, undefined, false];
	  recipeObj.materialObj = $.grep(recipeObj.materialObj, function(e){return e;});
	  

	}else if(recipeObj.allRecipeObj[i].indexOf("作り方") === 0){
	  
	  //MEMO:作り方を格納（作り方()であれば、「(x)」で切り分ける）
	  recipeObj.articleObj = recipeObj.allRecipeObj[i];
	  recipeObj.articleObj = recipeObj.articleObj.replace("（１）","(あ)");
	  recipeObj.articleObj = recipeObj.articleObj.replace("（２）","(あ)");
	  recipeObj.articleObj = recipeObj.articleObj.replace("（３）","(あ)");
	  recipeObj.articleObj = recipeObj.articleObj.replace("（４）","(あ)");
	  recipeObj.articleObj = recipeObj.articleObj.replace("（５）","(あ)");
	  recipeObj.articleObj = recipeObj.articleObj.split("(あ)");
	  
	}
	
      }
      
    }

  });
  
  //MEMO:処理完了時コール
  getRecipeCallback();
  
}

/**
 * 指定のRecipeを表示する
 */
function setArticle(){
  
  var artileNum;
  if(sceneCounter > 1){
    artileNum = Math.floor(sceneCounter / 2);
  }else{
    artileNum = 0;
  }
  
  if(recipeObj.articleObj[artileNum]){
    
    //MEMO:タイトルを設定
    $("#article-title").remove();
    var titleDiv = "<div class='content-title' id='article-title'>";
    titleDiv += "ステップ" + artileNum;
    titleDiv += "</div>";
    $("#article-wrapper").append(titleDiv);
    
    //MEMO:調理方法を設定
    $("#article-detail").remove();
    var articleDiv = "<div class='content-detail' id='article-detail'>";
    articleDiv += recipeObj.articleObj[artileNum];
    articleDiv += "</div>";
    $("#article-wrapper").append(articleDiv);
    
  }else{
    
    //MEMO:タイトルを設定
    $("#article-title").remove();
    var titleDiv = "<div class='content-title' id='article-title'>";
    titleDiv += "調理終了";
    titleDiv += "</div>";
    $("#article-wrapper").append(titleDiv);
    
    $("#article-detail").remove();
    var articleDiv = "<div class='content-detail' id='article-detail'>";
    articleDiv += "";
    articleDiv += "</div>";
    $("#article-wrapper").append(articleDiv);
    
  }

  console.log(recipeObj.articleObj);
  console.log("artileNum -> " + artileNum);
  console.log(recipeObj.articleObj[artileNum]);

}

/**
 * 材料画面を設定
 */
function setIngredient(){
  
  //MEMO:要素を削除
  $(".ingredient-row").remove();
  
  //MEMO:材料を追加
  for(var i = 1; i < recipeObj.materialObj.length; i++){
    var ingredient;
    ingredient = "<div class='ingredient-row'>";
    ingredient += "<div class='material'>";
    ingredient += recipeObj.materialObj[i];
    ingredient += "</div>";
    ingredient += "<div class='amount'>";
    ingredient += recipeObj.materialObj[i+1];
    ingredient += "</div>";
  
    $("#ingredient-detail").append(ingredient);
    
    i++;
    
  }
   
}

/**
 * 動画画面を設定
 */
function setMovie(){
  
  var movieNum;
  if(sceneCounter > 1){
    movieNum = Math.ceil(sceneCounter / 2);
  }else{
    movieNum = 0;
  }
  
  console.log("setMovie : " + movieNum);
  console.log("動画のURL " +  movieObj[movieNum - 1]);
  
  //MEMO:
  if(movieObj[movieNum - 1]){
    $("#movie-video").remove();
    var videoTag = "<video id='movie-video' controls autoplay style='margin-top:50px' poster='' width='720' height='405' onclick='this.play();'>";
    videoTag += "<source src=" + movieObj[movieNum - 1] + ">";
    videoTag += "</video>";
    $("#movie-detail").append(videoTag);
    var video = document.getElementById('movie-video');
    video.play();
    
  }else{
    //MEMO:調理終了時なので、調理方法画面に行く
    console.log("調理終了なので調理方法画面に遷移");
    changeArticleContent();
    
  }
  
}

/**
 * totalPageを更新
 */
function setFooter(){
  var endNum = 12;
  
  $("#page").remove();
  
  if(endNum > sceneCounter){
    var totalPage = "<span id='page'><span id='currentPage'><strong>" + sceneCounter + "</strong></span><small>/<small>";
    totalPage += "<span id='totalPage'><small>" + endNum +  "</small></span></span>";
    $("#footer_inner").append(totalPage);
    
  }else{
    var totalPage = "<span id='page'>";
    totalPage += "<span id='totalPage'><small>END</small></span></span>";
    $("#footer_inner").append(totalPage);
    
  }
  
}

//-----------
//TEST
//-----------
/**
 * 画面遷移をテスト
 */
function testContent(){
	console.log("test 01 :" + changeContent(""));
	console.log("test 02 :" + changeContent("name-wrapper"));

}
