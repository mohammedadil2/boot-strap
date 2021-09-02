jQuery.fn.extend(
{
  scrollTo : function(speed, easing)
  {
    return this.each(function()
    {
      var targetOffset = $(this).offset().top;
      $('html,body').animate({scrollTop: targetOffset}, speed, easing);
    });
  }
});
