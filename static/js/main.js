$(function() {
    $('a#bug-button').bind('click', function() {
      $.getJSON('/bugs',
          function(data) {
              $.each(data, function(k, v) {
                  console.log(k, v)
              })
      });
      return false;
    });
  });