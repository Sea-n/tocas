// Generated by CoffeeScript 2.0.0-beta4
// Transition

// 過場效果。
var Transition;

Transition = (function() {
  class Transition {
    constructor() {
      // 類別樣式名稱。
      //className:

      // 選擇器名稱。
      //selector:

      // 元素初始化函式。
      this.init = this.init.bind(this);
      // 元素摧毀函式。
      this.destroy = this.destroy.bind(this);
      // Until Visible

      // 此函式會以 `await` 的方式持續阻擋，直到頁面在客戶端上可見為止。
      // 這是避免瀏覽器在不可見的時候會進行重繪，導致動畫亂序。
      this.untilVisible = this.untilVisible.bind(this);
      // Set Data

      // 設置並更改元素內的動畫資料。
      this.setData = this.setData.bind(this);
      // Get Data

      // 取得元素內的動畫資料，如果沒有則自動初始化一個。
      this.getData = this.getData.bind(this);
      // Init Data

      // 初始化元素內的動畫資料。
      this.initData = this.initData.bind(this);
      // Push

      // 將一個新的動畫推入至元素的動畫佇列中。
      this.push = this.push.bind(this);
      
      this.globalAction = this.globalAction.bind(this);
      // Start

      // 開始執行元素選擇器裡所有元素的動畫。
      this.start = this.start.bind(this);
      // Animate

      // 執行指定動畫。
      this.animate = this.animate.bind(this);
      // Get Animation

      // 取得動畫，並且自動遞加元素內的動畫索引，
      // 如果索引到底則移除整個佇列，或是重設索引（如果允許重複的話）。
      this.getAnimation = this.getAnimation.bind(this);
      
      this.skipAnimation = this.skipAnimation.bind(this);
      // 模組可用的方法。
      this.methods = this.methods.bind(this);
    }

    init({animation, duration, onComplete, interval}) {
      return ts.fn;
    }

    destroy() {}

    untilVisible() {
      return new Promise((resolve) => {
        var timer;
        return timer = setInterval(() => {
          // 如果頁面還是不可見的，就返回，不要呼叫 Promise 的解決函式。
          if (document.hidden) {
            return;
          }
          // 頁面可見了，呼叫解決函式！
          resolve();
          // 清除偵測計時器。
          return clearInterval(timer);
        }, 1);
      });
    }

    setData(newData) {
      var data;
      // 從元素中取得動畫資料。
      data = this.$this.data('animationData');
      // 如果動畫資料沒有被定義，就初始化一個。
      if (data === void 0) {
        data = this.initData();
      }
      // 合併資料。
      data = Object.assign({}, data, newData);
      // 保存新的變更到元素中。
      return this.$this.data('animationData', data);
    }

    getData() {
      var data;
      // 從元素中取得動畫資料。
      data = this.$this.data('animationData');
      // 如果動畫資料沒有被定義，就初始化一個。
      if (data === void 0) {
        data = this.initData();
      }
      return data;
    }

    initData() {
      var data;
      data = {
        animating: false,
        index: 0,
        looping: false,
        queue: []
      };
      this.$this.data('animationData', data);
      return data;
    }

    async push(animation, duration, onComplete, interval) {
      var data;
      // 動畫的速度毫秒數。
      duration = duration || 800;
      // 當此動畫完成時所會呼叫的函式。
      onComplete = onComplete || function() {};
      // 播放下個動畫的相隔毫秒數。
      switch (animation) {
        case 'hide':
        case 'show':
        case 'toggle':
        case 'hide visibility':
        case 'show visibility':
        case 'toggle visibility':
          interval = interval || 0;
          break;
        default:
          interval = interval || 80;
      }
      // 從元素中取得動畫資料。
      data = this.getData();
      // 將新的動畫推入至動畫佇列中。
      data.queue.push({animation, duration, onComplete, interval});
      // 保存新的動畫資料變更到元素內。
      this.setData(data);
      // 如果動畫佇列只有一個動畫，而且這又是選擇器元素中的最後一個元素，
      // 那麼我們就準備好開始播放整個群組動畫了。
      if (data.queue.length === 1 && this.index === this.$elements.length - 1) {
        await this.delay();
        return this.start();
      }
    }

    globalAction(animation) {
      return new Promise(async(resolve) => {
        switch (animation) {
          
          case 'delay':
            await this.delay(duration);
            break;
          
          case 'show':
            this.$this.removeAttr('data-animating-hidden');
            break;
          
          case 'hide':
            this.$this.attr('data-animating-hidden', 'true');
            break;
          
          case 'toggle':
            if (this.$this.attr('data-animating-hidden') === 'true') {
              this.$this.removeAttr('data-animating-hidden');
            } else {
              this.$this.attr('data-animating-hidden', 'true');
            }
            break;
          
          case 'show visibility':
            this.$this.removeAttr('data-animating-hidden');
            break;
          
          case 'hide visibility':
            this.$this.attr('data-animating-hidden', 'true');
            break;
          
          case 'toggle visibility':
            if (this.$this.attr('data-animating-hidden') === 'true') {
              this.$this.removeAttr('data-animating-hidden');
            } else {
              this.$this.attr('data-animating-hidden', 'true');
            }
        }
        return resolve();
      });
    }

    async start() {
      var $element, animation, element, elements, i, index, len;
      // 將元素選擇器轉換為陣列，這樣才能以迴圈遞迴。
      // 因為 `await` 只能在 `for` 中使用，而不能用在 `.each` 或 `.forEach`。
      elements = this.$elements.toArray();
      // 遞迴元素選擇器陣列，這樣才能透過 `await` 一個一個逐一執行其動畫。
      for (index = i = 0, len = elements.length; i < len; index = ++i) {
        element = elements[index];
        // 持續以 `await` 阻擋，直到此頁面在螢幕上可見。
        // 這可以避免瀏覽器因為重新繪製而打亂動畫的順序，如果移除此方法會雜亂無章。
        // await @untilVisible()

        // 以選擇器選擇此元素。
        $element = $selector(element);
        // 替換 $this 為此選擇器。
        this.$this = $element;
        // 取得此元素本輪該播放的動畫資料。
        animation = this.getAnimation();
        console.log(this.$this.data('animationData'));
        // 如果動畫佇列是空的，那麼就離開。
        if (animation === null) {
          return;
        }
        // 如果這是選擇器的第一個元素。
        if (index === 0) {
          switch (animation.animation) {
            
            case 'delay':
              await this.delay(animation.duration);
              $selector(this.$elements.toArray().splice(1)).each((element) => {
                this.$this = $selector(element);
                return this.getAnimation();
              });
              this.start();
              return;
            
            case 'show':
              this.$elements.removeAttr('data-animating-hidden');
              this.start();
              return;
            
            case 'hide':
              this.$elements.attr('data-animating-hidden', 'true');
              $selector(this.$elements.toArray().splice(1)).each((element) => {
                this.$this = $selector(element);
                return this.getAnimation();
              });
              this.start();
              return;
            
            case 'toggle':
              if (this.$this.attr('data-animating-hidden') === 'true') {
                this.$this.removeAttr('data-animating-hidden');
              } else {
                this.$this.attr('data-animating-hidden', 'true');
              }
              this.start();
              return;
            
            case 'show visibility':
              this.$this.removeAttr('data-animating-hidden');
              this.start();
              return;
            
            case 'hide visibility':
              this.$this.attr('data-animating-hidden', 'true');
              this.start();
              return;
            
            case 'toggle visibility':
              if (this.$this.attr('data-animating-hidden') === 'true') {
                this.$this.removeAttr('data-animating-hidden');
              } else {
                this.$this.attr('data-animating-hidden', 'true');
              }
              this.start();
              return;
          }
        }
        // 取得該元素這一輪該播放的動畫，並且開始演繹。
        await this.animate(animation);
        // 如果這個元素是選擇器裡的最後一個元素，那麼就重新執行一輪。
        // 讓下一輪來決定是否到佇列的最後了好做一些收拾動作，或執行下一輪的動畫。
        if (index === elements.length - 1) {
          this.start();
        }
      }
    }

    async animate(options) {
      var animation, duration, interval, onComplete;
      
      if (options === null) {
        return;
      }
      await this.delay();
      
      ({animation, duration, onComplete, interval} = options);
      // 回傳 Promise，這樣其他函式才能透過 `await` 等待這個動畫執行完
      // 才執行下一個程式。
      return new Promise(async(resolve) => {
        if (animation.indexOf('in') !== -1) {
          this.$this.removeAttr('data-animating-hidden');
        }
        if (animation.indexOf('out') !== -1) {
          this.$this.attr('data-animating-hidden', 'true');
        }
        // 套用動畫名稱、動畫速度。
        this.$this.attr('data-animation', animation).css('animation-duration', `${duration}ms`);
        // 稍微等待一下才套用執行動畫的標籤，這樣才會有動作。
        await this.delay();
        // 套用執行動畫的標籤。
        this.$this.attr('data-animating', true);
        // 當這個元素的動畫執行結束時。
        this.$this.one('animationend.animation', () => {
          // 呼叫完成函式，並且傳遞自己作為 `this`。
          return onComplete.call(this.$this.get());
        });
        // 等待使用者指定的間隔毫秒。
        await this.delay(interval);
        // 呼叫 Promise 的解決方案，解除 `await` 的阻擋。
        return resolve();
      });
    }

    getAnimation() {
      var animation, data;
      // 取得此元素的動畫資料。
      data = this.getData();
      // 基於索引，從動畫佇列取得這次應該播放的動畫。
      animation = data.queue[data.index];
      // 將索引遞加供下次使用。
      data.index++;
      // 如果索引大於佇列的長度，而且又允許重複動畫的話。
      if (data.index - 1 > data.queue.length - 1) {
        // 就重設索引，下次從 0 開始。
        data.index = 0;
        // 如果不允許重複動畫的話。
        if (!data.looping) {
          // 就移除整個動畫佇列。
          data.queue = [];
        }
      }
      // 套用新的動畫資料變更。
      this.setData(data);
      
      if (data.queue.length === 0) {
        return null;
      } else {
        return animation;
      }
    }

    skipAnimation() {
      return this.$elements.each((element) => {
        this.$this = $selector(element);
        return this.getAnimation();
      });
    }

    methods() {
      return {
        // Delay

        // 延遲指定時間才執行下一個動畫。
        delay: (duration, onComplete) => {
          this.push('delay', duration, onComplete);
          return ts.fn;
        },
        // Stop

        // 停止目前的這個動畫，執行下一個。
        stop: () => {
          return ts.fn;
        },
        // Stop All

        // 停止目前的動畫並且移除整個動畫佇列。
        'stop all': () => {
          return ts.fn;
        },
        // Clear Queue

        // 執行完目前的動畫後就停止並且移除整個動畫佇列。
        'clear queue': () => {
          return ts.fn;
        },
        // Show

        // 不透過動畫顯示一個元素。
        show: (duration, onComplete) => {
          this.push('show', duration, onComplete);
          return ts.fn;
        },
        // Hide

        // 不透過動畫隱藏一個元素。
        hide: (duration, onComplete) => {
          this.push('hide', duration, onComplete);
          return ts.fn;
        },
        // Toggle

        // 不透過動畫切換一個元素的顯示或隱藏狀態。
        toggle: (duration, onComplete) => {
          this.push('toggle', duration, onComplete);
          return ts.fn;
        },
        // Show Visibility

        // 不透過動畫顯示一個元素的可見狀態。
        'show visibility': (duration, onComplete) => {
          this.push('show visibility', duration, onComplete);
          return ts.fn;
        },
        // Hide Visibility

        // 不透過動畫隱藏一個元素的可見狀態，這不會移除元素所佔用的空間。
        'hide visibility': (duration, onComplete) => {
          this.push('hide visibility', duration, onComplete);
          return ts.fn;
        },
        // Toggle Visibility

        // 不透過動畫切換一個元素的顯示或隱藏可見狀態，這會令元素持續佔用其原本的空間。
        'toggle visibility': (duration, onComplete) => {
          this.push('toggle visibility', duration, onComplete);
          return ts.fn;
        },
        // Set Looping

        // 允許動畫佇列執行到底之後重頭開始，不斷地循環。
        'set looping': () => {
          this.setData({
            looping: true
          });
          return ts.fn;
        },
        // Remove Looping

        // 移除動畫佇列的循環效果。
        'remove looping': () => {
          this.setData({
            looping: false
          });
          return ts.fn;
        },
        // Is Visible

        // 取得一個元素是否可見的布林值。
        'is visible': () => {},
        // Is Animating

        // 取得一個元素是否正在進行動畫的布林值。
        'is animating': () => {},
        // Is Looping

        // 取得一個元素的動畫佇列是否允許循環的布林值。
        'is looping': () => {},
        // Fade In Down

        'fade in down': (duration, onComplete) => {
          this.push('fade in down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out down': (duration, onComplete) => {
          this.push('fade out down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        bounce: (duration, onComplete) => {
          this.push('bounce', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        flash: (duration, onComplete) => {
          this.push('flash', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        pulse: (duration, onComplete) => {
          this.push('pulse', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rubber band': (duration, onComplete) => {
          this.push('rubber band', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        shake: (duration, onComplete) => {
          this.push('shake', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'head shake': (duration, onComplete) => {
          this.push('head shake', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        swing: (duration, onComplete) => {
          this.push('swing', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        tada: (duration, onComplete) => {
          this.push('tada', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        wobble: (duration, onComplete) => {
          this.push('wobble', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        jello: (duration, onComplete) => {
          this.push('jello', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce in': (duration, onComplete) => {
          this.push('bounce in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce in down': (duration, onComplete) => {
          this.push('bounce in down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce in left': (duration, onComplete) => {
          this.push('bounce in left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce in right': (duration, onComplete) => {
          this.push('bounce in right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce in up': (duration, onComplete) => {
          this.push('bounce in up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce out': (duration, onComplete) => {
          this.push('bounce out', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce down': (duration, onComplete) => {
          this.push('bounce down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce out left': (duration, onComplete) => {
          this.push('bounce out left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce out right': (duration, onComplete) => {
          this.push('bounce out right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'bounce out up': (duration, onComplete) => {
          this.push('bounce out up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in': (duration, onComplete) => {
          this.push('fade in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in down': (duration, onComplete) => {
          this.push('fade in down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in down heavily': (duration, onComplete) => {
          this.push('fade in down heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in left': (duration, onComplete) => {
          this.push('fade in left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in left heavily': (duration, onComplete) => {
          this.push('fade in left heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in right': (duration, onComplete) => {
          this.push('fade in right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in right heavily': (duration, onComplete) => {
          this.push('fade in right heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in up': (duration, onComplete) => {
          this.push('fade in up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade in up heavily': (duration, onComplete) => {
          this.push('fade in up heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out down': (duration, onComplete) => {
          this.push('fade out down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out down heavily': (duration, onComplete) => {
          this.push('fade out down heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out left': (duration, onComplete) => {
          this.push('fade out left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out left heavily': (duration, onComplete) => {
          this.push('fade out left heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out right': (duration, onComplete) => {
          this.push('fade out right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out right heavily': (duration, onComplete) => {
          this.push('fade out right heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out up': (duration, onComplete) => {
          this.push('fade out up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'fade out up heavily': (duration, onComplete) => {
          this.push('fade out up heavily', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'flip': (duration, onComplete) => {
          this.push('flip', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'flip in x': (duration, onComplete) => {
          this.push('flip in x', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'flip in y': (duration, onComplete) => {
          this.push('flip in y', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'flip out x': (duration, onComplete) => {
          this.push('flip out x', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'flip out y': (duration, onComplete) => {
          this.push('flip out y', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'light speed in': (duration, onComplete) => {
          this.push('light speed in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'light speed out': (duration, onComplete) => {
          this.push('light speed out', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate in': (duration, onComplete) => {
          this.push('rotate in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate in down left': (duration, onComplete) => {
          this.push('rotate in down left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate in down right': (duration, onComplete) => {
          this.push('rotate in down right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate in up left': (duration, onComplete) => {
          this.push('rotate in up left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate in up right': (duration, onComplete) => {
          this.push('rotate in up right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate out': (duration, onComplete) => {
          this.push('rotate out', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate out down left': (duration, onComplete) => {
          this.push('rotate out down left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate out down right': (duration, onComplete) => {
          this.push('rotate out down right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate out up left': (duration, onComplete) => {
          this.push('rotate out up left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'rotate out up right': (duration, onComplete) => {
          this.push('rotate out up right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'hinge': (duration, onComplete) => {
          this.push('hinge', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'roll in': (duration, onComplete) => {
          this.push('roll in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'roll out': (duration, onComplete) => {
          this.push('roll out', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom in': (duration, onComplete) => {
          this.push('zoom in', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom in down': (duration, onComplete) => {
          this.push('zoom in down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom in left': (duration, onComplete) => {
          this.push('zoom in left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom in up': (duration, onComplete) => {
          this.push('zoom in up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom in right': (duration, onComplete) => {
          this.push('zoom in right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom out': (duration, onComplete) => {
          this.push('zoom out', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom out down': (duration, onComplete) => {
          this.push('zoom out down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom out left': (duration, onComplete) => {
          this.push('zoom out left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom out right': (duration, onComplete) => {
          this.push('zoom out right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'zoom out up': (duration, onComplete) => {
          this.push('zoom out up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide in down': (duration, onComplete) => {
          this.push('slide in down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide in left': (duration, onComplete) => {
          this.push('slide in left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide in right': (duration, onComplete) => {
          this.push('slide in right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide in up': (duration, onComplete) => {
          this.push('slide in up', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide out down': (duration, onComplete) => {
          this.push('slide out down', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide out left': (duration, onComplete) => {
          this.push('slide out left', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide out right': (duration, onComplete) => {
          this.push('slide out right', duration, onComplete);
          return ts.fn;
        },
        // Fade Out Down

        'slide out up': (duration, onComplete) => {
          this.push('slide out up', duration, onComplete);
          return ts.fn;
        }
      };
    }

  };

  // 模組名稱。
  Transition.module = 'transition';

  // 模組屬性。
  Transition.prototype.props = {
    animation: null,
    reverse: false,
    interval: 0,
    duration: 500,
    onComplete: function() {},
    onAllComplete: function() {},
    onStart: function() {}
  };

  return Transition;

})();

ts(Transition);
