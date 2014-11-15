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
