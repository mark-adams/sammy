(function($) {
  with(jqUnit) {
    context('Sammy.Application', 'parseParams', {
      before: function () {
        this.app = new Sammy.Application(function() {
          this.route('post', /test_nested_params/, function() {
            this.app.form_params = this.params;
            return false;
          });
        });
      }
    })
    .should('use the last value if a key was submitted twice', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['author'], 'Thoreau');        
        app.unload();
      }, this, 1, 2);
    })
    .should('use an empty string if empty value was submitted', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['pages'], '');
        app.unload();
      }, this, 1, 2);      
    })
    .should('return an array if key has value form', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['genre'][0], ['documentary']);
        equals(app.form_params['genre'][1], ['nature']);
        app.unload();
      }, this, 1, 3);
    })
    .should('parse nested params for forms', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['poll']['options']['1']['id'], 'Ko5Pi');
        equals(app.form_params['poll']['options']['1']['name'], 'Coffee');
        equals(app.form_params['poll']['options']['2']['id'], 'Oaj5N');
        equals(app.form_params['poll']['options']['2']['name'], 'Tea');
        app.unload();
      }, this, 1, 5);
    })
    .should('parse arrays in nested params', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['poll']['options']['1']['ingredients'][0], 'Water');
        equals(app.form_params['poll']['options']['1']['ingredients'][1], 'Coffein');
        app.unload();
      }, this, 1, 3);
    })
    .should('unescape escaped params', function() {
      var app = this.app;
      app.run('#/');
      $('#nested_params_test_form').submit();
      soon(function() {
        ok(app.form_params);
        equals(app.form_params['title'], 'Walden!');
        app.unload();
      }, this, 1, 2);
    });
    
    //    Rack::Utils.parse_nested_query("x[y][z]=1").
    //      should.equal "x" => {"y" => {"z" => "1"}}
    //    Rack::Utils.parse_nested_query("x[y][z][]=1").
    //      should.equal "x" => {"y" => {"z" => ["1"]}}
    //    Rack::Utils.parse_nested_query("x[y][z]=1&x[y][z]=2").
    //      should.equal "x" => {"y" => {"z" => "2"}}
    //    Rack::Utils.parse_nested_query("x[y][z][]=1&x[y][z][]=2").
    //      should.equal "x" => {"y" => {"z" => ["1", "2"]}}
    // 
    //    Rack::Utils.parse_nested_query("x[y][][z]=1").
    //      should.equal "x" => {"y" => [{"z" => "1"}]}
    //    Rack::Utils.parse_nested_query("x[y][][z][]=1").
    //      should.equal "x" => {"y" => [{"z" => ["1"]}]}
    //    Rack::Utils.parse_nested_query("x[y][][z]=1&x[y][][w]=2").
    //      should.equal "x" => {"y" => [{"z" => "1", "w" => "2"}]}
    // 
    //    Rack::Utils.parse_nested_query("x[y][][v][w]=1").
    //      should.equal "x" => {"y" => [{"v" => {"w" => "1"}}]}
    //    Rack::Utils.parse_nested_query("x[y][][z]=1&x[y][][v][w]=2").
    //      should.equal "x" => {"y" => [{"z" => "1", "v" => {"w" => "2"}}]}
    // 
    //    Rack::Utils.parse_nested_query("x[y][][z]=1&x[y][][z]=2").
    //      should.equal "x" => {"y" => [{"z" => "1"}, {"z" => "2"}]}
    //    Rack::Utils.parse_nested_query("x[y][][z]=1&x[y][][w]=a&x[y][][z]=2&x[y][][w]=3").
    //      should.equal "x" => {"y" => [{"z" => "1", "w" => "a"}, {"z" => "2", "w" => "3"}]}
    // 
    //    lambda { Rack::Utils.parse_nested_query("x[y]=1&x[y]z=2") }.
    //      should.raise(TypeError).
    //      message.should.equal "expected Hash (got String) for param `y'"
    // 
    //    lambda { Rack::Utils.parse_nested_query("x[y]=1&x[]=1") }.
    //      should.raise(TypeError).
    //      message.should.equal "expected Array (got Hash) for param `x'"
    // 
    //    lambda { Rack::Utils.parse_nested_query("x[y]=1&x[y][][w]=2") }.
    //      should.raise(TypeError).
    //      message.should.equal "expected Array (got String) for param `y'"
  }
})(jQuery);