// Generated by CoffeeScript 2.0.0-beta4
// Transition

// 過場效果。
var Transition;

Transition = (function() {
  class Transition {
    constructor() {
      // 元素初始化函式。
      this.init = this.init.bind(this);
      // Until Visible

      // 此函式會以 `await` 的方式持續阻擋，直到頁面在客戶端上可見為止。
      // 這是避免瀏覽器在不可見的時候會進行重繪，導致動畫亂序。
      this.untilVisible = this.untilVisible.bind(this);
      // Data

      // 取得動畫資料。
      this.data = this.data.bind(this);
      // Push

      // 將新的動畫資料推入至目前選擇器的佇列中。
      this.push = this.push.bind(this);
      // Play

      // 取得選擇器目前該播放的動畫，並且開始演繹。
      this.play = this.play.bind(this);
      // Animate

      // 以指定動畫演繹選擇器中所有元素。
      this.animate = this.animate.bind(this);
      // Simple Push

      // 簡易版的 Push，將動畫推入至動畫佇列中。
      this.simplePush = this.simplePush.bind(this);
      // 元素摧毀函式。
      this.destroy = this.destroy.bind(this);
      // 模組可用的方法。
      this.methods = this.methods.bind(this);
    }

    init(options) {
      // 如果索引不是 0 就離開，避免重複呼叫。
      if (this.index !== 0) {
        return ts.fn;
      }
      // 如果選項裡沒有動畫名稱就表示這只是初始化，但我們並不需要初始化。
      if (options.animation === null) {
        return ts.fn;
      }
      // 將進階動畫選項推入至動畫佇列中。
      this.push(options);
      return ts.fn;
    }

    untilVisible() {
      return new Promise((resolve) => {
        var check;
        check = () => {
          // 如果頁面是處於不可見狀態就返回，持續阻擋。
          if (document.visibilityState !== 'visible') {
            return;
          }
          // 如果可見了，就呼叫解決函式。
          resolve();
          // 然後移除頁面的可見度變更監聽事件。
          return document.removeEventListener('visibilitychange', check);
        };
        // 新增頁面可見度變更監聽事件，當可見度變更時就呼叫一次檢查函式。
        document.addEventListener('visibilitychange', check);
        // 立即檢查一次。
        return check();
      });
    }

    data() {
      var data;
      // 如果主要的資料中心不存在，就初始化一個。
      if (document.body.$data === void 0) {
        document.body.$data = {};
      }
      // 從資料中心取得動畫資料。
      data = document.body.$data.animationData;
      // 如果動畫資料不存在就初始化一個。
      if (data === void 0) {
        data = {};
        document.body.$data.animationData = data;
      }
      // 如果動畫資料裡沒有這個選擇器的資料，就初始化一個。
      if (data[this.$elements.selector] === void 0) {
        data[this.$elements.selector] = {
          looping: false,
          index: 0,
          queue: [],
          animating: false,
          timer: false
        };
        document.body.$data.animationData = data;
      }
      return {
        // save 會儲存新的動畫資料到目前的選擇器中。
        // 回傳下列可用的輔助函式。
        save: (newData) => {
          data[this.$elements.selector] = newData;
          return document.body.$data.animationData = data;
        },
        // get 會取得目前選擇器的動畫資料。
        get: () => {
          return data[this.$elements.selector];
        }
      };
    }

    push(options) {
      var data;
      options.duration = options.duration || 1000;
      options.onComplete = options.onComplete || function() {};
      // 取得目前選擇器的動畫資料。
      data = this.data().get();
      // 將本次的動畫推入至選擇器內的動畫佇列中。
      // 預設的動畫選項。
      // 加上使用者自訂的選項。
      data.queue.push(Object.assign({}, this.props, options));
      // 將這個變更保存到主要中心。
      this.data().save(data);
      // 如果這是第一個動畫，就開始播放。
      if (data.index === 0) {
        return this.play();
      }
    }

    async play() {
      var animation, data;
      // 取得目前選擇器的動畫資料。
      data = this.data().get();
      // 表示目前正在執行動畫。
      data.animating = true;
      // 從動畫資料中的佇列與索引取得出本次該播放的動畫。
      animation = data.queue[data.index];
      // 如果本次動畫不存在。
      if (animation === void 0) {
        // 就重設動畫索引。
        data.index = 0;
        data.animating = false;
        this.data().save(data);
        // 如果這個選擇器的動畫是可供重複的，那麼就重頭開始播放動畫。
        if (data.looping) {
          this.play();
          return;
        }
        // 不然就清空動畫佇列。
        data.queue = [];
        this.data().save(data);
        return;
      }
      // 動畫索引遞加。
      data.index++;
      this.data().save(data);
      // 播放本次動畫並且到所有元素都演繹本次動畫結束才繼續。
      await this.animate(animation);
      // 播放下次的動畫。
      return this.play();
    }

    animate({animation, reverse, forceOrder, interval, duration, onComplete, onAllComplete, onStart, displayHidden, queue}) {
      // 如果這個動畫是結束後會隱藏元素，而且反序設定又是「自動」，
      // 那麼我們就反序吧。因為淡入會順序，淡出當然要反序啦（通常啦）。
      if (animation.indexOf('out') !== -1 && reverse === 'auto') {
        reverse = true;
      }
      // 回傳 Promise 物件才能夠阻擋到所有元素在本輪都演繹結束。
      return new Promise(async(resolve) => {
        var $element, element, elements, fn, i, index, len, results;
        // 將元素選擇器轉換為陣列，這樣才能以迴圈遞迴。
        // 因為 `await` 只能在 `for` 中使用，而不能用在 `.each` 或 `.forEach`。
        elements = this.$elements.toArray();
        // 如果這個動畫要反序播放就反轉選擇器陣列。
        if (reverse === true) {
          elements = elements.reverse();
        }
        // 如果動畫是下列自訂動畫，就做額外處理。
        switch (animation) {
          // delay 會延遲一段時間。
          case 'delay':
            await this.delay(duration);
            resolve();
            return;
          // show 會讓元素可見（`display` 屬性），並且沒有延遲時間。
          case 'show':
            this.$elements.removeAttr(this.attribute.NONE);
            resolve();
            return;
          // hide 會讓元素隱藏（`display` 屬性），並且沒有延遲時間。
          case 'hide':
            this.$elements.attr(this.attribute.NONE, 'true');
            resolve();
            return;
          // toggle 會切換元素的可見與隱藏，並且沒有延遲時間。
          case 'toggle':
            if (this.$this.attr(this.attribute.HIDDEN) === 'true') {
              this.$this.removeAttr(this.attribute.HIDDEN);
            } else {
              this.$this.attr(this.attribute.HIDDEN, 'true');
            }
            resolve();
            return;
          // show visibility 會讓元素的可見度改為可見（`visibility` 屬性）。
          case 'show visibility':
            this.$elements.removeAttr(this.attribute.HIDDEN);
            resolve();
            return;
          // hide visibility 會讓元素的可見度改為隱藏（`visibility` 屬性），同時占用元素位置。
          case 'hide visibility':
            this.$elements.attr(this.attribute.HIDDEN, 'true');
            resolve();
            return;
          // toggle visibility 會切換元素的可見度（`visibility` 屬性）。
          case 'toggle visibility':
            if (this.$this.attr(this.attribute.HIDDEN) === 'true') {
              this.$this.removeAttr(this.attribute.HIDDEN);
            } else {
              this.$this.attr(this.attribute.HIDDEN, 'true');
            }
            resolve();
            return;
        }
// 遞迴元素選擇器陣列，這樣才能透過 `await` 一個一個逐一執行其動畫。
        // 以閉包方式執行本次動畫，避免 For 迴圈覆蓋了元素變數。
        fn = ($element, index) => {
          var $previousElement, ref;
          // 本次動畫開始，呼叫開始回呼函式。
          onStart.call($element.get());
          // 如果有前一個元素而且也是在同個動畫群組內，但他卻沒有動畫標籤，
          // 這表示動畫可能已經中止了，就返回。
          $previousElement = $element.prev();
          if ($previousElement.length !== 0 && ((ref = $previousElement.get()) != null ? ref.isSameNode(elements[index - 1]) : void 0) && $previousElement.attr(this.attribute.ANIMATABLE) !== 'true') {
            return;
          }
          // 套用動畫名稱、動畫速度。
          $element.attr(this.attribute.ANIMATABLE, 'true').attr(this.attribute.ANIMATION, animation).css('animation-duration', `${duration}ms`);
          // 移除元素的隱藏標籤。
          $element.removeAttr(this.attribute.NONE).removeAttr(this.attribute.HIDDEN);
          // 套用執行動畫的標籤。
          $element.attr(this.attribute.ANIMATING, true);
          // 當這個元素的動畫執行結束時。
          return $element.one('animationend', async() => {
            // 呼叫完成函式，並且傳遞自己作為 `this`。
            onComplete.call($element.get());
            // 如果動畫名稱中有 `out` 就表示這個動畫會隱藏元素，所以就在動畫結束後加上元素隱藏標籤。
            if (animation.indexOf('out') !== -1) {
              if (displayHidden) {
                $element.attr(this.attribute.NONE, 'true');
              } else {
                $element.attr(this.attribute.HIDDEN, 'true');
              }
            }
            // 動畫結束後移除自己所以和動畫有關的標籤。
            $element.removeAttr(this.attribute.ANIMATION).removeAttr(this.attribute.ANIMATING).css('animation-duration', '');
            // 如果這是本次動畫中的最後一個元素，而且又演繹結束的話。
            if (index === elements.length - 1) {
              // 就呼叫所有動畫完成的回呼函式。
              onAllComplete();
              // 稍微等待一下。
              await this.delay();
              // 然後呼叫 Promise 的解決函式，這樣就可以進行下一輪的動畫了。
              return resolve();
            }
          }).emulate('animationend', duration + interval);
        };
        results = [];
        for (index = i = 0, len = elements.length; i < len; index = ++i) {
          element = elements[index];
          // 如果動畫佇列在這個時候被終止就停止演繹。

          // 已選擇器選擇這個元素。
          $element = $selector(element);
          // 持續以 `await` 阻擋，直到此頁面在螢幕上可見。
          // 這可以避免瀏覽器因為重新繪製而打亂動畫的順序，如果移除此方法會雜亂無章。
          await this.untilVisible();
          fn($element, index);
          // 等待指定延遲才演繹下個元素。
          await this.delay(interval);
          // 如果這是動畫中第一個元素，而且使用者又不想遵循排隊規則，
          // 那就開始下一輪新的動畫啦。
          if (queue === false && index === 0) {
            // 稍微等待一下。
            await this.delay();
            // 呼叫 Promise 的解決函式，這樣就可以進行下一輪的動畫了。
            results.push(resolve());
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    }

    simplePush(animation, duration, onComplete) {
      // 如果這不是選擇器中的第一個元素就離開，
      // 因為這個函式只能被執行一次避免重複。
      if (this.index !== 0) {
        return ts.fn;
      }
      // 推入簡化的動畫資料到佇列中。
      this.push({
        animation: animation,
        duration: duration,
        onComplete: onComplete
      });
      return ts.fn;
    }

    destroy() {}

    methods() {
      return {
        // Delay

        // 延遲指定時間才執行下一個動畫。
        delay: (duration, onComplete) => {
          return this.simplePush('delay', duration, onComplete);
        },
        // Stop

        // FIX: This doesn't work as expect.
        // 停止目前的這個動畫，執行下一個。
        stop: () => {
          var data, newQueue;
          // 如果這不是選擇器中的第一個元素就離開，
          // 因為這個函式只能被執行一次避免重複。
          if (this.index !== 0) {
            return ts.fn;
          }
          // 取得目前的動畫資料。
          data = this.data().get();
          // 取得佇列，並且裁減其陣列，保留目前所執行索引後的所有動畫。
          newQueue = data.queue.slice(data.index);
          // 停止整個動畫並重設佇列。
          this.methods()['stop all']();
          // 將這些之後的動畫都慢慢推入至佇列中，並重新開始一整輪的動畫。
          newQueue.forEach((animation) => {
            return this.push(animation);
          });
          return ts.fn;
        },
        // Stop All

        // 停止目前的動畫並且移除整個動畫佇列。
        'stop all': () => {
          var data;
          // 如果這不是選擇器中的第一個元素就離開，
          // 因為這個函式只能被執行一次避免重複。
          if (this.index !== 0) {
            return ts.fn;
          }
          // 重設選擇器中的動畫設定。
          data = this.data().get();
          data.index = 0;
          data.looping = false;
          data.queue = [];
          data.animating = false;
          this.data().save(data);
          // 移除所有元素和動畫有關的標籤。
          this.$elements.removeAttr(this.attribute.ANIMATABLE).removeAttr(this.attribute.HIDDEN).removeAttr(this.attribute.ANIMATION).removeAttr(this.attribute.ANIMATING).removeAttr(this.attribute.NONE).css('animation-duration', '').off('animationend');
          return ts.fn;
        },
        // Clear Queue

        // 執行完目前的動畫後就停止並且移除整個動畫佇列。
        'clear queue': () => {
          var data;
          // 重設選擇器中的動畫設定。
          data = this.data().get();
          data.looping = false;
          data.index = 0;
          data.queue = [];
          this.data().save(data);
          return ts.fn;
        },
        // Show

        // 不透過動畫顯示一個元素。
        show: (duration, onComplete) => {
          return this.simplePush('show', duration, onComplete);
        },
        // Hide

        // 不透過動畫隱藏一個元素。
        hide: (duration, onComplete) => {
          return this.simplePush('hide', duration, onComplete);
        },
        // Toggle

        // 不透過動畫切換一個元素的顯示或隱藏狀態。
        toggle: (duration, onComplete) => {
          return this.simplePush('toggle', duration, onComplete);
        },
        // Show Visibility

        // 不透過動畫顯示一個元素的可見狀態。
        'show visibility': (duration, onComplete) => {
          return this.simplePush('show visibility', duration, onComplete);
        },
        // Hide Visibility

        // 不透過動畫隱藏一個元素的可見狀態，這不會移除元素所佔用的空間。
        'hide visibility': (duration, onComplete) => {
          return this.simplePush('hide visibility', duration, onComplete);
        },
        // Toggle Visibility

        // 不透過動畫切換一個元素的顯示或隱藏可見狀態，這會令元素持續佔用其原本的空間。
        'toggle visibility': (duration, onComplete) => {
          return this.simplePush('toggle visibility', duration, onComplete);
        },
        // Set Looping

        // 允許動畫佇列執行到底之後重頭開始，不斷地循環。
        'set looping': () => {
          var data;
          data = this.data().get();
          data.looping = true;
          this.data().save(data);
          return ts.fn;
        },
        // Remove Looping

        // 移除動畫佇列的循環效果。
        'remove looping': () => {
          var data;
          data = this.data().get();
          data.looping = false;
          this.data().save(data);
          return ts.fn;
        },
        // Is Visible

        // 取得一個元素是否可見的布林值。
        'is visible': () => {
          var visible;
          visible = false;
          this.$elements.forEach((element) => {
            if (element.offsetParent !== null && element.getAttribute(this.attribute.NONE) === null && element.getAttribute(this.attribute.HIDDEN) === null) {
              return visible = true;
            }
          });
          return visible;
        },
        // Is Animating

        // 取得一個元素是否正在進行動畫的布林值。
        'is animating': () => {
          return this.data().get().animating;
        },
        // Is Looping

        // 取得一個元素的動畫佇列是否允許循環的布林值。
        'is looping': () => {
          return this.data().get().looping;
        },
        // Get Animation Name

        // 取得一個元素的動畫佇列是否允許循環的布林值。
        'get animation name': () => {
          var data, ref, ref1;
          data = this.data().get();
          return (ref = data.queue) != null ? (ref1 = ref[data.index]) != null ? ref1.animation : void 0 : void 0;
        },
        // Bounce

        bounce: (duration, onComplete) => {
          return this.simplePush('bounce', duration, onComplete);
        },
        // Flash

        flash: (duration, onComplete) => {
          return this.simplePush('flash', duration, onComplete);
        },
        // Pulse

        pulse: (duration, onComplete) => {
          return this.simplePush('pulse', duration, onComplete);
        },
        // Rubber Band

        'rubber band': (duration, onComplete) => {
          return this.simplePush('rubber band', duration, onComplete);
        },
        // Shake

        shake: (duration, onComplete) => {
          return this.simplePush('shake', duration, onComplete);
        },
        // Head Shake

        'head shake': (duration, onComplete) => {
          return this.simplePush('head shake', duration, onComplete);
        },
        // Swing

        swing: (duration, onComplete) => {
          return this.simplePush('swing', duration, onComplete);
        },
        // Tada

        tada: (duration, onComplete) => {
          return this.simplePush('tada', duration, onComplete);
        },
        // Wobble

        wobble: (duration, onComplete) => {
          return this.simplePush('wobble', duration, onComplete);
        },
        // Jello

        jello: (duration, onComplete) => {
          return this.simplePush('jello', duration, onComplete);
        },
        // Bounce In

        'bounce in': (duration, onComplete) => {
          return this.simplePush('bounce in', duration, onComplete);
        },
        // Bounce In Down

        'bounce in down': (duration, onComplete) => {
          return this.simplePush('bounce in down', duration, onComplete);
        },
        // Bounce In Left

        'bounce in left': (duration, onComplete) => {
          return this.simplePush('bounce in left', duration, onComplete);
        },
        // Bounce In Right

        'bounce in right': (duration, onComplete) => {
          return this.simplePush('bounce in right', duration, onComplete);
        },
        // Bounce In Up

        'bounce in up': (duration, onComplete) => {
          return this.simplePush('bounce in up', duration, onComplete);
        },
        // Bounce Out

        'bounce out': (duration, onComplete) => {
          return this.simplePush('bounce out', duration, onComplete);
        },
        // Bounce Down

        'bounce down': (duration, onComplete) => {
          return this.simplePush('bounce down', duration, onComplete);
        },
        // Bounce Out Left

        'bounce out left': (duration, onComplete) => {
          return this.simplePush('bounce out left', duration, onComplete);
        },
        // Bounce Out Right

        'bounce out right': (duration, onComplete) => {
          return this.simplePush('bounce out right', duration, onComplete);
        },
        // Bounce Out Up

        'bounce out up': (duration, onComplete) => {
          return this.simplePush('bounce out up', duration, onComplete);
        },
        // Fade In

        'fade in': (duration, onComplete) => {
          return this.simplePush('fade in', duration, onComplete);
        },
        // Fade In Down

        'fade in down': (duration, onComplete) => {
          return this.simplePush('fade in down', duration, onComplete);
        },
        // Fade In Down Heavily

        'fade in down heavily': (duration, onComplete) => {
          return this.simplePush('fade in down heavily', duration, onComplete);
        },
        // Fade In Left

        'fade in left': (duration, onComplete) => {
          return this.simplePush('fade in left', duration, onComplete);
        },
        // Fade In Left Heavily

        'fade in left heavily': (duration, onComplete) => {
          return this.simplePush('fade in left heavily', duration, onComplete);
        },
        // Fade In Right

        'fade in right': (duration, onComplete) => {
          return this.simplePush('fade in right', duration, onComplete);
        },
        // Fade In Right Heavily

        'fade in right heavily': (duration, onComplete) => {
          return this.simplePush('fade in right heavily', duration, onComplete);
        },
        // Fade In Up

        'fade in up': (duration, onComplete) => {
          return this.simplePush('fade in up', duration, onComplete);
        },
        // Fade In Up Heavily

        'fade in up heavily': (duration, onComplete) => {
          return this.simplePush('fade in up heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade out down': (duration, onComplete) => {
          return this.simplePush('fade out down', duration, onComplete);
        },
        // Fade Out Down Heavily

        'fade out down heavily': (duration, onComplete) => {
          return this.simplePush('fade out down heavily', duration, onComplete);
        },
        // Fade Out Left

        'fade out left': (duration, onComplete) => {
          return this.simplePush('fade out left', duration, onComplete);
        },
        // Fade Out Left Heavily

        'fade out left heavily': (duration, onComplete) => {
          return this.simplePush('fade out left heavily', duration, onComplete);
        },
        // Fade Out Right

        'fade out right': (duration, onComplete) => {
          return this.simplePush('fade out right', duration, onComplete);
        },
        // Fade Out Right Heavily

        'fade out right heavily': (duration, onComplete) => {
          return this.simplePush('fade out right heavily', duration, onComplete);
        },
        // Fade Out Up

        'fade out up': (duration, onComplete) => {
          return this.simplePush('fade out up', duration, onComplete);
        },
        // Fade Out Up Heavily

        'fade out up heavily': (duration, onComplete) => {
          return this.simplePush('fade out up heavily', duration, onComplete);
        },
        // Flip

        'flip': (duration, onComplete) => {
          return this.simplePush('flip', duration, onComplete);
        },
        // Flip In X

        'flip in x': (duration, onComplete) => {
          return this.simplePush('flip in x', duration, onComplete);
        },
        // Flip In Y

        'flip in y': (duration, onComplete) => {
          return this.simplePush('flip in y', duration, onComplete);
        },
        // Flip Out X

        'flip out x': (duration, onComplete) => {
          return this.simplePush('flip out x', duration, onComplete);
        },
        // Flip Out Y

        'flip out y': (duration, onComplete) => {
          return this.simplePush('flip out y', duration, onComplete);
        },
        // Light Speed In

        'light speed in': (duration, onComplete) => {
          return this.simplePush('light speed in', duration, onComplete);
        },
        // Light Speed Out

        'light speed out': (duration, onComplete) => {
          return this.simplePush('light speed out', duration, onComplete);
        },
        // Rotate In

        'rotate in': (duration, onComplete) => {
          return this.simplePush('rotate in', duration, onComplete);
        },
        // Rotate In Down Left

        'rotate in down left': (duration, onComplete) => {
          return this.simplePush('rotate in down left', duration, onComplete);
        },
        // Rotate In Down Right

        'rotate in down right': (duration, onComplete) => {
          return this.simplePush('rotate in down right', duration, onComplete);
        },
        // Rotate In Up Left

        'rotate in up left': (duration, onComplete) => {
          return this.simplePush('rotate in up left', duration, onComplete);
        },
        // Rotate In Up Right

        'rotate in up right': (duration, onComplete) => {
          return this.simplePush('rotate in up right', duration, onComplete);
        },
        // Rotate Out

        'rotate out': (duration, onComplete) => {
          return this.simplePush('rotate out', duration, onComplete);
        },
        // Rotate Out Down Left

        'rotate out down left': (duration, onComplete) => {
          return this.simplePush('rotate out down left', duration, onComplete);
        },
        // Rotate Out Down Right

        'rotate out down right': (duration, onComplete) => {
          return this.simplePush('rotate out down right', duration, onComplete);
        },
        // Rotate Out Up Left

        'rotate out up left': (duration, onComplete) => {
          return this.simplePush('rotate out up left', duration, onComplete);
        },
        // Rotate Out Up Right

        'rotate out up right': (duration, onComplete) => {
          return this.simplePush('rotate out up right', duration, onComplete);
        },
        // Hinge

        'hinge': (duration, onComplete) => {
          return this.simplePush('hinge', duration, onComplete);
        },
        // Roll In

        'roll in': (duration, onComplete) => {
          return this.simplePush('roll in', duration, onComplete);
        },
        // Roll Out

        'roll out': (duration, onComplete) => {
          return this.simplePush('roll out', duration, onComplete);
        },
        // Zoom In

        'zoom in': (duration, onComplete) => {
          return this.simplePush('zoom in', duration, onComplete);
        },
        // Zoom In Down

        'zoom in down': (duration, onComplete) => {
          return this.simplePush('zoom in down', duration, onComplete);
        },
        // Zoom In Left

        'zoom in left': (duration, onComplete) => {
          return this.simplePush('zoom in left', duration, onComplete);
        },
        // Zoom In Up

        'zoom in up': (duration, onComplete) => {
          return this.simplePush('zoom in up', duration, onComplete);
        },
        // Zoom In Right

        'zoom in right': (duration, onComplete) => {
          return this.simplePush('zoom in right', duration, onComplete);
        },
        // Zoom Out

        'zoom out': (duration, onComplete) => {
          return this.simplePush('zoom out', duration, onComplete);
        },
        // Zoom Out Down

        'zoom out down': (duration, onComplete) => {
          return this.simplePush('zoom out down', duration, onComplete);
        },
        // Zoom Out Left

        'zoom out left': (duration, onComplete) => {
          return this.simplePush('zoom out left', duration, onComplete);
        },
        // Fade Out Down

        'zoom out right': (duration, onComplete) => {
          return this.simplePush('zoom out right', duration, onComplete);
        },
        // Zoom Out Up

        'zoom out up': (duration, onComplete) => {
          return this.simplePush('zoom out up', duration, onComplete);
        },
        // Slide In Down

        'slide in down': (duration, onComplete) => {
          return this.simplePush('slide in down', duration, onComplete);
        },
        // Slide In Left

        'slide in left': (duration, onComplete) => {
          return this.simplePush('slide in left', duration, onComplete);
        },
        // Slide In Right

        'slide in right': (duration, onComplete) => {
          return this.simplePush('slide in right', duration, onComplete);
        },
        // Slide In Up

        'slide in up': (duration, onComplete) => {
          return this.simplePush('slide in up', duration, onComplete);
        },
        // Slide Out Down

        'slide out down': (duration, onComplete) => {
          return this.simplePush('slide out down', duration, onComplete);
        },
        // Slide Out Left

        'slide out left': (duration, onComplete) => {
          return this.simplePush('slide out left', duration, onComplete);
        },
        // Slide Out Right

        'slide out right': (duration, onComplete) => {
          return this.simplePush('slide out right', duration, onComplete);
        },
        // Slide Out Up

        'slide out up': (duration, onComplete) => {
          return this.simplePush('slide out up', duration, onComplete);
        }
      };
    }

  };

  // 模組名稱。
  Transition.module = 'transition';

  Transition.prototype.props = {
    // 欲執行的動畫名稱。
    animation: null,
    // 這個動畫是否要反序執行。
    reverse: 'auto',
    // 此動畫的元素間隔毫秒。
    interval: 80,
    // 是否透過 `display` 切換隱藏狀態，而非 `visibility`。
    displayHidden: true,
    // 是否等待一輪結束後才進行下一輪。
    queue: true,
    // 此動畫的速度毫秒。
    duration: 1000,
    // 當此動畫完成時所會呼叫的函式。
    onComplete: function() {},
    // 當此動畫的所有元素都完成播放時所會呼叫的函式。
    onAllComplete: function() {},
    // 此動畫開始演繹時所會呼叫的函式。
    onStart: function() {}
  };

  Transition.prototype.attribute = {
    NONE: 'data-animating-none',
    HIDDEN: 'data-animating-hidden',
    ANIMATING: 'data-animating',
    ANIMATION: 'data-animation',
    ANIMATABLE: 'data-animatable'
  };

  return Transition;

})();

ts(Transition);