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
	var url = "http://54.92.123.84/search?q=Title:%E3%81%8B%E3%81%97%E3%81%93%E3%81%84%E3%81%8A%E3%81%8B%E3%81%9A%20AND%20Body:@tango@&ackey=688df3cc39cff9e0f8ba74c3fe48c7bca8f6f19d";
	var aqua = "アクア";

	//MEMO:検索する料理が指定されなければ、アクアで検索する(アクアパッツアがとれる）
	if(!foodName){
		foodName = aqua;
	}

	//TODO:かしこいおかずからXMLを取得する
	$.ajax({
    url: “http://www.omnioo.com/ajax_xml/info.xml”,
    async: true,
    cache: false,
    dataType:”xml”,
    error: function(){
        alert(‘Error loading XML document’);
    },
    success: function(xml){
        //ここでパースする
    }
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
