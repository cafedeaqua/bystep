
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

//画面遷移をカウント(0: タイトル　1:材料　2以降の偶数:動画　3以降の奇:Recipe)
var sceneCounter = 0;

/**
 * Recipeが取得できたときのCallback
 */
function getRecipeCallback(){
  
  //MEMO:タイトルを表示
  $("ingredient-title").attr("アクアパッツア");
  
  //MEMO:料理追加
  
  
  //MEMOタイトル画面に遷移
  changeNameContent();
  
}

/**
 * ロード完了時実行
 */
$(document).ready(function(){
  
  //MEMO:recipe取得
  getKashikoiOkazu();
   
});

/**
 * 画面を状況に応じて切り替える
 * @param {boolean} flg true:縦振り　false:横振り
 */
function moveContent(flg){
  
  //MEMO:不具合対策
  if(sceneCounter > 0)
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
  
  
  return true;
  
}

/**
 * 動画画面に遷移する
 */
function changeMovieContent(){
	changeContent("movie-wrapper");
}

/**
 * レシピ画面に遷移する
 */
function changeArticleContent(){
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
 * 次のRecipeを表示する
 */
function nextArticle(){
  
  
  
  
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
