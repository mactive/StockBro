var BasicModel = Backbone.Model.extend({
  validation: {
    password: {
      required: true,
      minLength: 6,
      msg: '请输入密码，不少于6位'
    },
    repassword: {
      required: true,
      equalTo: 'password',
      msg: '两次输入不同'
    },
    email: [{
      required: true,
      msg: '请填写邮箱'
    },{
      pattern: 'email',
      msg: '邮箱格式不正确'
    }]
  }
});

var BasicView = Backbone.View.extend({
  events: {
    'click #submit': 'submit'
  },

  render: function() {
    $(this.el).html(_.template($('#basic-template').html(), {legend: 'Basic example'}));
    Backbone.Validation.bind(this);
    return this;
  },

  submit: function(e){
    e.preventDefault();
    this.$('.alert').hide();

    var data = this.$('form').serializeObject();
    if(this.model.set(data)){
      this.$('.alert-success').fadeIn();
    }
    else {
      this.$('.alert-error').fadeIn();
    }
  }
});


var OnBlurView = Backbone.View.extend({
  events: {
    'click #submit': 'submit',
    'blur input': 'updateModel'
  },

  render: function() {
    $(this.el).html(_.template($('#basic-template').html(), {legend: 'Validation on blur'}));
    Backbone.Validation.bind(this);

    this.model.on('validated:valid', this.valid, this);
    this.model.on('validated:invalid', this.invalid, this);

    return this;
  },

  updateModel: function(el){
    var $el = $(el.target);
    this.model.set($el.attr('name'), $el.val());
  },

  valid: function(){
    this.$('.alert').hide();
    this.$('.alert-success').fadeIn();
  },

  invalid: function(){
    this.$('.alert').hide();
    this.$('.alert-error').fadeIn();
  },

  submit: function(e){
    e.preventDefault();
    this.$('.alert').hide();

    if(this.model.isValid(true)){
      this.$('.alert-success').fadeIn();
    }
    else {
      this.$('.alert-error').fadeIn();
    }
  }
});