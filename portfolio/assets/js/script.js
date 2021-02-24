$(function () {
  var wow = new WOW(
    {
      boxClass:     'wow', 
      animateClass: 'animate__animated',
      offset:       0,         
      mobile:       false,      
      live:         true,       
      callback:     function(box) {
      },
      scrollContainer: null
    }
  );
  wow.init();

  feather.replace();

  $('[data-toggle="tooltip"]').tooltip();

  if (location.hash) {
    var target = window.location.hash,
    target = target.replace('#', '');
    window.location.hash = "";
  }

  $(window).bind('scroll', function() {
    if ($(window).scrollTop() > 1) {
      $('.navbar').fadeIn(500).addClass('sticky-top');
    }else {
      $('.navbar').removeClass('sticky-top');
    }
  });

  $('[data-animation="ripple"]').each(function () {
    if($(this).hasClass('dark')) {
      $(this).prepend('<div class="c-ripple js-ripple dark"></div>');
    } else {
      $(this).prepend('<div class="c-ripple js-ripple"></div>');
    }
  });

  var $ripple = $('.js-ripple');
  var $todel;

  $ripple.on('mousedown', function(e) {
    var $this = $(this);
    var $offset = $this.parent().offset();
    $this.append('<span class="c-ripple__circle"></span>');
    var $circle = $this.find('.c-ripple__circle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
      top: y + 'px',
      left: x + 'px'
    });

    $this.addClass('is-active');
    $todel = $circle;
  });

  $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(e) {
    var $this = $(this);
    if($this.children().length > 10) {
      $this.children().first().remove();
    }
  });
})
