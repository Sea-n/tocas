// Generated by CoffeeScript 2.0.0-beta4
(function() {
  // ------------------------------------------------------------------------
  // 變數與常數設置
  // ------------------------------------------------------------------------

  // 模組名稱。
  var Attribute, ClassName, EVENT_NAMESPACE, Error, Event, MODULE_NAMESPACE, Metadata, NAME, Selector, Settings, Template, Timer, duration;

  NAME = 'snackbar';

  // 模組事件鍵名。
  EVENT_NAMESPACE = `.${NAME}`;

  // 模組命名空間。
  MODULE_NAMESPACE = `module-${NAME}`;

  // 模組設定。
  Settings = {
    // 消音所有提示，甚至是錯誤訊息。
    silent: false,
    // 顯示除錯訊息。
    debug: true,
    // 監聽 DOM 結構異動並自動重整快取。
    observeChanges: true,
    // 主要內容文字。
    content: '',
    // 動作設置。
    action: {
      // 動作按鈕的文字。
      text: '',
      // 動作按鈕的語意。
      emphasis: ''
    },
    
    onVisible: () => {},
    
    onShow: () => {},
    
    onHide: () => {},
    
    onHidden: () => {},
    // 當點心條關閉時所會呼叫的回呼函式。
    onClose: () => {},
    // 當點心條因為放置而自動關閉時所會呼叫的回呼函式。
    onIgnore: () => {},
    // 當動作按鈕被按下時所呼叫的回呼函式。
    onAction: () => {},
    // 點心條到自動消失所耗費的毫秒時間，如果設為 `0` 則表示永不自動消失。
    delay: 3500,
    // 點心條可否手動忽略，例如：滑開、點擊點心條關閉。
    // closable : true
    // 點心條出現的螢幕位置，如：`top left`、`top right`、`bottom left`、`bottom right`
    position: 'bottom left',
    // 點心條是否應該在滑鼠指向時，持續顯示避免自動消失。
    hoverStay: true
  };

  // 中繼資料。
  Metadata = {
    STAY: 'stay'
  };

  // 計時器。
  Timer = {
    AUTO_CLOSE: 'autoClose'
  };

  // 事件名稱。
  Event = {
    CLOSE: `close${EVENT_NAMESPACE}`,
    IGNORE: `open${EVENT_NAMESPACE}`,
    ACTION: `closing${EVENT_NAMESPACE}`,
    CLICK: `click${EVENT_NAMESPACE}`,
    MOUSEENTER: `mouseenter${EVENT_NAMESPACE}`,
    MOUSELEAVE: `mouseleave${EVENT_NAMESPACE}`,
    ANIMATIONEND: 'animationend'
  };

  // 標籤名稱。
  Attribute = {
    TEMPORARY: 'data-snackbar-temporary'
  };

  // 模板。
  Template = {
    SNACKBAR: "<div class=\"content\"></div>\n<a class=\"action href=\"#!\"></a>"
  };

  // 樣式名稱。
  ClassName = {
    SNACKBAR: 'ts snackbar',
    ACTIVE: 'active',
    ANIMATING: 'animating',
    PRIMARY: 'primary',
    INFO: 'info',
    WARNING: 'warning',
    POSITIVE: 'positive',
    NEGATIVE: 'negative',
    TOP: 'top',
    LEFT: 'left',
    BOTTOM: 'bottom',
    RIGHT: 'right'
  };

  // 選擇器名稱。
  Selector = {
    SNACKBAR: `.ts.snackbar[${Attribute.TEMPORARY}]`,
    ACTIVE_SNACKBAR: '.ts.active.snackbar',
    CONTENT: '.content',
    ACTION: '.action',
    BODY: 'body'
  };

  // 錯誤訊息。
  Error = {};

  // 過場動畫毫秒。
  duration = 300;

  // ------------------------------------------------------------------------
  // 模組註冊
  // ------------------------------------------------------------------------
  ts.register({NAME, MODULE_NAMESPACE, Error, Settings}, ({$allModules, $this, element, debug, settings}) => {
    var $action, $content, module;
    // ------------------------------------------------------------------------
    // 區域變數
    // ------------------------------------------------------------------------
    $action = ts();
    $content = ts();
    // ------------------------------------------------------------------------
    // 模組定義
    // ------------------------------------------------------------------------
    return module = {
      show: () => {
        var ref, ref1;
        module.reset.timer();
        module.reset.action();
        module.set.stay(false);
        module.repaint();
        module.animate.show(() => {
          return module.set.animating(false);
        });
        if (settings.content !== '') {
          module.set.content(settings.content);
        }
        if ((((ref = settings.action) != null ? ref.text : void 0) != null) && settings.action.text !== '') {
          module.set.action(settings.action.text, (ref1 = settings.action) != null ? ref1.emphasis : void 0);
        }
        if (settings.delay !== 0) {
          module.set.timer();
        }
        return $allModules;
      },
      hide: (type, callback) => {
        if (module.is.hidden()) {
          return;
        }
        module.reset.timer();
        switch (type) {
          case Event.ACTION:
            if (!module.trigger.action()) {
              return;
            }
            break;
          case Event.IGNORE:
            module.trigger.ignore();
        }
        module.animate.hide(() => {
          module.remove();
          module.trigger.close();
          if (callback != null) {
            return callback.call();
          }
        });
        return $allModules;
      },
      remove: () => {
        return $this.remove();
      },
      repaint: () => {
        return $this.repaint();
      },
      get: {
        $content: () => {
          return $this.find(Selector.CONTENT);
        },
        $action: () => {
          return $this.find(Selector.ACTION);
        }
      },
      trigger: {
        action: () => {
          return $this.trigger(Event.ACTION, element);
        },
        ignore: () => {
          return $this.trigger(Event.IGNORE, element);
        },
        close: () => {
          return $this.trigger(Event.CLOSE, element);
        }
      },
      reset: {
        timer: () => {
          return $this.removeTimer(Timer.AUTO_CLOSE);
        },
        action: () => {
          return $action.html('').removeClass(`${ClassName.PRIMARY} ${ClassName.INFO} ${ClassName.WARNING} ${ClassName.NEGATIVE} ${ClassName.POSITIVE}`);
        },
        position: () => {
          return $this.removeClass(`${ClassName.TOP} ${ClassName.LEFT} ${ClassName.BOTTOM} ${ClassName.RIGHT}`);
        }
      },
      animate: {
        show: (callback) => {
          return $this.addClass(`${ClassName.ACTIVE} ${ClassName.ANIMATING} ${settings.position}`).off(Event.ANIMATIONEND).one(Event.ANIMATIONEND, () => {
            if (callback != null) {
              return callback.call();
            }
          }).emulate(Event.ANIMATIONEND, duration);
        },
        hide: (callback) => {
          return $this.removeClass(ClassName.ACTIVE).addClass(ClassName.ANIMATING).one(Event.ANIMATIONEND, () => {
            if (callback != null) {
              return callback.call();
            }
          }).emulate(Event.ANIMATIONEND, duration);
        }
      },
      is: {
        visible: () => {
          return $this.hasClass(ClassName.ACTIVE);
        },
        hidden: () => {
          return !module.is.visible();
        }
      },
      should: {
        stay: () => {
          return $this.data(Metadata.STAY) === true && settings.hoverStay === true;
        }
      },
      set: {
        stay: (value) => {
          return $this.data(Metadata.STAY, value);
        },
        content: (content) => {
          return $content.html(content);
        },
        animating: (value) => {
          if (value) {
            return $this.addClass(ClassName.ANIMATING);
          } else {
            return $this.removeClass(ClassName.ANIMATING);
          }
        },
        action: (text, emphasis) => {
          $action.html(settings.action.text);
          if (emphasis) {
            return $action.addClass(settings.action.emphasis);
          }
        },
        timer: () => {
          var timer;
          timer = {
            name: Timer.AUTO_CLOSE,
            callback: () => {
              if (module.should.stay()) {
                debug('延長點心條的存在時間', element);
                return $this.setTimer(timer);
              } else {
                return module.hide(Event.IGNORE);
              }
            },
            interval: settings.delay,
            visible: true
          };
          return $this.setTimer(timer);
        }
      },
      bind: {
        stay: () => {
          $this.on(Event.MOUSEENTER, () => {
            debug('發生 MOUSEENTER 事件', element);
            return module.set.stay(true);
          });
          return $this.on(Event.MOUSELEAVE, () => {
            debug('發生 MOUSELEAVE 事件', element);
            return module.set.stay(false);
          });
        },
        events: () => {
          $this.on(Event.CLICK, Selector.ACTION, (event, context) => {
            debug('發生 CLICK 事件', element);
            module.hide(Event.ACTION);
            return settings.onAction.call(context, event);
          });
          $this.on(Event.ACTION, (event, context) => {
            debug('發生 ACTION 事件', context);
            return settings.onAction.call(context, event);
          });
          $this.on(Event.IGNORE, (event, context) => {
            debug('發生 IGNORE 事件', context);
            return settings.onIgnore.call(context, event);
          });
          return $this.on(Event.CLOSE, (event, context) => {
            debug('發生 CLOSE 事件', context);
            return settings.onClose.call(context, event);
          });
        }
      },
      // ------------------------------------------------------------------------
      // 基礎方法
      // ------------------------------------------------------------------------
      initialize: () => {
        debug('初始化點心條', element);
        module.bind.events();
        if (settings.hoverStay === true) {
          module.bind.stay();
        }
        $action = $this.find(Selector.ACTION);
        return $content = $this.find(Selector.CONTENT);
      },
      instantiate: () => {
        return debug('實例化點心條', element);
      },
      refresh: () => {
        return $allModules;
      },
      destroy: () => {
        debug('摧毀點心條', element);
        $this.removeData(MODULE_NAMESPACE).off(EVENT_NAMESPACE);
        return $allModules;
      }
    };
  });

  // ------------------------------------------------------------------------
  // 模組直接註冊
  // ------------------------------------------------------------------------
  ts.snackbar = (options) => {
    var $snackbar, create;
    $snackbar = ts(Selector.SNACKBAR);
    switch (options) {
      case 'hide':
        return $snackbar.snackbar('hide');
      case 'is hidden':
        if (!$snackbar.exists()) {
          return true;
        }
        return $snackbar.snackbar('is hidden');
      case 'is visible':
        if (!$snackbar.exists()) {
          return false;
        }
        return $snackbar.snackbar('is visible');
      case 'destroy':
        return $snackbar.snackbar('destroy');
    }
    create = () => {
      return $snackbar = ts('<div>').attr(Attribute.TEMPORARY, 'true').addClass(ClassName.SNACKBAR).html(Template.SNACKBAR).appendTo(Selector.BODY).snackbar(Object.assign({}, options, {
        onClose: () => {
          var ref;
          if ((ref = options.onClose) != null) {
            ref.call($snackbar.get());
          }
          $snackbar.repaint();
          return $snackbar.remove();
        }
      })).snackbar('show');
    };
    if (!$snackbar.exists()) {
      create();
      return;
    }
    return $snackbar.snackbar('hide', Event.IGNORE, () => {
      $snackbar.remove();
      return create();
    });
  };

}).call(this);
