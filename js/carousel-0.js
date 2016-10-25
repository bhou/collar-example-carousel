(function carousel () {
  window.carousel = function () {
    window.collar.enableDevtool();

    var ns,
        id;

    ns = window.collar.ns('com.collartechs.example.carousel');

    const input = ns.input('carousel input');
    const output = ns.output('carousel output');
    const model = ns.model('carousel model');

    input
      .when('init carousel')
      .do('init carousel basic container without carousel item');

    model
      .when('items is changed')
      .do('update items UI')
      .map('prepare "set current to 0" message')
      .ref(model);

    model
      .when('current is changed')
      .do('show current item');

    return {
      input: null,
      output: null,
      api: {
        init: function (eleId) {},
        setItems: function (items) {},
        showPrev: function () {},
        showNext: function () {},
        showItem: function (n) {},
      }
    }
  }
}());
