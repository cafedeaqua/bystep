$(function(){
  var lastBeta = null;
  var gotTime = null;
  var gestureTime = new Date();
  var lastAlpha = null;

  window.addEventListener("devicemotion",function(evt){
    var x = evt.accelerationIncludingGravity.x; //横方向の傾斜
    var y = evt.accelerationIncludingGravity.y; //縦方法の傾斜
    var z = evt.accelerationIncludingGravity.z; //上下方向の傾斜
    //$("#result").html("x:"+x+"<br>y:"+y+"<br>z:"+z+"<br>lastBeta:"+lastBeta);
  },false);
  window.addEventListener('deviceorientation', function(event2) {
    var alpha = event2.alpha;
    var beta = event2.beta;
    var gamma = event2.gamma;

    orientationResult = 
      "alpha："+ alpha +"<br>" +
      "beta："+ beta +"<br>" + 
      "gamma："+ gamma;
    //$("#result2").html(orientationResult);

    // うなずきを検知する雑多な条件分岐
    if(
      (null !== lastBeta)
      && (lastBeta < beta - 15)
      && (gestureTime < new Date() - 1500)
    ){
      //alert("うなずき！<br>前回:"+lastBeta+"<br>今回:"+beta);
      lastBeta = null;
      gestureTime = new Date;
      changeArticleContent;
    }
    // 横振りを検知する雑多な条件分岐
    if(
      (null !== lastAlpha)
      && (lastAlpha < alpha - 25)
      && (gestureTime < new Date() - 1500)
    ){
      //alert("横振り！<br>前回:"+lastAlpha+"<br>今回:"+beta);
      lastAlpha = null;
      gestureTime = new Date;
      changeArticleContent;
    }
    // それぞれのジャイロを記録していく
    if((null === gotTime || null === lastBeta) || (gotTime < new Date - 200)){
      lastBeta = beta;
      lastAlpha = beta;
      gotTime = new Date();
    }

  }, true);
});