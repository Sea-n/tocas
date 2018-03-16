// Generated by CoffeeScript 2.0.0-beta4
// ------------------------------------------------------------------------
// 變數與常數設置
// ------------------------------------------------------------------------

// 模組名稱。
var Attribute, ClassName, EVENT_NAMESPACE, Error, Event, MODULE_NAMESPACE, NAME, Selector, Settings;

NAME = 'sortable';

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
  // 是否要在抓起時顯示浮起陰影。
  shadow: true,
  // 指定的拖曳把手選擇器，設置為 `false` 則為整個元素皆可拖曳。
  handle: false,
  // 到拖曳開始之前必須按住的指定毫秒數，避免點擊成為不必要的拖曳。
  delay: 0,
  // 是否能在相同拖放排序內重新排序。
  //sort          : true
  // 群組名稱，相同的名稱拖放排序清單可以交替其項目。
  group: false,
  // 此拖放排序的支援模式。（`all` 表示可拖放、`put` 表示僅可放入、`pull` 表示僅可移出、`clone` 表示僅可移出複製）
  mode: 'all',
  // 這個拖放排序是否已垂直清單為主，改為 `false` 會有利於水平清單。
  vertical: true,
  // 當拖拉開始時所會呼叫的回呼函式。
  onDragStart: () => {},
  // 當拖拉途中所會呼叫的回呼函式，間隔是 350 毫秒。
  onDrag: () => {},
  // 當拖拉結束並丟下元素時所會呼叫的回呼函式。
  onDrop: () => {},
  // 當放下被禁止（如：範圍外、被回呼函式拒絕）時所會呼叫的函式。
  onDeny: () => {},
  // 當放下時跟一開始沒有差異時所會呼叫的回呼函式。
  onCancel: () => {},
  // 當有變動（新增、移除、重新排序）時所會呼叫的回呼函式。
  onChange: (valueElement, value) => {},
  // 當項目新增時所會呼叫的回呼函式，回傳 `false` 表示不接受此新增。
  onAdd: (valueElement, value) => {
    return true;
  },
  // 當項目被移出時所會呼叫的回呼函式。
  onRemove: (valueElement, value) => {}
};

// 事件名稱。
Event = {
  DRAGSTART: `dragstart${EVENT_NAMESPACE}`,
  DRAG: `drag${EVENT_NAMESPACE}`,
  DROP: `drop${EVENT_NAMESPACE}`,
  DENY: `deny${EVENT_NAMESPACE}`,
  CANCEL: `cancel${EVENT_NAMESPACE}`,
  CHANGE: `change${EVENT_NAMESPACE}`,
  ADD: `add${EVENT_NAMESPACE}`,
  REMOVE: `remove${EVENT_NAMESPACE}`,
  MOUSEMOVE: `mousemove${EVENT_NAMESPACE}`,
  MOUSEUP: `mouseup${EVENT_NAMESPACE}`,
  MOUSEDOWN: `mousedown${EVENT_NAMESPACE}`
};

// 樣式名稱。
ClassName = {};

// 元素屬性標籤。
Attribute = {
  CONTAINER: 'data-draggable-container',
  DRAGGABLE: 'data-draggable',
  DRAGGING: 'data-draggable-dragging',
  VALUE: 'data-value',
  GHOST: 'data-draggable-ghost',
  PLACEHOLDER: 'data-draggable-placeholder',
  X_OFFSET: 'data-draggable-x-offset',
  Y_OFFSET: 'data-draggable-y-offset',
  HIDDEN: 'hidden'
};

// 選擇器名稱。
Selector = {
  BODY: 'body',
  CONTAINER: `[${Attribute.CONTAINER}]`,
  GHOST: `[${Attribute.GHOST}]`,
  PLACEHOLDER: `[${Attribute.PLACEHOLDER}]`,
  DRAGGABLE: `[${Attribute.DRAGGABLE}]`,
  HIDDEN_DRAGGABLE: `[${Attribute.DRAGGABLE}][${Attribute.HIDDEN}]`,
  DRAGGABLE_VALUE: (value) => {
    return `[${Attribute.VALUE}='${value}']`;
  }
};

// 錯誤訊息。
Error = {};

