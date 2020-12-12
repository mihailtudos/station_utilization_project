document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('.carousel');
   var instances = M.Carousel.init(elems, options);
});
// Or with jQuery

// $(document).ready(function(){
//   $('.carousel').carousel();
// });

function setLocalArId(ar_id) {
  localStorage.removeItem('ar_id');
  localStorage.setItem('ar_id', ar_id);
  document.getElementById('fc-id').textContent = ar_id;
}
//gets the FC ID
function getArSite(){
  // let url_string = window.location;
  // let url = new URL(url_string);
  // let id = url.searchParams.get("ar_id");
  id = localStorage.getItem("ar_id");
  return id;
}

$(".dropdown-trigger").dropdown();
