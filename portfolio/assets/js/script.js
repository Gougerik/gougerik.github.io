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

  $('[data-animation="ripple-outline"]').each(function () {
    $(this).prepend('<div class="c-ripple js-ripple ripple-outline-text"></div>');
  });

  var ripple = $('.c-ripple');

  ripple.on('mousedown', function(e) {
    var $this = $(this);
    var offset = $this.parent().offset();
    $this.append('<span class="c-ripple__circle"></span>');
    var circle = $this.find('.c-ripple__circle');

    var x = e.pageX - offset.left;

    circle.css({
      left: x + 'px',
      width: $this.width()/2 + 'px',
      height: $this.width()/1.2 + 'px'
    });

    $this.addClass('is-active');
  });

  ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(e) {
    var $this = $(this);
    if($this.children().length > 10) {
      $this.children().first().remove();
    }
  });

  $('.smooth-scroll').click(function(){    
    divId = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(divId).offset().top - 54
    }, 100);
  });
})
