var thebook = {};

// get the file list of book images
$.get('/img/', function(data){
   var output = '';
   var length = $(data).find('Contents').length;
  
   thebook.pages = new Array();  
   $(data).find('Contents').each(function(index){
     
     var imgUrl = $(this).find('Key').text(), classes = '';
     
     // create the page
     if(imgUrl.indexOf('.jpg') != -1) {
       
       // set the page position
       if(index == 1)
         classes = 'outside outside-front active';
       else if(index == length-1) 
         classes = 'outside outside-back';
       else if(index % 2 == 0)
         classes = 'inside inside-left';
       else if(index % 2 == 1)
         classes = 'inside inside-right';       
       
       // page output
       output += '<li class="'+classes+' on-right" style="z-index:'+(length-index)+'; background-image: url(\'https://s3.amazonaws.com/static.samaritanspurse.org/'+imgUrl+'\');"><div></div></li>';
       
     }
     
   });
  
  $('#tgj-book').append('<ul>'+output+'</ul>');
  
  $('#tgj-book').append('<div class="text-center controls"><a href="#" class="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a href="#" class="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div>');
  
  setupBookControls();
  // load touch controls after the images
 //$.getScript('//s3.amazonaws.com/static.samaritanspurse.org/occ/js/jquery.hammer.min.js?ver=3.8', setupHammer);
  
});

// setup book controls

function setupBookControls() {
  $('.controls .prev, .controls .next').click(function(e){ 

    // immediately stop animation if user clicks before animation ends
    $('#tgj-book li').stop(true,true);

    // get the active pages
    var activePages = $('#tgj-book li.active'), 
        activePage, nextPages, nextPageType;

    var turnDelay = 900;

    // next
    if($(this).is('.next')) {
      activePage = activePages.last();
      nextPages = activePage.nextAll('*:lt(2)');

    // if there are next pages set them active
    if(nextPages.length) {

      var pageWidth = activePages.last().width();

      // animate the next page over
      nextPages.first()
      .addClass('turning turning-over')
      .css({
        width: 0,
        right: 0,
        left: 'auto'
      }).animate({
        right: pageWidth+'px', 
        width: pageWidth
      }, turnDelay, function(){

        activePages
          .removeClass('active on-right')
          .addClass('on-left');

        nextPages
          .addClass('active')
          .first()
            .addClass('on-left')
            .removeClass('on-right')
            .css({zIndex: 0});


        $(this)
          .removeClass('turning turning-over')
          .css({left:'', right:'', width: ''});
      });

      // animate the previous page under
      activePages.last()
      .addClass('turning turning-under')
      .animate({
        right: pageWidth+'px',
        width: 0
      }, turnDelay, function(){
        $(this)
          .removeClass('turning turning-under')
          .css({left:'', right:'', width: ''});
      });

    }    

    // prev
    } else {
      activePage = activePages.first();
      nextPages = activePage.prevAll('*:lt(2)');

    // if there are next pages set them active
    if(nextPages.length) {

      var pageWidth = activePages.last().width();

      console.log(nextPages, activePages);

       nextPages
          .addClass('active');

      // animate the next page over
      nextPages.first()
      .addClass('turning turning-under')
      .css({
        width: 0,
        left: 'auto',
        right: pageWidth+'px'
      }).animate({
        right: 0, 
        width: pageWidth
      }, turnDelay, function(){

        activePages
          .removeClass('active on-left')
          .addClass('on-right');

        nextPages
          .addClass('active')
          .first()
            .addClass('on-right')
            .removeClass('on-left')
            .css({zIndex: nextPages.first().index()+1});
        $(this)
          .removeClass('turning turning-under')
          .css({left:'', right:'', width: ''});
      });

      // animate the previous page under
      activePages.first()
      .addClass('turning turning-over')
      .css({
        left: 'auto',
        right: pageWidth+'px'
      }).animate({
        right: 0,
        width: 0
      }, turnDelay, function(){
        $(this)
          .removeClass('turning turning-over')
          .css({left:'', right:'', width: ''});
      });

    }

    }

    e.preventDefault();
  });
}