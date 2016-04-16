//= require vendor/switchery

$(function(){
  $(".js-switch").each(function(_, el) {
    new Switchery(el, { color: "#42996D", secondaryColor: "#F0F0F0" }); // TODO use $green SCSS variable
  });
});
