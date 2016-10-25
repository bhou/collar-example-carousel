(function carousel () {
  window.carousel = function (id) {
    window.collar.enableDevtool();

    var ns;

    ns = window.collar.ns('com.collartechs.example.carousel');

    const input = ns.input('carousel input');
    const output = ns.output('carousel output');
    const model = ns.model('carousel model');

    input
      .when('init carousel')
      .do('init carousel UI component')
      .map('prepare "carousel initiated" message', function (signal) {
        return signal.new({
          msg: 'carousel initiated'
        });
      })
      .errors(function (signal) {
        console.error(signal.error);
      })
      .to(output);

    input
      .when('set items')
      .map('prepare "set" operation')
      .ref(model);

    input
      .when('show prev')
      .map('prepare "set" operation')
      .ref(model);

    input
      .when('show next')
      .map('prepare "set" operation')
      .ref(model);


    model
      .when('items changes')
      .do('update UI')
      .map('prepare "item changed" message')
      .errors(function (signal) {
        console.log(signal.error);
      })
      .to(output);

    model
      .when('current changes')
      .do('update UI')
      .map('prepare "current changed" message')
      .errors(function (signal) {
        console.log(signal.error);
      })
      .to(output);


    return {
      input: null,
      output: null,
      api: {
        init: function () {},
        setItems: function (items) {},
        showPrev: function () {},
        showNext: function () {},
        showItem: function (n) {},
      }
    }
  }
}());
