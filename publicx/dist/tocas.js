!function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function c(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function s(t,n,e){t.insertBefore(n,e||null)}function i(t){t.parentNode.removeChild(t)}function u(t){const n={};for(const e of t)n[e.name]=e.value;return n}function a(t){const n={};return t.childNodes.forEach((t=>{n[t.slot||"default"]=!0})),n}let l;function f(t){l=t}const d=[],h=[],$=[],p=[],m=Promise.resolve();let g=!1;function b(t){$.push(t)}let _=!1;const y=new Set;function x(){if(!_){_=!0;do{for(let t=0;t<d.length;t+=1){const n=d[t];f(n),k(n.$$)}for(f(null),d.length=0;h.length;)h.pop()();for(let t=0;t<$.length;t+=1){const n=$[t];y.has(n)||(y.add(n),n())}$.length=0}while(d.length);for(;p.length;)p.pop()();g=!1,_=!1,y.clear()}}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(b)}}const E=new Set;function w(t,n){-1===t.$$.dirty[0]&&(d.push(t),g||(g=!0,m.then(x)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function v(r,s,u,a,d,h,$=[-1]){const p=l;f(r);const m=r.$$={fragment:null,ctx:null,props:h,update:t,not_equal:d,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:s.context||[]),callbacks:e(),dirty:$,skip_bound:!1};let g=!1;if(m.ctx=u?u(r,s.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return m.ctx&&d(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),g&&w(r,t)),n})):[],m.update(),g=!0,o(m.before_update),m.fragment=!!a&&a(m.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);m.fragment&&m.fragment.l(t),t.forEach(i)}else m.fragment&&m.fragment.c();s.intro&&((_=r.$$.fragment)&&_.i&&(E.delete(_),_.i(y))),function(t,e,r,s){const{fragment:i,on_mount:u,on_destroy:a,after_update:l}=t.$$;i&&i.m(e,r),s||b((()=>{const e=u.map(n).filter(c);a?a.push(...e):o(e),t.$$.on_mount=[]})),l.forEach(b)}(r,s.target,s.anchor,s.customElement),x()}var _,y;f(p)}let C;function A(n){let e;return{c(){var n,o,c,r;n="slot",e=document.createElement(n),this.c=t,o=e,c="name",null==(r="foo")?o.removeAttribute(c):o.getAttribute(c)!==r&&o.setAttribute(c,r)},m(t,n){s(t,e,n)},p:t,i:t,o:t,d(t){t&&i(e)}}}function j(t,n,e){let{$$slots:o={},$$scope:c}=n;const r=function(t){const n={};for(const e in t)n[e]=!0;return n}(o);return console.log(r),[]}"function"==typeof HTMLElement&&(C=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(n).filter(c);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,n,e){this[t]=e}disconnectedCallback(){o(this.$$.on_disconnect)}$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class M extends C{constructor(t){super(),v(this,{target:this.shadowRoot,props:{...u(this.attributes),$$slots:a(this)},customElement:!0},j,A,r,{}),t&&t.target&&s(t.target,this,t.anchor)}}customElements.define("my-wc",M),new M({target:document.body})}();
//# sourceMappingURL=tocas.js.map