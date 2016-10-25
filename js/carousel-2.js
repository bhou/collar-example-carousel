(function carousel () {
  window.carousel = function () {
    window.collar.enableDevtool();

    var ns,
        id;

    ns = window.collar.ns('com.collartechs.example.carousel');

    const input = ns.input('carousel input');
    const output = ns.output('carousel output');
    const model = ns.model('carousel model', 'model', {
      items: [],
      current: 0
    });

    const carouselItemEleTemplate = '<li class="carousel-item {CURRENT}">' +
      '<img src="{URL}"/>' +
      '<div class="carousel-desc">' +
        '<div class="carousel-title">' +
          '<h1>{TITLE}</h1>' +
        '</div>' +
        '<div class="carousel-calories">' +
          'Subtitle: <span>{SUBTITLE}</span>' +
        '</div>' +
      '</div>' +
    '</li>';

    input
      .when('init carousel', function (signal) {
        return signal.get('msg') === 'init carousel';
      })
      .do('init carousel basic container without carousel item', function (signal) {
        id = signal.get('id');

        var ele = document.querySelector('#' + id);
        var carouselRootEle = document.createElement('div');
        carouselRootEle.className = 'carousel';

        var carouselContentEle = document.createElement('ol');
        carouselContentEle.className = 'carousel-content';

        var carouselPreEle = document.createElement('div');
        carouselPreEle.innerHTML = '❮';
        carouselPreEle.className = 'carousel-prev';

        var carouselNextEle = document.createElement('div');
        carouselNextEle.innerHTML = '❯';
        carouselNextEle.className = 'carousel-next';

        carouselRootEle.appendChild(carouselContentEle);
        carouselRootEle.appendChild(carouselPreEle);
        carouselRootEle.appendChild(carouselNextEle);
        ele.appendChild(carouselRootEle);
      })
      .errors(function (signal) {
        console.log(signal.error);
      });

    input
      .when('set items', function (signal) {
        return signal.get('msg') === 'set items';
      })
      .map('prepare "set model" message to change items', function (signal) {
        return signal.new({
          operation: 'set',
          path: 'items',
          value: signal.get('items')
        })
      })
      .errors(function (signal) {
        console.log(signal.error);
      })
      .ref(model);

    input
      .when('prev item', function (signal) {
        return signal.get('msg') === 'prev item';
      })
      .map('prepare "set model" message to change current', function (signal) {
        return signal.new({
          operation: 'set',
          path: 'current',
          value: model.value.current == 0 ? model.value.items.length - 1 : model.value.current - 1
        })
      })
      .errors(function (signal) {
        console.log(signal.error);
      })
      .ref(model);

    input
      .when('next item', function (signal) {
        return signal.get('msg') === 'next item';
      })
      .map('prepare "set model" message to change current', function (signal) {
        return signal.new({
          operation: 'set',
          path: 'current',
          value: (model.value.current + 1) % model.value.items.length
        })
      })
      .errors(function (signal) {
        console.log(signal.error);
      })
      .ref(model);

    model
      .when('items is changed', function (signal) {
        return signal.get('operation') === 'set' && signal.get('path') === 'items';
      })
      .do('update items UI', function (signal) {
        var data = signal.get('value').items;

        var carouselItemEleStr = '';

        for (i = 0; i < data.length; i++) {
          carouselItemEleStr += carouselItemEleTemplate
            .replace('{CURRENT}', '')
            .replace('{URL}', data[i].url)
            .replace('{TITLE}', data[i].title)
            .replace('{SUBTITLE}', data[i].subtitle);
        }

        carouselContentEle = document.querySelector('#' + id + ' .carousel-content');
        carouselContentEle.innerHTML = carouselItemEleStr;
      })
      .map('prepare "set current to 0" message', function (signal) {
        return signal.new({
          operation: 'set',
          path: 'current',
          value: 0,
        })
      })
      .errors(function (signal) {
        console.log(signal.error);
      })
      .ref(model);

    model
      .when('current is changed', function (signal) {
        return signal.get('operation') === 'set' && signal.get('path') === 'current';
      })
      .do('show current item', function (signal) {
        var current = signal.get('value').current;
        var oldCurrentItem = document.querySelector('.current');
        if (oldCurrentItem) oldCurrentItem.classList.remove('current');

        var newCurrentItem = document.querySelector('#' + id + ' li.carousel-item:nth-of-type(' + (current+1) + ')');
        newCurrentItem.classList.add('current');
      })
      .errors(function (signal) {
        console.log(signal.error);
      });

    return {
      input: input,
      output: output,
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
