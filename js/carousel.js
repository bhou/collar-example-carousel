(function carousel() {
  'use strict';

  var carouselModule = function (id) {
    var prev,
        next,
        current,
        items,
        data,
        ele,
        carouselRootEle,
        carouselContentEle,
        carouselPreEle,
        carouselNextEle,
        carouselItemEleTemplate = '<li class="carousel-item {CURRENT}">' +
          '<img src="{URL}"/>' +
          '<div class="carousel-desc">' +
            '<div class="carousel-title">' +
              '<h1>{TITLE}</h1>' +
            '</div>' +
            '<div class="carousel-calories">' +
              'Subtitle: <span>{SUBTITLE}</span>' +
            '</div>' +
          '</div>' +
        '</li>',
        carouselItemEleStr,
        count,
        carouselId,
        currentIdx = 0,
        i;

    const ns = window.collar.ns('com.collartechs.example.calculeat.carousel');

    const input = ns.input('carousel input');
    const output = ns.output('carousel output');

    const carouselUISensor = ns.sensor('carousel ui sensor',
      function (options) {
        var _this = this; // eslint-disable-line no-invalid-this
        if (options === 'init') {
          document.querySelector('#' + id + ' .carousel-prev')
            .addEventListener('click', function () {
              _this.send({
                msg: 'previous carousel item',
              });
            });

          document.querySelector('#' + id + ' .carousel-next')
            .addEventListener('click', function () {
              _this.send({
                msg: 'next carousel item',
              });
            });
        }
      });

    window.collar.enableDevtool();

    input
      .when('init carousel', function (signal) {
        return signal.get('msg') === 'init carousel';
      })
      .do('init carousel UI structure', function (signal) {
        ele = document.querySelector('#' + id);
        carouselRootEle = document.createElement('div');
        carouselRootEle.className = 'carousel';

        carouselContentEle = document.createElement('ol');
        carouselContentEle.className = 'carousel-content';

        carouselPreEle = document.createElement('div');
        carouselPreEle.innerHTML = '❮';
        carouselPreEle.className = 'carousel-prev';

        carouselNextEle = document.createElement('div');
        carouselNextEle.innerHTML = '❯';
        carouselNextEle.className = 'carousel-next';

        carouselRootEle.appendChild(carouselContentEle);
        carouselRootEle.appendChild(carouselPreEle);
        carouselRootEle.appendChild(carouselNextEle);
        ele.appendChild(carouselRootEle);
      })
      .actuator('#{getData_' + id + '} get data', {
          msg: 'init carousel'
        }, {
          __result__: 'list of data'
        })
      .map('prepare message for displaying data', {
          __result__: 'list of data'
        }, {
          id: 'carousel id',
          count: 'item count',
          data: 'list of data'
        }, function (signal) {
          var data = signal.getResult();
          if (data) {
            count = data.length;
            return signal.set('id', id).set('count', data.length).set('data', signal.getResult());
          }
          else {
            return signal;
          }
        })
      .do('#{buildContentUI_' + id + '} show data in carousel', {
        id: 'carousel id',
        data: 'list of data',
      }, {
        id: 'carousel id',
        __result__: 'html string for content'
      })
      .do('integrate content UI to carousel UI', function (signal) {
        carouselId = signal.get('id');
        carouselItemEleStr = signal.getResult();
        carouselContentEle = document.querySelector('#' + id + ' .carousel-content');
        carouselContentEle.innerHTML = carouselItemEleStr;
      })
      .do('init carousel ui sensor', function () {
        carouselUISensor.watch('init');
      })
      .errors(function (signal) {
        console.error(signal.error);
      })
      .map('prepare "carousel initiated" event', function (signal) {
        return signal.new({
          msg: 'carousel initiated'
        });
      })
      .to(output);

    input
      .when('previous carousel item', function (signal) {
        return signal.get('msg') === 'previous carousel item';
      })
      .do('change current item to previous', function () {
        currentIdx = (currentIdx - 1 < 0) ? currentIdx = count - 1 : currentIdx - 1;
        current = document.querySelector('#' + id + ' .current');
        prev = current.previousElementSibling;

        if (!prev) {
          items = document.querySelectorAll('#' + id + ' .carousel-item');
          prev = items[items.length - 1];
        }

        if (current.classList.contains('current')) {
          current.classList.remove('current');
        }

        if (!prev.classList.contains('current')) {
          prev.classList.add('current');
        }

        return currentIdx;
      })
      .errors(function (signal) {
        console.error(signal.error);
      })
      .map('prepare "carousel item changed" event', function (signal) {
        return signal.new({
          msg: 'carousel item changed',
          itemIndex: signal.getResult(),
          item: data[signal.getResult()],
        });
      })
      .to(output);

    input
      .when('next carousel item', function (signal) {
        return signal.get('msg') === 'next carousel item';
      })
      .do('change current item to next', function () {
        currentIdx = (currentIdx + 1) % count;
        current = document.querySelector('#' + id + ' .current');
        next = current.nextElementSibling;

        if (!next) {
          next = document.querySelectorAll('#' + id + ' .carousel-item')[0];
        }

        if (current.classList.contains('current')) {
          current.classList.remove('current');
        }

        if (!next.classList.contains('current')) {
          next.classList.add('current');
        }

        return currentIdx;
      })
      .errors(function (signal) {
        console.error(signal.error);
      })
      .map('prepare "carousel item changed" event', function (signal) {
        return signal.new({
          msg: 'carousel item changed',
          itemIndex: signal.getResult(),
          item: data[signal.getResult()],
        });
      })
      .to(output);

    carouselUISensor.to(input);

    window.collar.registry.registerActuatorAsync('com.collartechs.example.calculeat.carousel.getData_' + id, function (signal, done) {
      done(null, [
          {
            url: 'https://unsplash.it/600/?random&abc=' + Math.floor((Math.random() * 100) + 1),
            title: 'Example Title 1',
            subtitle: 'subtitle',
          },
          {
            url: 'https://unsplash.it/600/?random&abc=' + Math.floor((Math.random() * 100) + 1),
            title: 'Example Title 2',
            subtitle: 'subtitle',
          },
          {
            url: 'https://unsplash.it/600/?random&abc=' + Math.floor((Math.random() * 100) + 1),
            title: 'Example Title 3',
            subtitle: 'subtitle',
          },
          {
            url: 'https://unsplash.it/600/?random&abc=' + Math.floor((Math.random() * 100) + 1),
            title: 'Example Title 4',
            subtitle: 'subtitle',
          },
          {
            url: 'https://unsplash.it/600/?random&abc=' + Math.floor((Math.random() * 100) + 1),
            title: 'Example Title 5',
            subtitle: 'subtitle',
          },
        ]);
    });

    window.collar.registry.registerActuatorSync('com.collartechs.example.calculeat.carousel.buildContentUI_' + id, function (signal) {
      data = signal.get('data');

      carouselItemEleStr = '';

      for (i = 0; i < data.length; i++) {
        carouselItemEleStr += carouselItemEleTemplate
          .replace('{CURRENT}', i === 0 ? 'current' : '')
          .replace('{URL}', data[i].url)
          .replace('{TITLE}', data[i].title)
          .replace('{SUBTITLE}', data[i].subtitle);
      }

      return carouselItemEleStr;
    });


    return {
      input: input,
      output: output,
      api: {
        init: function () {
          input.push({
            msg: 'init carousel',
          });
        },
        next: function () {
          input.push({
            msg: 'next carousel item',
          });
        },
        prev: function () {
          input.push({
            msg: 'prev carousel item',
          });
        },
      },
    };
  };

  window.carousel = carouselModule;
}());
