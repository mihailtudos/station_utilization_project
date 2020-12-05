document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.carousel').carousel();
  });

function getArSite(){
    let url_string = window.location;
    let url = new URL(url_string);
    let id = url.searchParams.get("ar_location");
    return id;
} 