// ------------------------------------------------------------------------
// 模組註冊
// ------------------------------------------------------------------------
ts.register({NAME, MODULE_NAMESPACE, Error, Settings}, ({$allModules, $this, element, debug, settings}) => {
  var $pointing, cacheValue, lastX, lastY, module;
  // ------------------------------------------------------------------------
  // 區域變數
  // ------------------------------------------------------------------------
  $pointing = null;
  lastX = 0;
  lastY = 0;
  cacheValue = [];
  // ------------------------------------------------------------------------
  // 模組定義
  // ------------------------------------------------------------------------
  return module = {
    disable: () => {},
    enable: () => {},
    get: {
      group: () => {
        return settings.group;
      },
      mode: () => {
        return settings.mode;
      },
      pointing: {
        group: () => {
          return $pointing.closest(Selector.CONTAINER).attr(Attribute.CONTAINER);
        },
        $container: () => {
          return $pointing.closest(Selector.CONTAINER);
        }
      },
      value: () => {
        var values;
        values = [];
        $this.find(Selector.DRAGGABLE).each(function() {
          var value;
          value = ts(this).attr(Attribute.VALUE);
          if (value) {
            return values.push(value);
          }
        });
        return values;
      },
      $ghost: () => {
        return ts(Selector.GHOST);
      },
      $draggable: () => {
        return $pointing.closest(Selector.DRAGGABLE);
      },
      $dragging: () => {
        return $this.find(Selector.HIDDEN_DRAGGABLE);
      },
      draggable: {
        amount: () => {
          return $this.find(Selector.DRAGGABLE).length;
        }
      },
      dragging: {
        element: () => {
          return module.get.$dragging().get();
        },
        value: () => {
          return module.get.$dragging().attr(Attribute.VALUE);
        }
      }
    },
    is: {
      pointing: {
        placeholder: () => {
          return $pointing.closest(Selector.PLACEHOLDER).length !== 0;
        },
        draggable: () => {
          return module.get.$draggable().length !== 0;
        },
        container: () => {
          return $pointing.closest(Selector.CONTAINER).length !== 0;
        }
      },
      moving: (x, y) => {
        return x !== lastX || y !== lastY;
      },
      same: {
        group: (name) => {
          return name === module.get.group();
        }
      }
    },
    set: {
      $pointing: (x, y) => {
        $pointing = ts(document.elementFromPoint(x, y));
        lastX = x;
        return lastY = y;
      }
    },
    sort: (values) => {
      var i, len, results, value;
      results = [];
      for (i = 0, len = values.length; i < len; i++) {
        value = values[i];
        results.push($this.find(Selector.DRAGGABLE_VALUE(value)).appendTo(element));
      }
      return results;
    },
    has: {
      handle: () => {
        return settings.handle !== false;
      },
      group: () => {
        return settings.group !== false;
      }
    },
    move: {
      ghost: (x, y) => {
        var $ghost;
        $ghost = module.get.$ghost();
        return $ghost.css({
          top: y - parseInt($ghost.attr(Attribute.Y_OFFSET), 10),
          left: x - parseInt($ghost.attr(Attribute.X_OFFSET), 10)
        });
      },
      placeholder: (x, y) => {
        var $under, rect, xoffset, yoffset;
        if (module.is.pointing.placeholder()) {
          return;
        }
        if (!module.is.pointing.draggable()) {
          return;
        }
        $under = module.get.$draggable();
        rect = $under.rect();
        xoffset = x - rect.left;
        yoffset = y - rect.top;
        if ($under.prev().length !== 0 && $under.prev().attr(Attribute.HIDDEN) === void 0 && ($under.next().length === 0 || $under.next().attr(Attribute.HIDDEN) !== void 0)) {
          return ts(Selector.PLACEHOLDER).insertAfter($under);
        } else if (yoffset < rect.height / 3) {
          return ts(Selector.PLACEHOLDER).insertBefore($under);
        } else {
          return ts(Selector.PLACEHOLDER).insertAfter($under);
        }
      }
    },
    remove: {
      placeholder: () => {
        return ts(Selector.PLACEHOLDER).remove();
      },
      ghost: () => {
        return ts(Selector.GHOST).remove();
      }
    },
    create: {
      ghost: ($original, x, y) => {
        var rect;
        rect = $original.rect();
        return $original.clone().attr(Attribute.GHOST, 'true').attr(Attribute.X_OFFSET, x - rect.left).attr(Attribute.Y_OFFSET, y - rect.top).css({
          position: 'fixed',
          top: y - (y - rect.top),
          left: x - (x - rect.left),
          width: rect.width,
          height: rect.height,
          margin: 0
        }).appendTo(Selector.BODY);
      },
      placeholder: ($original) => {
        return $original.clone().removeAttr(Attribute.DRAGGABLE).removeAttr(Attribute.VALUE).attr(Attribute.PLACEHOLDER, 'true').css({
          opacity: '0.2'
        }).insertAfter($original);
      }
    },
    trigger: {
      dragStart: () => {
        return $this.trigger(Event.DRAGSTART, module.get.dragging.element(), module.get.dragging.value());
      },
      drag: () => {
        return $this.trigger(Event.DRAG, module.get.dragging.element(), module.get.dragging.value());
      },
      drop: () => {
        return $this.trigger(Event.DROP, module.get.dragging.element(), module.get.dragging.value());
      },
      deny: () => {
        return $this.trigger(Event.DENY, module.get.dragging.element(), module.get.dragging.value());
      },
      cancel: () => {
        return $this.trigger(Event.CANCEL, module.get.dragging.element(), module.get.dragging.value());
      },
      change: (valueElement, value) => {
        return $this.trigger(Event.CHANGE, element, valueElement, value);
      },
      add: (valueElement, value) => {
        return $this.trigger(Event.ADD, element, valueElement, value);
      },
      remove: (valueElement, value) => {
        return $this.trigger(Event.REMOVE, element, valueElement, value);
      }
    },
    bind: {
      events: () => {
        var id, mousemove;
        $this.on(Event.DRAGSTART, (event, context) => {
          debug('發生 DRAGSTART 事件', context);
          return settings.onDragStart.call(context, event);
        });
        $this.on(Event.DRAG, (event, context) => {
          //debug '發生 DRAG 事件', context
          return settings.onDrag.call(context, event);
        });
        $this.on(Event.DROP, (event, context) => {
          debug('發生 DROP 事件', context);
          return settings.onDrop.call(context, event);
        });
        $this.on(Event.DENY, (event, context) => {
          debug('發生 DENY 事件', context);
          return settings.onDeny.call(context, event);
        });
        $this.on(Event.CANCEL, (event, context) => {
          debug('發生 CANCEL 事件', context);
          return settings.onCancel.call(context, event);
        });
        $this.on(Event.CHANGE, (event, context, valueElement, value) => {
          debug('發生 CHANGE 事件', context, valueElement, value);
          return settings.onChange.call(context, event, valueElement, value);
        });
        $this.on(Event.ADD, (event, context, valueElement, value) => {
          debug('發生 ADD 事件', context, valueElement, value);
          return settings.onAdd.call(context, event, valueElement, value);
        });
        $this.on(Event.REMOVE, (event, context, valueElement, value) => {
          debug('發生 REMOVE 事件', context, valueElement, value);
          return settings.onRemove.call(context, event, valueElement, value);
        });
        id = null;
        mousemove = (event) => {
          var group;
          if (!module.is.moving(event.clientX, event.clientY)) {
            return;
          }
          module.set.$pointing(event.clientX, event.clientY);
          module.move.ghost(event.clientX, event.clientY);
          group = module.get.pointing.group();
          if (group) {
            if (group !== module.get.group()) {
              return;
            }
          }
          if (module.has.group() && !group) {
            return;
          }
          return module.move.placeholder(event.clientX, event.clientY);
        };
        ts(Selector.BODY).on('mousedown', (event) => {
          var $draggable;
          module.set.$pointing(event.clientX, event.clientY);
          $draggable = module.get.$draggable();
          if (!$this.contains($draggable)) {
            return;
          }
          if ($draggable.length === 0) {
            return;
          }
          $this.attr(Attribute.DRAGGING, 'true');
          module.set.$pointing(event.clientX, event.clientY);
          module.create.ghost($draggable, event.clientX, event.clientY);
          module.create.placeholder($draggable);
          $draggable.attr('hidden', 'hidden');
          module.trigger.dragStart();
          cacheValue = module.get.value();
          id = setInterval(() => {
            return module.trigger.drag();
          }, 350);
          return ts('body').on('mousemove', mousemove);
        });
        return ts(Selector.BODY).on('mouseup', (event) => {
          var con, currentDraggable, currentValue, originalDraggable, originalValue, point, v, x;
          if (!$this.attr(Attribute.DRAGGING)) {
            return;
          }
          $this.removeAttr(Attribute.DRAGGING);
          ts('body').off('mousemove', mousemove);
          clearInterval(id);
          module.trigger.drop();
          module.set.$pointing(event.clientX, event.clientY);
          point = module.is.pointing.container();
          if (point) {
            con = module.get.pointing.$container();
            v = con.sortable('get value');
            x = con.sortable('get draggable amount');
          }
          originalValue = module.get.value();
          originalDraggable = module.get.draggable.amount();
          module.remove.ghost();
          ts(Selector.HIDDEN_DRAGGABLE).insertAfter(ts(Selector.PLACEHOLDER)).removeAttr('hidden');
          module.remove.placeholder();
          if (!point) {
            return;
          }
          currentValue = module.get.value();
          currentDraggable = module.get.draggable.amount();
          if (originalDraggable !== currentDraggable) {
            module.trigger.change();
            if (originalDraggable > currentDraggable) {
              module.trigger.remove();
            }
          }
          return con.sortable('calculate', v, x);
        });
      }
    },
    calculate: (originalValue, amount) => {
      var currentAmount, currentValue;
      currentValue = module.get.value();
      currentAmount = module.get.draggable.amount();
      if (currentAmount === amount && originalValue.toString() === currentValue.toString()) {
        if (originalValue.toString() === '' && currentValue.toString() === '') {
          return;
        }
        module.trigger.cancel();
      }
      if (currentAmount !== amount || originalValue.toString() !== currentValue.toString()) {
        module.trigger.change();
      }
      if (currentAmount !== amount && (currentValue.length > originalValue.length || currentAmount > amount)) {
        return module.trigger.add();
      }
    },
    // ------------------------------------------------------------------------
    // 基礎方法
    // ------------------------------------------------------------------------
    initialize: () => {
      debug('初始化拖放排序', element);
      module.bind.events();
      if (module.has.group()) {
        return $this.attr(Attribute.CONTAINER, module.get.group());
      }
    },
    instantiate: () => {
      return debug('實例化拖放排序', element);
    },
    refresh: () => {
      return $allModules;
    },
    destroy: () => {
      debug('摧毀拖放排序', element);
      $this.removeData(MODULE_NAMESPACE).off(EVENT_NAMESPACE);
      return $allModules;
    }
  };
});
