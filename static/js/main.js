$(function() {
    $('a#fish-button').bind('click', function() {
        $.getJSON('/fish',
            function(data) {
                $( "#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    console.log("hi")
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<div/>', {'class': 'critter-icon', 'text': 'icon'}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.price}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.shadow})
                                ])
                            ])    
                        ])
                    ) 
                })
      });
      return false;
    });
  });

  $(function() {
        $('a#bug-button').bind('click', function() {
            $.getJSON('/bugs',
                function(data) {
                        $( "#data-wrapper").empty()
                        var $elem = $(document.getElementById("data-wrapper"))
                        $.each(data, function(k, v) {
                            $elem.append(
                                $('<div/>', {'class': 'critter-wrapper'}).append([
                                    $('<div/>', {'class': 'critter-name', 'text':k}),
                                    $('<div/>', {'class': 'critter-container'}).append([
                                        $('<div/>', {'class': 'critter-icon', 'text': 'icon'}),
                                        $('<div/>', {'class': 'critter-data'}).append([
                                                $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                                $('<div/>', {'class': 'critter-block', 'text': v.price})
                                        ])
                                    ])    
                                ])
                            ) 
                        })
                });
      return false;
    });
  });