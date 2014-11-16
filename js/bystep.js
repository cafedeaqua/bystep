/**
 * 画面を状況に応じて切り替える
 */
function changeContent(){
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
  console.log($(xml).find("response").find("result"));
  console.log($(xml).find("response").find("result").find("doc"));

  $(xml).find("response").find("result").find("doc").each(function(i){
    console.log($(this).find("Body").text());
    
    
  });
  
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
