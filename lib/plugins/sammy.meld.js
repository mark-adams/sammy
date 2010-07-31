(function($) {
  
  Sammy = Sammy || {};

  Sammy.Meld = function(app, method_alias) {
    var default_options = {
      selector: function(k) { return '.' + k; },
      remove_false: true
    };
    
    var meld = function(template, data, options) {
      var $template = $(template);
      
      options = $.extend(default_options, options || {});
      
      if (typeof data === 'string') { 
        $template.html(data);
      } else {
        $.each(data, function(key, value) {
          var selector = options.selector(key),
              $sub = $template.filter(selector),
              $container,
              $item,
              is_list = false,
              subindex = $template.index($sub);
              
          if ($sub.length === 0) { $sub = $template.find(selector); }
          if ($sub.length > 0) {
            if ($.isArray(value)) {
              $container = $('<div/>');
              if ($sub.is('ol, ul')) {
                is_list = true;
                $item   = $sub.children('li:first');
                if ($item.length == 0) { $item = $('<li/>'); }
              } else if ($sub.children().length == 1) { 
                is_list = true;
                $item = $sub.children(':first').clone();
              } else {
                $item = $sub.clone();
              }
              for (var i = 0; i < value.length; i++) {
                $container.append(meld($item.clone(), value[i], options));
              }
              if (is_list) {
                $sub.html($container.html());
              } else if ($sub[0] == $template[0]) {
                $template = $($container.html());
              } else if (subindex >= 0) {
                var args = [subindex, 1];
                args = args.concat($container.children().get());
                $template.splice.apply($template, args);
              }
            } else if (options.remove_false && value === false) {
              $template.splice(subindex, 1);
            } else if (typeof value === 'object') {
              if ($sub.is(':empty')) {
                $sub.attr(value, true);
              } else {
                $sub.html(meld($sub.html(), value, options));
              }
            } else {
              $sub.html(value.toString());
            }
          } else {
            $template.attr({key: value}, true);
          }
        });
      }
      var dom = $template;
      return dom;
    };
    
    // set the default method name/extension
    if (!method_alias) method_alias = 'meld'; 
    // create the helper at the method alias
    app.helper(method_alias, meld);
    
  };

})(jQuery);