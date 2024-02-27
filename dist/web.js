function e(e) {
  return Object.keys(e).reduce((t, r) => {
    var o = e[r];
    return (
      (t[r] = Object.assign({}, o)),
      !s(o.value) ||
        (function (e) {
          return "[object Function]" === Object.prototype.toString.call(e);
        })(o.value) ||
        Array.isArray(o.value) ||
        (t[r].value = Object.assign({}, o.value)),
      Array.isArray(o.value) && (t[r].value = o.value.slice(0)),
      t
    );
  }, {});
}
function t(e) {
  if (e)
    try {
      return JSON.parse(e);
    } catch (t) {
      return e;
    }
}
function r(e, t, r) {
  if (null == r || !1 === r) return e.removeAttribute(t);
  let s = JSON.stringify(r);
  (e.__updating[t] = !0),
    "true" === s && (s = ""),
    e.setAttribute(t, s),
    Promise.resolve().then(() => delete e.__updating[t]);
}
function s(e) {
  return null != e && ("object" == typeof e || "function" == typeof e);
}
let o;
function n(s, n) {
  const i = Object.keys(n);
  return class extends s {
    static get observedAttributes() {
      return i.map((e) => n[e].attribute);
    }
    constructor() {
      super(),
        (this.__initialized = !1),
        (this.__released = !1),
        (this.__releaseCallbacks = []),
        (this.__propertyChangedCallbacks = []),
        (this.__updating = {}),
        (this.props = {});
    }
    connectedCallback() {
      if (!this.__initialized) {
        (this.__releaseCallbacks = []),
          (this.__propertyChangedCallbacks = []),
          (this.__updating = {}),
          (this.props = (function (s, o) {
            const n = e(o);
            return (
              Object.keys(o).forEach((e) => {
                const o = n[e],
                  i = s.getAttribute(o.attribute),
                  a = s[e];
                i && (o.value = o.parse ? t(i) : i),
                  null != a && (o.value = Array.isArray(a) ? a.slice(0) : a),
                  o.reflect && r(s, o.attribute, o.value),
                  Object.defineProperty(s, e, {
                    get: () => o.value,
                    set(t) {
                      var s = o.value;
                      (o.value = t), o.reflect && r(this, o.attribute, o.value);
                      for (
                        let r = 0, o = this.__propertyChangedCallbacks.length;
                        r < o;
                        r++
                      )
                        this.__propertyChangedCallbacks[r](e, t, s);
                    },
                    enumerable: !0,
                    configurable: !0,
                  });
              }),
              n
            );
          })(this, n));
        var s = (function (e) {
            return Object.keys(e).reduce(
              (t, r) => ((t[r] = e[r].value), t),
              {}
            );
          })(this.props),
          i = this.Component,
          a = o;
        try {
          ((o = this).__initialized = !0),
            (function (e) {
              return (
                "function" == typeof e && 0 === e.toString().indexOf("class")
              );
            })(i)
              ? new i(s, { element: this })
              : i(s, { element: this });
        } finally {
          o = a;
        }
      }
    }
    async disconnectedCallback() {
      if ((await Promise.resolve(), !this.isConnected)) {
        this.__propertyChangedCallbacks.length = 0;
        for (var e = null; (e = this.__releaseCallbacks.pop()); ) e(this);
        delete this.__initialized, (this.__released = !0);
      }
    }
    attributeChangedCallback(e, r, s) {
      !this.__initialized ||
        this.__updating[e] ||
        ((e = this.lookupProp(e)) in n &&
          ((null == s && !this[e]) || (this[e] = n[e].parse ? t(s) : s)));
    }
    lookupProp(e) {
      if (n) return i.find((t) => e === t || e === n[t].attribute);
    }
    get renderRoot() {
      return this.shadowRoot || this.attachShadow({ mode: "open" });
    }
    addReleaseCallback(e) {
      this.__releaseCallbacks.push(e);
    }
    addPropertyChangedCallback(e) {
      this.__propertyChangedCallbacks.push(e);
    }
  };
}
function i(e, t = {}, r = {}) {
  const { BaseElement: o = HTMLElement, extension: i } = r;
  return (r) => {
    if (!e) throw new Error("tag is required to register a Component");
    let a = customElements.get(e);
    return (
      a
        ? (a.prototype.Component = r)
        : (((a = n(
            o,
            (function (e) {
              return e
                ? Object.keys(e).reduce((t, r) => {
                    var o = e[r];
                    return (
                      (t[r] = s(o) && "value" in o ? o : { value: o }),
                      t[r].attribute ||
                        (t[r].attribute = (function (e) {
                          return e
                            .replace(
                              /\.?([A-Z]+)/g,
                              (e, t) => "-" + t.toLowerCase()
                            )
                            .replace("_", "-")
                            .replace(/^-/, "");
                        })(r)),
                      (t[r].parse =
                        "parse" in t[r]
                          ? t[r].parse
                          : "string" != typeof t[r].value),
                      t
                    );
                  }, {})
                : {};
            })(t)
          )).prototype.Component = r),
          (a.prototype.registeredTag = e),
          customElements.define(e, a, i)),
      a
    );
  };
}
const a = Symbol("solid-proxy"),
  l = Symbol("solid-track"),
  c = { equals: (e, t) => e === t };
let h = L;
const p = 1,
  u = 2,
  d = { owned: null, cleanups: null, context: null, owner: null };
var f = null;
let g = null,
  b = null,
  w = null,
  m = null,
  y = 0;
function v(e, t) {
  const r = b,
    s = f,
    o = 0 === e.length,
    n = o
      ? d
      : {
          owned: null,
          cleanups: null,
          context: null,
          owner: void 0 === t ? s : t,
        },
    i = o ? e : () => e(() => S(() => q(n)));
  (f = n), (b = null);
  try {
    return B(i, !0);
  } finally {
    (b = r), (f = s);
  }
}
function x(e, t) {
  const r = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: (t = t ? Object.assign({}, c, t) : c).equals || void 0,
  };
  return [
    T.bind(r),
    (e) => ("function" == typeof e && (e = e(r.value)), E(r, e)),
  ];
}
function k(e, t, r) {
  $(R(e, t, !1, p));
}
function _(e, t, r) {
  (h = N), ((e = R(e, t, !1, p)).user = !0), m ? m.push(e) : $(e);
}
function C(e, t, r) {
  return (
    (r = r ? Object.assign({}, c, r) : c),
    ((e = R(e, t, !0, 0)).observers = null),
    (e.observerSlots = null),
    (e.comparator = r.equals || void 0),
    $(e),
    T.bind(e)
  );
}
function S(e) {
  if (null === b) return e();
  var t = b;
  b = null;
  try {
    return e();
  } finally {
    b = t;
  }
}
function P(e) {
  _(() => S(e));
}
function A(e) {
  return (
    null !== f &&
      (null === f.cleanups ? (f.cleanups = [e]) : f.cleanups.push(e)),
    e
  );
}
function T() {
  var e;
  return (
    this.sources &&
      this.state &&
      (this.state === p
        ? $(this)
        : ((e = w), (w = null), B(() => j(this), !1), (w = e))),
    b &&
      ((e = this.observers ? this.observers.length : 0),
      b.sources
        ? (b.sources.push(this), b.sourceSlots.push(e))
        : ((b.sources = [this]), (b.sourceSlots = [e])),
      this.observers
        ? (this.observers.push(b),
          this.observerSlots.push(b.sources.length - 1))
        : ((this.observers = [b]),
          (this.observerSlots = [b.sources.length - 1]))),
    this.value
  );
}
function E(e, t, r) {
  var s = e.value;
  return (
    (e.comparator && e.comparator(s, t)) ||
      ((e.value = t),
      e.observers &&
        e.observers.length &&
        B(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            var t = e.observers[s],
              r = g && g.running;
            r && g.disposed.has(t),
              (r ? t.tState : t.state) ||
                ((t.pure ? w : m).push(t), t.observers && z(t)),
              r || (t.state = p);
          }
          if (1e6 < w.length) throw ((w = []), new Error());
        }, !1)),
    t
  );
}
function $(e) {
  var t, r, s;
  e.fn &&
    (q(e),
    (t = f),
    (r = b),
    (s = y),
    (function (e, t, r) {
      let s;
      try {
        s = e.fn(t);
      } catch (t) {
        return (
          e.pure &&
            ((e.state = p), e.owned && e.owned.forEach(q), (e.owned = null)),
          (e.updatedAt = r + 1),
          I(t)
        );
      }
      (!e.updatedAt || e.updatedAt <= r) &&
        (null != e.updatedAt && "observers" in e ? E(e, s) : (e.value = s),
        (e.updatedAt = r));
    })((b = f = e), e.value, s),
    (b = r),
    (f = t));
}
function R(e, t, r, s = p, o) {
  return (
    (e = {
      fn: e,
      state: s,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: f,
      context: null,
      pure: r,
    }),
    null !== f && f !== d && (f.owned ? f.owned.push(e) : (f.owned = [e])),
    e
  );
}
function O(e) {
  if (0 !== e.state) {
    if (e.state === u) return j(e);
    if (e.suspense && S(e.suspense.inFallback))
      return e.suspense.effects.push(e);
    const r = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < y); )
      e.state && r.push(e);
    for (let s = r.length - 1; 0 <= s; s--) {
      var t;
      (e = r[s]).state === p
        ? $(e)
        : e.state === u &&
          ((t = w), (w = null), B(() => j(e, r[0]), !1), (w = t));
    }
  }
}
function B(e, t) {
  if (w) return e();
  let r = !1;
  t || (w = []), m ? (r = !0) : (m = []), y++;
  try {
    var s = e();
    return (
      (function (e) {
        if ((w && (L(w), (w = null)), !e)) {
          const e = m;
          (m = null), e.length && B(() => h(e), !1);
        }
      })(r),
      s
    );
  } catch (e) {
    r || (m = null), (w = null), I(e);
  }
}
function L(e) {
  for (let t = 0; t < e.length; t++) O(e[t]);
}
function N(e) {
  let t,
    r = 0;
  for (t = 0; t < e.length; t++) {
    var s = e[t];
    s.user ? (e[r++] = s) : O(s);
  }
  for (t = 0; t < r; t++) O(e[t]);
}
function j(e, t) {
  for (let o = (e.state = 0); o < e.sources.length; o += 1) {
    var r,
      s = e.sources[o];
    s.sources &&
      ((r = s.state) === p
        ? s !== t && (!s.updatedAt || s.updatedAt < y) && O(s)
        : r === u && j(s, t));
  }
}
function z(e) {
  for (let r = 0; r < e.observers.length; r += 1) {
    var t = e.observers[r];
    t.state || ((t.state = u), (t.pure ? w : m).push(t), t.observers && z(t));
  }
}
function q(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      var r,
        s,
        o = e.sources.pop(),
        n = e.sourceSlots.pop(),
        i = o.observers;
      i &&
        i.length &&
        ((r = i.pop()), (s = o.observerSlots.pop()), n < i.length) &&
        ((i[(r.sourceSlots[s] = n)] = r), (o.observerSlots[n] = s));
    }
  if (e.owned) {
    for (t = e.owned.length - 1; 0 <= t; t--) q(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; 0 <= t; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  (e.state = 0), (e.context = null);
}
function I(e) {
  throw e;
}
const M = Symbol("fallback");
function D(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function U(e, t) {
  return S(() => e(t || {}));
}
function F() {
  return !0;
}
const H = {
  get: (e, t, r) => (t === a ? r : e.get(t)),
  has: (e, t) => t === a || e.has(t),
  set: F,
  deleteProperty: F,
  getOwnPropertyDescriptor: (e, t) => ({
    configurable: !0,
    enumerable: !0,
    get: () => e.get(t),
    set: F,
    deleteProperty: F,
  }),
  ownKeys: (e) => e.keys(),
};
function G(e) {
  return (e = "function" == typeof e ? e() : e) || {};
}
function W(...e) {
  let t = !1;
  for (let s = 0; s < e.length; s++) {
    var r = e[s];
    (t = t || (!!r && a in r)),
      (e[s] = "function" == typeof r ? ((t = !0), C(r)) : r);
  }
  if (t)
    return new Proxy(
      {
        get(t) {
          for (let s = e.length - 1; 0 <= s; s--) {
            var r = G(e[s])[t];
            if (void 0 !== r) return r;
          }
        },
        has(t) {
          for (let r = e.length - 1; 0 <= r; r--) if (t in G(e[r])) return !0;
          return !1;
        },
        keys() {
          var t = [];
          for (let r = 0; r < e.length; r++) t.push(...Object.keys(G(e[r])));
          return [...new Set(t)];
        },
      },
      H
    );
  var s = {};
  for (let t = e.length - 1; 0 <= t; t--)
    if (e[t])
      for (const r in Object.getOwnPropertyDescriptors(e[t]))
        r in s ||
          Object.defineProperty(s, r, {
            enumerable: !0,
            get() {
              for (let s = e.length - 1; 0 <= s; s--) {
                var t = (e[s] || {})[r];
                if (void 0 !== t) return t;
              }
            },
          });
  return s;
}
function V(e, ...t) {
  const r = new Set(t.flat());
  var s;
  if (a in e)
    return (
      (s = t.map(
        (t) =>
          new Proxy(
            {
              get: (r) => (t.includes(r) ? e[r] : void 0),
              has: (r) => t.includes(r) && r in e,
              keys: () => t.filter((t) => t in e),
            },
            H
          )
      )).push(
        new Proxy(
          {
            get: (t) => (r.has(t) ? void 0 : e[t]),
            has: (t) => !r.has(t) && t in e,
            keys: () => Object.keys(e).filter((e) => !r.has(e)),
          },
          H
        )
      ),
      s
    );
  const o = Object.getOwnPropertyDescriptors(e);
  return (
    t.push(Object.keys(o).filter((e) => !r.has(e))),
    t.map((t) => {
      var r = {};
      for (let s = 0; s < t.length; s++) {
        const n = t[s];
        n in e &&
          Object.defineProperty(
            r,
            n,
            o[n] || { get: () => e[n], set: () => !0, enumerable: !0 }
          );
      }
      return r;
    })
  );
}
function Y(e) {
  var t = "fallback" in e && { fallback: () => e.fallback };
  return C(
    (function (e, t, r = {}) {
      let s = [],
        o = [],
        n = [],
        i = 0,
        a = 1 < t.length ? [] : null;
      return (
        A(() => D(n)),
        () => {
          let c,
            h,
            p = e() || [];
          return (
            p[l],
            S(() => {
              let e,
                t,
                l,
                d,
                f,
                g,
                b,
                w,
                m,
                y = p.length;
              if (0 === y)
                0 !== i &&
                  (D(n), (n = []), (s = []), (o = []), (i = 0), (a = a && [])),
                  r.fallback &&
                    ((s = [M]),
                    (o[0] = v((e) => ((n[0] = e), r.fallback()))),
                    (i = 1));
              else if (0 === i) {
                for (o = new Array(y), h = 0; h < y; h++)
                  (s[h] = p[h]), (o[h] = v(u));
                i = y;
              } else {
                for (
                  l = new Array(y),
                    d = new Array(y),
                    a && (f = new Array(y)),
                    g = 0,
                    b = Math.min(i, y);
                  g < b && s[g] === p[g];
                  g++
                );
                for (
                  b = i - 1, w = y - 1;
                  b >= g && w >= g && s[b] === p[w];
                  b--, w--
                )
                  (l[w] = o[b]), (d[w] = n[b]), a && (f[w] = a[b]);
                for (e = new Map(), t = new Array(w + 1), h = w; h >= g; h--)
                  (m = p[h]),
                    (c = e.get(m)),
                    (t[h] = void 0 === c ? -1 : c),
                    e.set(m, h);
                for (c = g; c <= b; c++)
                  (m = s[c]),
                    void 0 !== (h = e.get(m)) && -1 !== h
                      ? ((l[h] = o[c]),
                        (d[h] = n[c]),
                        a && (f[h] = a[c]),
                        (h = t[h]),
                        e.set(m, h))
                      : n[c]();
                for (h = g; h < y; h++)
                  h in l
                    ? ((o[h] = l[h]),
                      (n[h] = d[h]),
                      a && ((a[h] = f[h]), a[h](h)))
                    : (o[h] = v(u));
                (o = o.slice(0, (i = y))), (s = p.slice(0));
              }
              return o;
            })
          );
          function u(e) {
            var r;
            return (
              (n[h] = e),
              a ? (([e, r] = x(h)), (a[h] = r), t(p[h], e)) : t(p[h])
            );
          }
        }
      );
    })(() => e.each, e.children, t || void 0)
  );
}
function X(e) {
  const t = e.keyed,
    r = C(() => e.when, void 0, { equals: (e, r) => (t ? e === r : !e == !r) });
  return C(
    () => {
      const s = r();
      if (s) {
        const o = e.children;
        return "function" == typeof o && 0 < o.length
          ? S(() =>
              o(
                t
                  ? s
                  : () => {
                      if (S(r)) return e.when;
                      throw ((e) => `Stale read from <${e}>.`)("Show");
                    }
              )
            )
          : o;
      }
      return e.fallback;
    },
    void 0,
    void 0
  );
}
const J = new Set([
    "className",
    "value",
    "readOnly",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
  ]),
  K = new Set(["innerHTML", "textContent", "innerText", "children"]),
  Q = Object.assign(Object.create(null), {
    className: "class",
    htmlFor: "for",
  }),
  Z = Object.assign(Object.create(null), {
    class: "className",
    formnovalidate: { $: "formNoValidate", BUTTON: 1, INPUT: 1 },
    ismap: { $: "isMap", IMG: 1 },
    nomodule: { $: "noModule", SCRIPT: 1 },
    playsinline: { $: "playsInline", VIDEO: 1 },
    readonly: { $: "readOnly", INPUT: 1, TEXTAREA: 1 },
  });
const ee = new Set([
    "beforeinput",
    "click",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart",
  ]),
  te = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
  };
const re = "_$DX_DELEGATE";
function se(e, t, r) {
  let s;
  const o = () => {
    var t = document.createElement("template");
    return (t.innerHTML = e), (r ? t.content.firstChild : t.content).firstChild;
  };
  return ((t = t
    ? () => (s = s || o()).cloneNode(!0)
    : () => S(() => document.importNode((s = s || o()), !0))).cloneNode = t);
}
function oe(e, t = window.document) {
  var r = t[re] || (t[re] = new Set());
  for (let o = 0, n = e.length; o < n; o++) {
    var s = e[o];
    r.has(s) || (r.add(s), t.addEventListener(s, ue));
  }
}
function ne(e, t, r) {
  null == r ? e.removeAttribute(t) : e.setAttribute(t, r);
}
function ie(e, t) {
  null == t ? e.removeAttribute("class") : (e.className = t);
}
function ae(e, t = {}, r, s) {
  const o = {};
  return (
    s || k(() => (o.children = de(e, t.children, o.children))),
    k(() => t.ref && t.ref(e)),
    k(() =>
      (function (e, t, r, s, o = {}, n = !1) {
        t = t || {};
        for (const s in o)
          s in t || ("children" !== s && (o[s] = pe(e, s, null, o[s], r, n)));
        for (const a in t) {
          var i;
          "children" === a
            ? s || de(e, t.children)
            : ((i = t[a]), (o[a] = pe(e, a, i, o[a], r, n)));
        }
      })(e, t, r, !0, o, !0)
    ),
    o
  );
}
function le(e, t, r) {
  return S(() => e(t, r));
}
function ce(e, t, r, s) {
  if ((void 0 !== r && (s = s || []), "function" != typeof t))
    return de(e, t, s, r);
  k((s) => de(e, t(), s, r), s);
}
function he(e, t, r) {
  var s = t.trim().split(/\s+/);
  for (let t = 0, o = s.length; t < o; t++) e.classList.toggle(s[t], r);
}
function pe(e, t, r, s, o, n) {
  let i, a, l, c, h;
  var p;
  return "style" === t
    ? (function (e, t, r) {
        if (!t) return r ? ne(e, "style") : t;
        var s = e.style;
        if ("string" == typeof t) return (s.cssText = t);
        let o, n;
        for (n in ("string" == typeof r && (s.cssText = r = void 0),
        (t = t || {}),
        (r = r || {})))
          null == t[n] && s.removeProperty(n), delete r[n];
        for (n in t) (o = t[n]) !== r[n] && (s.setProperty(n, o), (r[n] = o));
        return r;
      })(e, r, s)
    : "classList" === t
    ? (function (e, t, r = {}) {
        var s = Object.keys(t || {}),
          o = Object.keys(r);
        let n, i;
        for (n = 0, i = o.length; n < i; n++) {
          var a = o[n];
          a && "undefined" !== a && !t[a] && (he(e, a, !1), delete r[a]);
        }
        for (n = 0, i = s.length; n < i; n++) {
          var l = s[n],
            c = !!t[l];
          l &&
            "undefined" !== l &&
            r[l] !== c &&
            c &&
            (he(e, l, !0), (r[l] = c));
        }
        return r;
      })(e, r, s)
    : r === s
    ? s
    : ("ref" === t
        ? n || r(e)
        : "on:" === t.slice(0, 3)
        ? ((n = t.slice(3)),
          s && e.removeEventListener(n, s),
          r && e.addEventListener(n, r))
        : "oncapture:" === t.slice(0, 10)
        ? ((n = t.slice(10)),
          s && e.removeEventListener(n, s, !0),
          r && e.addEventListener(n, r, !0))
        : "on" === t.slice(0, 2)
        ? ((n = t.slice(2).toLowerCase()),
          !(p = ee.has(n)) &&
            s &&
            ((s = Array.isArray(s) ? s[0] : s), e.removeEventListener(n, s)),
          (p || r) &&
            ((function (e, t, r, s) {
              if (s)
                Array.isArray(r)
                  ? ((e["$$" + t] = r[0]), (e[`$$${t}Data`] = r[1]))
                  : (e["$$" + t] = r);
              else if (Array.isArray(r)) {
                const s = r[0];
                e.addEventListener(t, (r[0] = (t) => s.call(e, r[1], t)));
              } else e.addEventListener(t, r);
            })(e, n, r, p),
            p) &&
            oe([n]))
        : "attr:" === t.slice(0, 5)
        ? ne(e, t.slice(5), r)
        : (h = "prop:" === t.slice(0, 5)) ||
          (l = K.has(t)) ||
          (!o &&
            ((c = (function (e, t) {
              return "object" == typeof (e = Z[e]) ? (e[t] ? e.$ : void 0) : e;
            })(t, e.tagName)) ||
              (a = J.has(t)))) ||
          (i = e.nodeName.includes("-"))
        ? (h && ((t = t.slice(5)), (a = !0)),
          "class" === t || "className" === t
            ? ie(e, r)
            : !i || a || l
            ? (e[c || t] = r)
            : (e[
                (function (e) {
                  return e
                    .toLowerCase()
                    .replace(/-([a-z])/g, (e, t) => t.toUpperCase());
                })(t)
              ] = r))
        : (s = o && -1 < t.indexOf(":") && te[t.split(":")[0]])
        ? (function (e, t, r, s) {
            null == s ? e.removeAttributeNS(t, r) : e.setAttributeNS(t, r, s);
          })(e, s, t, r)
        : ne(e, Q[t] || t, r),
      r);
}
function ue(e) {
  var t = "$$" + e.type;
  let r = (e.composedPath && e.composedPath()[0]) || e.target;
  for (
    e.target !== r &&
      Object.defineProperty(e, "target", { configurable: !0, value: r }),
      Object.defineProperty(e, "currentTarget", {
        configurable: !0,
        get: () => r || document,
      });
    r;

  ) {
    var s = r[t];
    if (s && !r.disabled) {
      var o = r[t + "Data"];
      if ((void 0 !== o ? s.call(r, o, e) : s.call(r, e), e.cancelBubble))
        return;
    }
    r = r._$host || r.parentNode || r.host;
  }
}
function de(e, t, r, s, o) {
  for (; "function" == typeof r; ) r = r();
  if (t !== r) {
    var n = typeof t,
      i = void 0 !== s;
    if (
      ((e = (i && r[0] && r[0].parentNode) || e),
      "string" == n || "number" == n)
    )
      if (("number" == n && (t = t.toString()), i)) {
        let o = r[0];
        o && 3 === o.nodeType ? (o.data = t) : (o = document.createTextNode(t)),
          (r = be(e, r, s, o));
      } else
        r =
          "" !== r && "string" == typeof r
            ? (e.firstChild.data = t)
            : (e.textContent = t);
    else if (null == t || "boolean" == n) r = be(e, r, s);
    else {
      if ("function" == n)
        return (
          k(() => {
            let o = t();
            for (; "function" == typeof o; ) o = o();
            r = de(e, o, r, s);
          }),
          () => r
        );
      if (Array.isArray(t)) {
        const a = [];
        if (((n = r && Array.isArray(r)), fe(a, t, r, o)))
          return k(() => (r = de(e, a, r, s, !0))), () => r;
        if (0 === a.length) {
          if (((r = be(e, r, s)), i)) return r;
        } else
          n
            ? 0 === r.length
              ? ge(e, a, s)
              : (function (e, t, r) {
                  let s = r.length,
                    o = t.length,
                    n = s,
                    i = 0,
                    a = 0,
                    l = t[o - 1].nextSibling,
                    c = null;
                  for (; i < o || a < n; )
                    if (t[i] === r[a]) i++, a++;
                    else {
                      for (; t[o - 1] === r[n - 1]; ) o--, n--;
                      if (o === i)
                        for (
                          var h =
                            n < s ? (a ? r[a - 1].nextSibling : r[n - a]) : l;
                          a < n;

                        )
                          e.insertBefore(r[a++], h);
                      else if (n === a)
                        for (; i < o; )
                          (c && c.has(t[i])) || t[i].remove(), i++;
                      else if (t[i] === r[n - 1] && r[a] === t[o - 1]) {
                        var p = t[--o].nextSibling;
                        e.insertBefore(r[a++], t[i++].nextSibling),
                          e.insertBefore(r[--n], p),
                          (t[o] = r[n]);
                      } else {
                        if (!c) {
                          c = new Map();
                          let e = a;
                          for (; e < n; ) c.set(r[e], e++);
                        }
                        var u = c.get(t[i]);
                        if (null != u)
                          if (a < u && u < n) {
                            let s,
                              l = i,
                              h = 1;
                            for (
                              ;
                              ++l < o &&
                              l < n &&
                              null != (s = c.get(t[l])) &&
                              s === u + h;

                            )
                              h++;
                            if (h > u - a)
                              for (var d = t[i]; a < u; )
                                e.insertBefore(r[a++], d);
                            else e.replaceChild(r[a++], t[i++]);
                          } else i++;
                        else t[i++].remove();
                      }
                    }
                })(e, r, a)
            : (r && be(e), ge(e, a));
        r = a;
      } else if (t instanceof Node) {
        if (Array.isArray(r)) {
          if (i) return (r = be(e, r, s, t));
          be(e, r, null, t);
        } else
          null != r && "" !== r && e.firstChild
            ? e.replaceChild(t, e.firstChild)
            : e.appendChild(t);
        r = t;
      } else console.warn("Unrecognized value. Skipped inserting", t);
    }
  }
  return r;
}
function fe(e, t, r, s) {
  let o = !1;
  for (let i = 0, a = t.length; i < a; i++) {
    let a = t[i],
      l = r && r[i];
    if (a instanceof Node) e.push(a);
    else if (null != a && !0 !== a && !1 !== a)
      if (Array.isArray(a)) o = fe(e, a, l) || o;
      else if ("function" == typeof a)
        if (s) {
          for (; "function" == typeof a; ) a = a();
          o =
            fe(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || o;
        } else e.push(a), (o = !0);
      else {
        var n = String(a);
        l && 3 === l.nodeType
          ? ((l.data = n), e.push(l))
          : e.push(document.createTextNode(n));
      }
  }
  return o;
}
function ge(e, t, r = null) {
  for (let s = 0, o = t.length; s < o; s++) e.insertBefore(t[s], r);
}
function be(e, t, r, s) {
  if (void 0 === r) return (e.textContent = "");
  var o = s || document.createTextNode("");
  if (t.length) {
    let s = !1;
    for (let a = t.length - 1; 0 <= a; a--) {
      var n,
        i = t[a];
      o !== i
        ? ((n = i.parentNode === e),
          s || a
            ? n && i.remove()
            : n
            ? e.replaceChild(o, i)
            : e.insertBefore(o, r))
        : (s = !0);
    }
  } else e.insertBefore(o, r);
  return [o];
}
function we(e) {
  return (t, r) => {
    const s = r.element;
    return v(
      (o) => {
        const n = (function (e) {
          var t = Object.keys(e),
            r = {};
          for (let s = 0; s < t.length; s++) {
            const [o, n] = x(e[t[s]]);
            Object.defineProperty(r, t[s], {
              get: o,
              set(e) {
                n(() => e);
              },
            });
          }
          return r;
        })(t);
        s.addPropertyChangedCallback((e, t) => (n[e] = t)),
          s.addReleaseCallback(() => {
            (s.renderRoot.textContent = ""), o();
          });
        var i = e(n, r);
        return ce(s.renderRoot, i);
      },
      (function (e) {
        if (e.assignedSlot && e.assignedSlot._$owner)
          return e.assignedSlot._$owner;
        let t = e.parentNode;
        for (
          ;
          t && !t._$owner && (!t.assignedSlot || !t.assignedSlot._$owner);

        )
          t = t.parentNode;
        return (t && t.assignedSlot ? t.assignedSlot : e)._$owner;
      })(s)
    );
  };
}
function me(e, t, r) {
  return 2 === arguments.length && ((r = t), (t = {})), i(e, t)(we(r));
}
const ye = {
  chatflowid: "",
  apiHost: void 0,
  chatflowConfig: void 0,
  theme: void 0,
  observersConfig: void 0,
};
var ve =
  '/*! tailwindcss v3.3.1 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:""}html{-webkit-text-size-adjust:100%;font-feature-settings:normal;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{color:inherit;font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]{display:none}*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.prose{color:var(--tw-prose-body);max-width:65ch}.prose :where(p):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:1.25em;margin-top:1.25em}.prose :where([class~=lead]):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-lead);font-size:1.25em;line-height:1.6;margin-bottom:1.2em;margin-top:1.2em}.prose :where(a):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-links);font-weight:500;text-decoration:underline}.prose :where(strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-bold);font-weight:600}.prose :where(a strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(blockquote strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(thead th strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(ol):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:decimal;margin-bottom:1.25em;margin-top:1.25em;padding-left:1.625em}.prose :where(ol[type=A]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:upper-alpha}.prose :where(ol[type=a]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:lower-alpha}.prose :where(ol[type=A s]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:upper-alpha}.prose :where(ol[type=a s]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:lower-alpha}.prose :where(ol[type=I]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:upper-roman}.prose :where(ol[type=i]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:lower-roman}.prose :where(ol[type=I s]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:upper-roman}.prose :where(ol[type=i s]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:lower-roman}.prose :where(ol[type="1"]):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:decimal}.prose :where(ul):not(:where([class~=not-prose],[class~=not-prose] *)){list-style-type:disc;margin-bottom:1.25em;margin-top:1.25em;padding-left:1.625em}.prose :where(ol>li):not(:where([class~=not-prose],[class~=not-prose] *))::marker{color:var(--tw-prose-counters);font-weight:400}.prose :where(ul>li):not(:where([class~=not-prose],[class~=not-prose] *))::marker{color:var(--tw-prose-bullets)}.prose :where(dt):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-weight:600;margin-top:1.25em}.prose :where(hr):not(:where([class~=not-prose],[class~=not-prose] *)){border-color:var(--tw-prose-hr);border-top-width:1px;margin-bottom:3em;margin-top:3em}.prose :where(blockquote):not(:where([class~=not-prose],[class~=not-prose] *)){border-left-color:var(--tw-prose-quote-borders);border-left-width:.25rem;color:var(--tw-prose-quotes);font-style:italic;font-weight:500;margin-bottom:1.6em;margin-top:1.6em;padding-left:1em;quotes:"\\201C""\\201D""\\2018""\\2019"}.prose :where(blockquote p:first-of-type):not(:where([class~=not-prose],[class~=not-prose] *)):before{content:open-quote}.prose :where(blockquote p:last-of-type):not(:where([class~=not-prose],[class~=not-prose] *)):after{content:close-quote}.prose :where(h1):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-size:2.25em;font-weight:800;line-height:1.1111111;margin-bottom:.8888889em;margin-top:0}.prose :where(h1 strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-weight:900}.prose :where(h2):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-size:1.5em;font-weight:700;line-height:1.3333333;margin-bottom:1em;margin-top:2em}.prose :where(h2 strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-weight:800}.prose :where(h3):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-size:1.25em;font-weight:600;line-height:1.6;margin-bottom:.6em;margin-top:1.6em}.prose :where(h3 strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-weight:700}.prose :where(h4):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-weight:600;line-height:1.5;margin-bottom:.5em;margin-top:1.5em}.prose :where(h4 strong):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-weight:700}.prose :where(img):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:2em;margin-top:2em}.prose :where(picture):not(:where([class~=not-prose],[class~=not-prose] *)){display:block;margin-bottom:2em;margin-top:2em}.prose :where(kbd):not(:where([class~=not-prose],[class~=not-prose] *)){border-radius:.3125rem;box-shadow:0 0 0 1px rgb(var(--tw-prose-kbd-shadows)/10%),0 3px 0 rgb(var(--tw-prose-kbd-shadows)/10%);color:var(--tw-prose-kbd);font-family:inherit;font-size:.875em;font-weight:500;padding:.1875em .375em}.prose :where(code):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-code);font-size:.875em;font-weight:600}.prose :where(code):not(:where([class~=not-prose],[class~=not-prose] *)):before{content:"`"}.prose :where(code):not(:where([class~=not-prose],[class~=not-prose] *)):after{content:"`"}.prose :where(a code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(h1 code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(h2 code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-size:.875em}.prose :where(h3 code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit;font-size:.9em}.prose :where(h4 code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(blockquote code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(thead th code):not(:where([class~=not-prose],[class~=not-prose] *)){color:inherit}.prose :where(pre):not(:where([class~=not-prose],[class~=not-prose] *)){background-color:var(--tw-prose-pre-bg);border-radius:.375rem;color:var(--tw-prose-pre-code);font-size:.875em;font-weight:400;line-height:1.7142857;margin-bottom:1.7142857em;margin-top:1.7142857em;overflow-x:auto;padding:.8571429em 1.1428571em}.prose :where(pre code):not(:where([class~=not-prose],[class~=not-prose] *)){background-color:transparent;border-radius:0;border-width:0;color:inherit;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;padding:0}.prose :where(pre code):not(:where([class~=not-prose],[class~=not-prose] *)):before{content:none}.prose :where(pre code):not(:where([class~=not-prose],[class~=not-prose] *)):after{content:none}.prose :where(table):not(:where([class~=not-prose],[class~=not-prose] *)){font-size:.875em;line-height:1.7142857;margin-bottom:2em;margin-top:2em;table-layout:auto;text-align:left;width:100%}.prose :where(thead):not(:where([class~=not-prose],[class~=not-prose] *)){border-bottom-color:var(--tw-prose-th-borders);border-bottom-width:1px}.prose :where(thead th):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-headings);font-weight:600;padding-bottom:.5714286em;padding-left:.5714286em;padding-right:.5714286em;vertical-align:bottom}.prose :where(tbody tr):not(:where([class~=not-prose],[class~=not-prose] *)){border-bottom-color:var(--tw-prose-td-borders);border-bottom-width:1px}.prose :where(tbody tr:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){border-bottom-width:0}.prose :where(tbody td):not(:where([class~=not-prose],[class~=not-prose] *)){vertical-align:baseline}.prose :where(tfoot):not(:where([class~=not-prose],[class~=not-prose] *)){border-top-color:var(--tw-prose-th-borders);border-top-width:1px}.prose :where(tfoot td):not(:where([class~=not-prose],[class~=not-prose] *)){vertical-align:top}.prose :where(figure>*):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:0;margin-top:0}.prose :where(figcaption):not(:where([class~=not-prose],[class~=not-prose] *)){color:var(--tw-prose-captions);font-size:.875em;line-height:1.4285714;margin-top:.8571429em}.prose{--tw-prose-body:#374151;--tw-prose-headings:#111827;--tw-prose-lead:#4b5563;--tw-prose-links:#111827;--tw-prose-bold:#111827;--tw-prose-counters:#6b7280;--tw-prose-bullets:#d1d5db;--tw-prose-hr:#e5e7eb;--tw-prose-quotes:#111827;--tw-prose-quote-borders:#e5e7eb;--tw-prose-captions:#6b7280;--tw-prose-kbd:#111827;--tw-prose-kbd-shadows:17 24 39;--tw-prose-code:#111827;--tw-prose-pre-code:#e5e7eb;--tw-prose-pre-bg:#1f2937;--tw-prose-th-borders:#d1d5db;--tw-prose-td-borders:#e5e7eb;--tw-prose-invert-body:#d1d5db;--tw-prose-invert-headings:#fff;--tw-prose-invert-lead:#9ca3af;--tw-prose-invert-links:#fff;--tw-prose-invert-bold:#fff;--tw-prose-invert-counters:#9ca3af;--tw-prose-invert-bullets:#4b5563;--tw-prose-invert-hr:#374151;--tw-prose-invert-quotes:#f3f4f6;--tw-prose-invert-quote-borders:#374151;--tw-prose-invert-captions:#9ca3af;--tw-prose-invert-kbd:#fff;--tw-prose-invert-kbd-shadows:255 255 255;--tw-prose-invert-code:#fff;--tw-prose-invert-pre-code:#d1d5db;--tw-prose-invert-pre-bg:rgba(0,0,0,.5);--tw-prose-invert-th-borders:#4b5563;--tw-prose-invert-td-borders:#374151;font-size:1rem;line-height:1.75}.prose :where(picture>img):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:0;margin-top:0}.prose :where(video):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:2em;margin-top:2em}.prose :where(li):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:.5em;margin-top:.5em}.prose :where(ol>li):not(:where([class~=not-prose],[class~=not-prose] *)){padding-left:.375em}.prose :where(ul>li):not(:where([class~=not-prose],[class~=not-prose] *)){padding-left:.375em}.prose :where(.prose>ul>li p):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:.75em;margin-top:.75em}.prose :where(.prose>ul>li>:first-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:1.25em}.prose :where(.prose>ul>li>:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:1.25em}.prose :where(.prose>ol>li>:first-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:1.25em}.prose :where(.prose>ol>li>:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:1.25em}.prose :where(ul ul,ul ol,ol ul,ol ol):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:.75em;margin-top:.75em}.prose :where(dl):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:1.25em;margin-top:1.25em}.prose :where(dd):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:.5em;padding-left:1.625em}.prose :where(hr+*):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:0}.prose :where(h2+*):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:0}.prose :where(h3+*):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:0}.prose :where(h4+*):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:0}.prose :where(thead th:first-child):not(:where([class~=not-prose],[class~=not-prose] *)){padding-left:0}.prose :where(thead th:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){padding-right:0}.prose :where(tbody td,tfoot td):not(:where([class~=not-prose],[class~=not-prose] *)){padding:.5714286em}.prose :where(tbody td:first-child,tfoot td:first-child):not(:where([class~=not-prose],[class~=not-prose] *)){padding-left:0}.prose :where(tbody td:last-child,tfoot td:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){padding-right:0}.prose :where(figure):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:2em;margin-top:2em}.prose :where(.prose>:first-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-top:0}.prose :where(.prose>:last-child):not(:where([class~=not-prose],[class~=not-prose] *)){margin-bottom:0}.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0}.bottom-20{bottom:80px}.bottom-24{bottom:96px}.left-0{left:0}.top-0{top:0}.z-10{z-index:10}.my-2{margin-bottom:8px;margin-top:8px}.-ml-1{margin-left:-4px}.mb-2{margin-bottom:8px}.ml-1{margin-left:4px}.ml-2{margin-left:8px}.mr-1{margin-right:4px}.mr-2{margin-right:8px}.mr-3{margin-right:12px}.block{display:block}.flex{display:flex}.hidden{display:none}.h-10{height:40px}.h-12{height:48px}.h-16{height:64px}.h-2{height:8px}.h-32{height:128px}.h-5{height:20px}.h-6{height:24px}.h-7{height:28px}.h-9{height:36px}.h-full{height:100%}.max-h-\\[704px\\]{max-height:704px}.min-h-full{min-height:100%}.w-10{width:40px}.w-12{width:48px}.w-16{width:64px}.w-2{width:8px}.w-5{width:20px}.w-6{width:24px}.w-7{width:28px}.w-9{width:36px}.w-full{width:100%}.min-w-full{min-width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.-rotate-180{--tw-rotate:-180deg}.-rotate-180,.rotate-0{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-0{--tw-rotate:0deg}.scale-0{--tw-scale-x:0;--tw-scale-y:0}.scale-0,.scale-100{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-100{--tw-scale-x:1;--tw-scale-y:1}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes fade-in{0%{opacity:0}to{opacity:1}}.animate-fade-in{animation:fade-in .3s ease-out}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.overflow-y-scroll{overflow-y:scroll}.scroll-smooth{scroll-behavior:smooth}.whitespace-pre-wrap{white-space:pre-wrap}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:8px}.border{border-width:1px}.bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-opacity-50{--tw-bg-opacity:0.5}.bg-cover{background-size:cover}.bg-center{background-position:50%}.fill-transparent{fill:transparent}.stroke-2{stroke-width:2}.object-cover{-o-object-fit:cover;object-fit:cover}.p-4{padding:16px}.px-2{padding-left:8px;padding-right:8px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.py-1{padding-bottom:4px;padding-top:4px}.py-2{padding-bottom:8px;padding-top:8px}.py-4{padding-bottom:16px;padding-top:16px}.pt-10{padding-top:40px}.text-left{text-align:left}.text-center{text-align:center}.text-base{font-size:16px;line-height:24px}.text-sm{font-size:14px;line-height:20px}.text-xl{font-size:20px;line-height:28px}.font-semibold{font-weight:600}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.opacity-0{opacity:0}.opacity-100{opacity:1}.opacity-25{opacity:.25}.opacity-75{opacity:.75}.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color)}.shadow-md,.shadow-xl{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-opacity{transition-duration:.15s;transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-transform{transition-duration:.15s;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1)}.duration-200{transition-duration:.2s}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}:host{--chatbot-container-bg-image:none;--chatbot-container-bg-color:transparent;--chatbot-container-font-family:"Open Sans";--chatbot-button-bg-color:#0042da;--chatbot-button-color:#fff;--chatbot-host-bubble-bg-color:#f7f8ff;--chatbot-host-bubble-color:#303235;--chatbot-guest-bubble-bg-color:#3b81f6;--chatbot-guest-bubble-color:#fff;--chatbot-input-bg-color:#fff;--chatbot-input-color:#303235;--chatbot-input-placeholder-color:#9095a0;--chatbot-header-bg-color:#fff;--chatbot-header-color:#303235;--chatbot-border-radius:6px;--PhoneInputCountryFlag-borderColor:transparent;--PhoneInput-color--focus:transparent}a{color:#16bed7;font-weight:500}a:hover{text-decoration:underline}pre{word-wrap:break-word;font-size:13px;margin:5px;overflow:auto;padding:5px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;width:auto}.string{color:green}.number{color:#ff8c00}.boolean{color:blue}.null{color:#f0f}.key{color:#002b36}.scrollable-container::-webkit-scrollbar{display:none}.scrollable-container{-ms-overflow-style:none;scrollbar-width:none}.text-fade-in{transition:opacity .4s ease-in .2s}.bubble-typing{transition:width .4s ease-out,height .4s ease-out}.bubble1,.bubble2,.bubble3{background-color:var(--chatbot-host-bubble-color);opacity:.5}.bubble1,.bubble2{animation:chatBubbles 1s ease-in-out infinite}.bubble2{animation-delay:.3s}.bubble3{animation:chatBubbles 1s ease-in-out infinite;animation-delay:.5s}@keyframes chatBubbles{0%{transform:translateY(0)}50%{transform:translateY(-5px)}to{transform:translateY(0)}}button,input,textarea{font-weight:300}.slate-a{text-decoration:underline}.slate-html-container>div{min-height:24px}.slate-bold{font-weight:700}.slate-italic{font-style:oblique}.slate-underline{text-decoration:underline}.text-input::-moz-placeholder{color:#9095a0!important;opacity:1!important}.text-input::placeholder{color:#9095a0!important;opacity:1!important}.chatbot-container{background-color:var(--chatbot-container-bg-color);background-image:var(--chatbot-container-bg-image);font-family:Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.file-annotation-button{background-color:#02a0a0c2;border:1px solid #02a0a0c2;border-radius:var(--chatbot-border-radius);color:var(--chatbot-button-color)}.chatbot-button{background-color:#0042da;border:1px solid #0042da;border-radius:var(--chatbot-border-radius);color:var(--chatbot-button-color)}.chatbot-button.selectable{border:1px solid #0042da}.chatbot-button.selectable,.chatbot-host-bubble{background-color:#f7f8ff;color:var(--chatbot-host-bubble-color)}.chatbot-host-bubble>.bubble-typing{background-color:#f7f8ff;border:var(--chatbot-host-bubble-border);border-radius:6px}.chatbot-host-bubble iframe,.chatbot-host-bubble img,.chatbot-host-bubble video{border-radius:var(--chatbot-border-radius)}.chatbot-guest-bubble{background-color:#3b81f6;border-radius:6px;color:var(--chatbot-guest-bubble-color)}.chatbot-input{background-color:#fff;border-radius:var(--chatbot-border-radius);box-shadow:0 2px 6px -1px rgba(0,0,0,.1);color:#303235}.chatbot-input-error-message{color:#303235}.chatbot-button>.send-icon{fill:var(--chatbot-button-color)}.chatbot-chat-view{max-width:800px}.ping span{background-color:#0042da}.rating-icon-container svg{stroke:#0042da;fill:#f7f8ff;height:42px;transition:fill .1s ease-out;width:42px}.rating-icon-container.selected svg{fill:#0042da}.rating-icon-container:hover svg{filter:brightness(.9)}.rating-icon-container:active svg{filter:brightness(.75)}.upload-progress-bar{background-color:#0042da;border-radius:var(--chatbot-border-radius)}.total-files-indicator{background-color:#0042da;color:var(--chatbot-button-color);font-size:10px}.chatbot-upload-input{transition:border-color .1s ease-out}.chatbot-upload-input.dragging-over{border-color:#0042da}.secondary-button{background-color:#f7f8ff;border-radius:var(--chatbot-border-radius);color:var(--chatbot-host-bubble-color)}.chatbot-country-select{color:#303235}.chatbot-country-select,.chatbot-date-input{background-color:#fff;border-radius:var(--chatbot-border-radius)}.chatbot-date-input{color:#303235;color-scheme:light}.chatbot-popup-blocked-toast{border-radius:var(--chatbot-border-radius)}.messagelist{border-radius:.5rem;height:100%;overflow-y:scroll;width:100%}.messagelistloading{display:flex;justify-content:center;margin-top:1rem;width:100%}.usermessage{padding:1rem 1.5rem}.usermessagewaiting-light{background:linear-gradient(270deg,#ede7f6,#e3f2fd,#ede7f6);background-position:-100% 0;background-size:200% 200%}.usermessagewaiting-dark,.usermessagewaiting-light{animation:loading-gradient 2s ease-in-out infinite;animation-direction:alternate;animation-name:loading-gradient;padding:1rem 1.5rem}.usermessagewaiting-dark{background:linear-gradient(270deg,#2e2352,#1d3d60,#2e2352);background-position:-100% 0;background-size:200% 200%;color:#ececf1}@keyframes loading-gradient{0%{background-position:-100% 0}to{background-position:100% 0}}.apimessage{animation:fadein .5s;padding:1rem 1.5rem}@keyframes fadein{0%{opacity:0}to{opacity:1}}.apimessage,.usermessage,.usermessagewaiting{display:flex}.markdownanswer{line-height:1.75}.markdownanswer a:hover{opacity:.8}.markdownanswer a{color:#16bed7;font-weight:500}.markdownanswer code{color:#15cb19;font-weight:500;white-space:pre-wrap!important}.markdownanswer ol,.markdownanswer ul{margin:1rem}.boticon,.usericon{border-radius:1rem;margin-right:1rem}.markdownanswer h1,.markdownanswer h2,.markdownanswer h3{font-size:inherit}.center{flex-direction:column;padding:10px;position:relative}.center,.cloud{align-items:center;display:flex;justify-content:center}.cloud{border-radius:.5rem;height:calc(100% - 50px);width:400px}input{background-color:transparent;border:none;font-family:Poppins,sans-serif;padding:10px}.hover\\:scale-110:hover{--tw-scale-x:1.1;--tw-scale-y:1.1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:brightness-90:hover{--tw-brightness:brightness(.9);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.active\\:brightness-75:active{--tw-brightness:brightness(.75);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.disabled\\:brightness-100:disabled{--tw-brightness:brightness(1);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}@media (min-width:640px){.sm\\:right-5{right:20px}.sm\\:my-8{margin-bottom:32px;margin-top:32px}.sm\\:w-\\[400px\\]{width:400px}.sm\\:w-full{width:100%}.sm\\:max-w-lg{max-width:512px}.sm\\:p-0{padding:0}}';
const xe = (e) => null == e,
  ke = (e) => null != e,
  _e = async (e) => {
    try {
      var t = "string" == typeof e ? e : e.url,
        r = await fetch(t, {
          method: "string" == typeof e ? "GET" : e.method,
          mode: "cors",
          headers:
            "string" != typeof e && ke(e.body)
              ? { "Content-Type": "application/json" }
              : void 0,
          body:
            "string" != typeof e && ke(e.body)
              ? JSON.stringify(e.body)
              : void 0,
        });
      let o;
      var s = r.headers.get("Content-Type");
      if (
        ((o =
          s && s.includes("application/json")
            ? await r.json()
            : "string" != typeof e && "blob" === e.type
            ? await r.blob()
            : await r.text()),
        r.ok)
      )
        return { data: o };
      {
        let e;
        throw (e =
          "object" == typeof o && "error" in o ? o.error : o || r.statusText);
      }
    } catch (e) {
      return console.error(e), { error: e };
    }
  },
  Ce = se(
    '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">'
  ),
  Se = se('<img alt="Bubble button icon">'),
  Pe = se(
    '<button part="button"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z">'
  ),
  Ae = (e) => {
    {
      const t = Pe(),
        r = t.firstChild;
      return (
        (t.$$click = () => e.toggleBot()),
        t.style.setProperty("z-index", "42424242"),
        ce(
          t,
          U(X, {
            get when() {
              return xe(e.customIconSrc);
            },
            keyed: !0,
            get children() {
              const t = Ce();
              return (
                k(
                  (r) => {
                    var s = e.iconColor ?? "white",
                      o =
                        "stroke-2 fill-transparent absolute duration-200 transition " +
                        (e.isBotOpened
                          ? "scale-0 opacity-0"
                          : "scale-100 opacity-100") +
                        ("large" === e.size ? " w-9" : " w-7");
                    return (
                      s !== r._v$ &&
                        (null != (r._v$ = s)
                          ? t.style.setProperty("stroke", s)
                          : t.style.removeProperty("stroke")),
                      o !== r._v$2 && ne(t, "class", (r._v$2 = o)),
                      r
                    );
                  },
                  { _v$: void 0, _v$2: void 0 }
                ),
                t
              );
            },
          }),
          r
        ),
        ce(
          t,
          U(X, {
            get when() {
              return e.customIconSrc;
            },
            get children() {
              const t = Se();
              return (
                k(
                  (r) => {
                    var s = e.customIconSrc,
                      o =
                        "rounded-full object-cover" +
                        (e.isBotOpened
                          ? "scale-0 opacity-0"
                          : "scale-100 opacity-100") +
                        ("large" === e.size ? " w-9 h-9" : " w-7 h-7");
                    return (
                      s !== r._v$3 && ne(t, "src", (r._v$3 = s)),
                      o !== r._v$4 && ie(t, (r._v$4 = o)),
                      r
                    );
                  },
                  { _v$3: void 0, _v$4: void 0 }
                ),
                t
              );
            },
          }),
          r
        ),
        k(
          (s) => {
            var o =
                "fixed shadow-md rounded-full hover:scale-110 active:scale-95 transition-transform duration-200 flex justify-center items-center animate-fade-in" +
                ("large" === e.size ? " w-16 h-16" : " w-12 h-12"),
              n = e.backgroundColor ?? "#3B81F6",
              i = e.right ? e.right.toString() + "px" : "20px",
              a = e.bottom ? e.bottom.toString() + "px" : "20px",
              l = e.iconColor ?? "white",
              c =
                "absolute duration-200 transition " +
                (e.isBotOpened
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-0 -rotate-180 opacity-0") +
                ("large" === e.size ? " w-9" : " w-7");
            return (
              o !== s._v$5 && ie(t, (s._v$5 = o)),
              n !== s._v$6 &&
                (null != (s._v$6 = n)
                  ? t.style.setProperty("background-color", n)
                  : t.style.removeProperty("background-color")),
              i !== s._v$7 &&
                (null != (s._v$7 = i)
                  ? t.style.setProperty("right", i)
                  : t.style.removeProperty("right")),
              a !== s._v$8 &&
                (null != (s._v$8 = a)
                  ? t.style.setProperty("bottom", a)
                  : t.style.removeProperty("bottom")),
              l !== s._v$9 &&
                (null != (s._v$9 = l)
                  ? r.style.setProperty("fill", l)
                  : r.style.removeProperty("fill")),
              c !== s._v$10 && ne(r, "class", (s._v$10 = c)),
              s
            );
          },
          {
            _v$5: void 0,
            _v$6: void 0,
            _v$7: void 0,
            _v$8: void 0,
            _v$9: void 0,
            _v$10: void 0,
          }
        ),
        t
      );
    }
  };
let Te;
oe(["click"]);
const Ee = new Uint8Array(16);
function $e() {
  if (
    (Te =
      Te ||
      ("undefined" != typeof crypto &&
        crypto.getRandomValues &&
        crypto.getRandomValues.bind(crypto)))
  )
    return Te(Ee);
  throw new Error(
    "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
  );
}
const Re = [];
for (let e = 0; e < 256; ++e) Re.push((e + 256).toString(16).slice(1));
var Oe,
  Be,
  Le = {
    randomUUID:
      "undefined" != typeof crypto &&
      crypto.randomUUID &&
      crypto.randomUUID.bind(crypto),
  };
function Ne(e, t, r) {
  if (Le.randomUUID && !t && !e) return Le.randomUUID();
  var s = (e = e || {}).random || (e.rng || $e)();
  if (((s[6] = (15 & s[6]) | 64), (s[8] = (63 & s[8]) | 128), t)) {
    r = r || 0;
    for (let e = 0; e < 16; ++e) t[r + e] = s[e];
    return t;
  }
  return (function (e, t = 0) {
    return (
      Re[e[t + 0]] +
      Re[e[t + 1]] +
      Re[e[t + 2]] +
      Re[e[t + 3]] +
      "-" +
      Re[e[t + 4]] +
      Re[e[t + 5]] +
      "-" +
      Re[e[t + 6]] +
      Re[e[t + 7]] +
      "-" +
      Re[e[t + 8]] +
      Re[e[t + 9]] +
      "-" +
      Re[e[t + 10]] +
      Re[e[t + 11]] +
      Re[e[t + 12]] +
      Re[e[t + 13]] +
      Re[e[t + 14]] +
      Re[e[t + 15]]
    );
  })(s);
}
const je = ({ apiHost: e = "http://localhost:3000", body: t }) =>
    _e({
      method: "POST",
      url: e + "/api/v1/openai-assistants-file",
      body: t,
      type: "blob",
    }),
  ze = se(
    '<input class="focus:outline-none bg-transparent px-4 py-4 flex-1 w-full text-input disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100" type="text">'
  ),
  qe = (e) => {
    const [t, r] = V(e, ["ref", "onInput"]);
    return (
      ((s = ze()).$$input = (e) => t.onInput(e.currentTarget.value)),
      "function" == typeof (o = e.ref) ? le(o, s) : (e.ref = s),
      ae(
        s,
        W(
          {
            get disabled() {
              return e.disabled;
            },
            get style() {
              return { "font-size": e.fontSize ? e.fontSize + "px" : "16px" };
            },
          },
          r
        ),
        !1,
        !1
      ),
      s
    );
    var s, o;
  },
  [Ie, Me] = (oe(["input"]), x()),
  De = se(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="19px"><path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z">'
  ),
  Ue = (e) => {
    return (
      ae(
        (t = De()),
        W(
          {
            get style() {
              return { fill: e.color ?? "#3B81F6" };
            },
          },
          e
        ),
        !0,
        !0
      ),
      t
    );
    var t;
  },
  Fe = se(
    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4">'
  ),
  He = (e) => {
    {
      const t = Fe();
      return k(() => ne(t, "stroke", e.color ?? "#3B81F6")), t;
    }
  },
  Ge = se('<button type="submit">'),
  We = se(
    '<svg><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'
  ),
  Ve = (e) => {
    return (
      ae(
        (t = Ge()),
        W(
          {
            get disabled() {
              return e.isDisabled || e.isLoading;
            },
          },
          e,
          {
            get class() {
              return (
                "py-2 px-4 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 chatbot-button " +
                e.class
              );
            },
            style: { background: "transparent", border: "none" },
          }
        ),
        !1,
        !0
      ),
      ce(
        t,
        U(X, {
          get when() {
            return !e.isLoading;
          },
          get fallback() {
            return U(Xe, { class: "text-white" });
          },
          get children() {
            return U(Ue, {
              get color() {
                return e.sendButtonColor;
              },
              get class() {
                return "send-icon flex " + (e.disableIcon ? "hidden" : "");
              },
            });
          },
        })
      ),
      t
    );
    var t;
  },
  Ye = (e) => {
    return (
      ae(
        (t = Ge()),
        W(
          {
            get disabled() {
              return e.isDisabled || e.isLoading;
            },
          },
          e,
          {
            get class() {
              return (
                "py-2 px-4 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 chatbot-button " +
                e.class
              );
            },
            style: { background: "transparent", border: "none" },
            title: "New Chat",
          }
        ),
        !1,
        !0
      ),
      ce(
        t,
        U(X, {
          get when() {
            return !e.isLoading;
          },
          get fallback() {
            return U(Xe, { class: "text-white" });
          },
          get children() {
            return U(He, {
              get color() {
                return e.sendButtonColor;
              },
              get class() {
                return "send-icon flex " + (e.disableIcon ? "hidden" : "");
              },
            });
          },
        })
      ),
      t
    );
    var t;
  },
  Xe = (e) => {
    return (
      ae(
        (t = We()),
        W(e, {
          get class() {
            return "animate-spin -ml-1 mr-3 h-5 w-5 " + e.class;
          },
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "data-testid": "loading-spinner",
        }),
        !0,
        !0
      ),
      t
    );
    var t;
  },
  Je = se("<span>Send"),
  Ke = se(
    '<div class="flex items-end justify-between chatbot-input" data-testid="input">'
  ),
  Qe = (e) => {
    const [t, r] = x(e.defaultValue ?? "");
    let s;
    const o = (e) => r(e),
      n = () => {
        "" !== t() && s?.reportValidity() && e.onSubmit(t()), r("");
      },
      i = (e) => {
        var t = e.isComposing || 229 === e.keyCode;
        "Enter" !== e.key || t || n();
      };
    _(() => {
      e.disabled || Ie() || !s || s.focus();
    }),
      P(() => {
        !Ie() && s && s.focus();
      });
    {
      const r = Ke();
      return (
        (r.$$keydown = i),
        r.style.setProperty("border-top", "1px solid #eeeeee"),
        r.style.setProperty("position", "absolute"),
        r.style.setProperty("left", "20px"),
        r.style.setProperty("right", "20px"),
        r.style.setProperty("bottom", "40px"),
        r.style.setProperty("margin", "auto"),
        r.style.setProperty("z-index", "1000"),
        ce(
          r,
          U(qe, {
            ref(e) {
              "function" == typeof s ? s(e) : (s = e);
            },
            onInput: o,
            get value() {
              return t();
            },
            get fontSize() {
              return e.fontSize;
            },
            get disabled() {
              return e.disabled;
            },
            get placeholder() {
              return e.placeholder ?? "Type your question";
            },
          }),
          null
        ),
        ce(
          r,
          U(Ve, {
            get sendButtonColor() {
              return e.sendButtonColor;
            },
            type: "button",
            get isDisabled() {
              return e.disabled || "" === t();
            },
            class: "my-2 ml-2",
            "on:click": n,
            get children() {
              var e = Je();
              return (
                e.style.setProperty("font-family", "Poppins, sans-serif"), e
              );
            },
          }),
          null
        ),
        k(
          (t) => {
            var s = e.backgroundColor ?? "#ffffff",
              o = e.textColor ?? "#303235";
            return (
              s !== t._v$ &&
                (null != (t._v$ = s)
                  ? r.style.setProperty("background-color", s)
                  : r.style.removeProperty("background-color")),
              o !== t._v$2 &&
                (null != (t._v$2 = o)
                  ? r.style.setProperty("color", o)
                  : r.style.removeProperty("color")),
              t
            );
          },
          { _v$: void 0, _v$2: void 0 }
        ),
        r
      );
    }
  },
  Ze =
    (oe(["keydown"]),
    se(
      '<figure data-testid="default-avatar"><svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0" x="0" y="0" mask-type="alpha"><circle cx="37.5" cy="37.5" r="37.5" fill="#0042DA"></circle></mask><g mask="url(#mask0)"><rect x="-30" y="-43" width="131" height="154" fill="#0042DA"></rect><rect x="2.50413" y="120.333" width="81.5597" height="86.4577" rx="2.5" transform="rotate(-52.6423 2.50413 120.333)" stroke="#FED23D" stroke-width="5"></rect><circle cx="76.5" cy="-1.5" r="29" stroke="#FF8E20" stroke-width="5"></circle><path d="M-49.8224 22L-15.5 -40.7879L18.8224 22H-49.8224Z" stroke="#F7F8FF" stroke-width="5">'
    )),
  et = () => {
    {
      const e = Ze(),
        t = e.firstChild;
      return (
        k(
          (r) => {
            var s =
                "flex justify-center items-center rounded-full text-white relative " +
                (Ie() ? "w-6 h-6 text-sm" : "w-10 h-10 text-xl"),
              o =
                "absolute top-0 left-0 " +
                (Ie() ? " w-6 h-6 text-sm" : "w-full h-full text-xl");
            return (
              s !== r._v$ && ie(e, (r._v$ = s)),
              o !== r._v$2 && ne(t, "class", (r._v$2 = o)),
              r
            );
          },
          { _v$: void 0, _v$2: void 0 }
        ),
        e
      );
    }
  },
  tt = se(
    '<figure><img alt="Bot avatar" class="rounded-full object-cover w-full h-full">'
  ),
  rt = (e) => {
    const [t, r] = x(e.initialAvatarSrc);
    return (
      _(() => {
        t()?.startsWith("{{") &&
          e.initialAvatarSrc?.startsWith("http") &&
          r(e.initialAvatarSrc);
      }),
      U(X, {
        get when() {
          return ((e) => null != e && "" !== e)(t());
        },
        keyed: !0,
        get fallback() {
          return U(et, {});
        },
        get children() {
          const e = tt(),
            r = e.firstChild;
          return (
            k(
              (s) => {
                var o =
                    "flex justify-center items-center rounded-full text-white relative flex-shrink-0 " +
                    (Ie() ? "w-6 h-6 text-sm" : "w-10 h-10 text-xl"),
                  n = t();
                return (
                  o !== s._v$ && ie(e, (s._v$ = o)),
                  n !== s._v$2 && ne(r, "src", (s._v$2 = n)),
                  s
                );
              },
              { _v$: void 0, _v$2: void 0 }
            ),
            e
          );
        },
      })
    );
  };
class st {
  source;
  flags;
  constructor(e, t = "") {
    (this.source = e.source), (this.flags = t);
  }
  setGroup(e, t) {
    let r = "string" == typeof t ? t : t.source;
    return (
      (r = r.replace(/(^|[^\[])\^/g, "$1")),
      (this.source = this.source.replace(e, r)),
      this
    );
  }
  getRegexp() {
    return new RegExp(this.source, this.flags);
  }
}
const ot = /[&<>"']/,
  nt = /[&<>"']/g,
  it = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
  at = /[<>"']|&(?!#?\w+;)/,
  lt = /[<>"']|&(?!#?\w+;)/g;
function ct(e, t) {
  if (t) {
    if (ot.test(e)) return e.replace(nt, (e) => it[e]);
  } else if (at.test(e)) return e.replace(lt, (e) => it[e]);
  return e;
}
function ht(e) {
  return e.replace(
    /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
    function (e, t) {
      return "colon" === (t = t.toLowerCase())
        ? ":"
        : "#" === t.charAt(0)
        ? "x" === t.charAt(1)
          ? String.fromCharCode(parseInt(t.substring(2), 16))
          : String.fromCharCode(+t.substring(1))
        : "";
    }
  );
}
var pt;
((pt = Oe = Oe || {})[(pt.space = 1)] = "space"),
  (pt[(pt.text = 2)] = "text"),
  (pt[(pt.paragraph = 3)] = "paragraph"),
  (pt[(pt.heading = 4)] = "heading"),
  (pt[(pt.listStart = 5)] = "listStart"),
  (pt[(pt.listEnd = 6)] = "listEnd"),
  (pt[(pt.looseItemStart = 7)] = "looseItemStart"),
  (pt[(pt.looseItemEnd = 8)] = "looseItemEnd"),
  (pt[(pt.listItemStart = 9)] = "listItemStart"),
  (pt[(pt.listItemEnd = 10)] = "listItemEnd"),
  (pt[(pt.blockquoteStart = 11)] = "blockquoteStart"),
  (pt[(pt.blockquoteEnd = 12)] = "blockquoteEnd"),
  (pt[(pt.code = 13)] = "code"),
  (pt[(pt.table = 14)] = "table"),
  (pt[(pt.html = 15)] = "html"),
  (pt[(pt.hr = 16)] = "hr");
class ut {
  gfm = !0;
  tables = !0;
  breaks = !1;
  pedantic = !1;
  sanitize = !1;
  sanitizer;
  mangle = !0;
  smartLists = !1;
  silent = !1;
  highlight;
  langPrefix = "lang-";
  smartypants = !1;
  headerPrefix = "";
  renderer;
  xhtml = !1;
  escape = ct;
  unescape = ht;
  isNoP;
}
class dt {
  options;
  constructor(e) {
    this.options = e || bt.options;
  }
  code(e, t, r, s) {
    this.options.highlight &&
      null != (o = this.options.highlight(e, t)) &&
      o !== e &&
      ((r = !0), (e = o));
    var o = r ? e : this.options.escape(e, !0);
    return t
      ? `\n<pre><code class="${
          this.options.langPrefix + this.options.escape(t, !0)
        }">${o}\n</code></pre>\n`
      : `\n<pre><code>${o}\n</code></pre>\n`;
  }
  blockquote(e) {
    return `<blockquote>\n${e}</blockquote>\n`;
  }
  html(e) {
    return e;
  }
  heading(e, t, r) {
    return `<h${t} id="${
      this.options.headerPrefix + r.toLowerCase().replace(/[^\w]+/g, "-")
    }">${e}</h${t}>\n`;
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(e, t) {
    return `\n<${(t = t ? "ol" : "ul")}>\n${e}</${t}>\n`;
  }
  listitem(e) {
    return "<li>" + e + "</li>\n";
  }
  paragraph(e) {
    return "<p>" + e + "</p>\n";
  }
  table(e, t) {
    return `\n<table>\n<thead>\n${e}</thead>\n<tbody>\n${t}</tbody>\n</table>\n`;
  }
  tablerow(e) {
    return "<tr>\n" + e + "</tr>\n";
  }
  tablecell(e, t) {
    var r = t.header ? "th" : "td";
    return (
      (t.align
        ? "<" + r + ' style="text-align:' + t.align + '">'
        : "<" + r + ">") +
      e +
      "</" +
      r +
      ">\n"
    );
  }
  strong(e) {
    return "<strong>" + e + "</strong>";
  }
  em(e) {
    return "<em>" + e + "</em>";
  }
  codespan(e) {
    return "<code>" + e + "</code>";
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(e) {
    return "<del>" + e + "</del>";
  }
  link(e, t, r) {
    if (this.options.sanitize) {
      let s;
      try {
        s = decodeURIComponent(this.options.unescape(e))
          .replace(/[^\w:]/g, "")
          .toLowerCase();
      } catch (t) {
        return r;
      }
      if (
        0 === s.indexOf("javascript:") ||
        0 === s.indexOf("vbscript:") ||
        0 === s.indexOf("data:")
      )
        return r;
    }
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + t + '"'), s + ">" + r + "</a>";
  }
  image(e, t, r) {
    let s = '<img src="' + e + '" alt="' + r + '"';
    return (
      t && (s += ' title="' + t + '"'), s + (this.options.xhtml ? "/>" : ">")
    );
  }
  text(e) {
    return e;
  }
}
class ft {
  staticThis;
  links;
  options;
  static rulesBase = null;
  static rulesPedantic = null;
  static rulesGfm = null;
  static rulesBreaks = null;
  rules;
  renderer;
  inLink;
  hasRulesGfm;
  ruleCallbacks;
  constructor(e, t, r = bt.options, s) {
    if (
      ((this.staticThis = e),
      (this.links = t),
      (this.options = r),
      (this.renderer = s || this.options.renderer || new dt(this.options)),
      !this.links)
    )
      throw new Error("InlineLexer requires 'links' parameter.");
    this.setRules();
  }
  static output(e, t, r) {
    return new this(this, t, r).output(e);
  }
  static getRulesBase() {
    var e;
    return (
      this.rulesBase ||
      (((e = {
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
        _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
        _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,
      }).link = new st(e.link)
        .setGroup("inside", e._inside)
        .setGroup("href", e._href)
        .getRegexp()),
      (e.reflink = new st(e.reflink).setGroup("inside", e._inside).getRegexp()),
      (this.rulesBase = e))
    );
  }
  static getRulesPedantic() {
    return (
      this.rulesPedantic ||
      (this.rulesPedantic = {
        ...this.getRulesBase(),
        strong:
          /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
      })
    );
  }
  static getRulesGfm() {
    var e, t, r;
    return (
      this.rulesGfm ||
      ((e = this.getRulesBase()),
      (t = new st(e.escape).setGroup("])", "~|])").getRegexp()),
      (r = new st(e.text)
        .setGroup("]|", "~]|")
        .setGroup("|", "|https?://|")
        .getRegexp()),
      (this.rulesGfm = {
        ...e,
        escape: t,
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: r,
      }))
    );
  }
  static getRulesBreaks() {
    var e, t;
    return (
      this.rulesBreaks ||
      ((e = this.getRulesGfm()),
      (t = this.getRulesGfm()),
      (this.rulesBreaks = {
        ...t,
        br: new st(e.br).setGroup("{2,}", "*").getRegexp(),
        text: new st(t.text).setGroup("{2,}", "*").getRegexp(),
      }))
    );
  }
  setRules() {
    this.options.gfm
      ? this.options.breaks
        ? (this.rules = this.staticThis.getRulesBreaks())
        : (this.rules = this.staticThis.getRulesGfm())
      : this.options.pedantic
      ? (this.rules = this.staticThis.getRulesPedantic())
      : (this.rules = this.staticThis.getRulesBase()),
      (this.hasRulesGfm = void 0 !== this.rules.url);
  }
  output(e) {
    let t,
      r = "";
    for (; e; )
      if ((t = this.rules.escape.exec(e)))
        (e = e.substring(t[0].length)), (r += t[1]);
      else if ((t = this.rules.autolink.exec(e))) {
        let s, o;
        (e = e.substring(t[0].length)),
          (o =
            "@" === t[2]
              ? ((s = this.options.escape(
                  ":" === t[1].charAt(6)
                    ? this.mangle(t[1].substring(7))
                    : this.mangle(t[1])
                )),
                this.mangle("mailto:") + s)
              : (s = this.options.escape(t[1]))),
          (r += this.renderer.link(o, null, s));
      } else if (
        !this.inLink &&
        this.hasRulesGfm &&
        (t = this.rules.url.exec(e))
      ) {
        e = e.substring(t[0].length);
        var s = this.options.escape(t[1]);
        r += this.renderer.link(s, null, s);
      } else if ((t = this.rules.tag.exec(e)))
        !this.inLink && /^<a /i.test(t[0])
          ? (this.inLink = !0)
          : this.inLink && /^<\/a>/i.test(t[0]) && (this.inLink = !1),
          (e = e.substring(t[0].length)),
          (r += this.options.sanitize
            ? this.options.sanitizer
              ? this.options.sanitizer(t[0])
              : this.options.escape(t[0])
            : t[0]);
      else if ((t = this.rules.link.exec(e)))
        (e = e.substring(t[0].length)),
          (this.inLink = !0),
          (r += this.outputLink(t, { href: t[2], title: t[3] })),
          (this.inLink = !1);
      else if (
        (t = (t = this.rules.reflink.exec(e)) || this.rules.nolink.exec(e))
      ) {
        e = e.substring(t[0].length);
        s = (t[2] || t[1]).replace(/\s+/g, " ");
        var o = this.links[s.toLowerCase()];
        o && o.href
          ? ((this.inLink = !0),
            (r += this.outputLink(t, o)),
            (this.inLink = !1))
          : ((r += t[0].charAt(0)), (e = t[0].substring(1) + e));
      } else if ((t = this.rules.strong.exec(e)))
        (e = e.substring(t[0].length)),
          (r += this.renderer.strong(this.output(t[2] || t[1])));
      else if ((t = this.rules.em.exec(e)))
        (e = e.substring(t[0].length)),
          (r += this.renderer.em(this.output(t[2] || t[1])));
      else if ((t = this.rules.code.exec(e)))
        (e = e.substring(t[0].length)),
          (r += this.renderer.codespan(this.options.escape(t[2].trim(), !0)));
      else if ((t = this.rules.br.exec(e)))
        (e = e.substring(t[0].length)), (r += this.renderer.br());
      else if (this.hasRulesGfm && (t = this.rules.del.exec(e)))
        (e = e.substring(t[0].length)),
          (r += this.renderer.del(this.output(t[1])));
      else if ((t = this.rules.text.exec(e)))
        (e = e.substring(t[0].length)),
          (r += this.renderer.text(
            this.options.escape(this.smartypants(t[0]))
          ));
      else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
    return r;
  }
  outputLink(e, t) {
    var r = this.options.escape(t.href);
    t = t.title ? this.options.escape(t.title) : null;
    return "!" !== e[0].charAt(0)
      ? this.renderer.link(r, t, this.output(e[1]))
      : this.renderer.image(r, t, this.options.escape(e[1]));
  }
  smartypants(e) {
    return this.options.smartypants
      ? e
          .replace(/---/g, "—")
          .replace(/--/g, "–")
          .replace(/(^|[-\u2014/([{"\s])'/g, "$1‘")
          .replace(/'/g, "’")
          .replace(/(^|[-\u2014/([{\u2018\s])"/g, "$1“")
          .replace(/"/g, "”")
          .replace(/\.{3}/g, "…")
      : e;
  }
  mangle(e) {
    if (!this.options.mangle) return e;
    let t = "";
    var r = e.length;
    for (let s = 0; s < r; s++) {
      let r;
      0.5 < Math.random() && (r = "x" + e.charCodeAt(s).toString(16)),
        (t += "&#" + r + ";");
    }
    return t;
  }
}
class gt {
  simpleRenderers = [];
  tokens;
  token;
  inlineLexer;
  options;
  renderer;
  line = 0;
  constructor(e) {
    (this.tokens = []),
      (this.token = null),
      (this.options = e || bt.options),
      (this.renderer = this.options.renderer || new dt(this.options));
  }
  static parse(e, t, r) {
    return new this(r).parse(t, e);
  }
  parse(e, t) {
    (this.inlineLexer = new ft(ft, e, this.options, this.renderer)),
      (this.tokens = t.reverse());
    let r = "";
    for (; this.next(); ) r += this.tok();
    return r;
  }
  debug(e, t) {
    (this.inlineLexer = new ft(ft, e, this.options, this.renderer)),
      (this.tokens = t.reverse());
    let r = "";
    for (; this.next(); ) {
      var s = this.tok();
      (this.token.line = this.line += s.split("\n").length - 1), (r += s);
    }
    return r;
  }
  next() {
    return (this.token = this.tokens.pop());
  }
  getNextElement() {
    return this.tokens[this.tokens.length - 1];
  }
  parseText() {
    let e = this.token.text;
    for (var t; (t = this.getNextElement()) && t.type == Oe.text; )
      e += "\n" + this.next().text;
    return this.inlineLexer.output(e);
  }
  tok() {
    switch (this.token.type) {
      case Oe.space:
        return "";
      case Oe.paragraph:
        return this.renderer.paragraph(
          this.inlineLexer.output(this.token.text)
        );
      case Oe.text:
        return this.options.isNoP
          ? this.parseText()
          : this.renderer.paragraph(this.parseText());
      case Oe.heading:
        return this.renderer.heading(
          this.inlineLexer.output(this.token.text),
          this.token.depth,
          this.token.text
        );
      case Oe.listStart: {
        let t = "";
        for (var e = this.token.ordered; this.next().type != Oe.listEnd; )
          t += this.tok();
        return this.renderer.list(t, e);
      }
      case Oe.listItemStart: {
        let e = "";
        for (; this.next().type != Oe.listItemEnd; )
          e += this.token.type == Oe.text ? this.parseText() : this.tok();
        return this.renderer.listitem(e);
      }
      case Oe.looseItemStart: {
        let e = "";
        for (; this.next().type != Oe.listItemEnd; ) e += this.tok();
        return this.renderer.listitem(e);
      }
      case Oe.code:
        return this.renderer.code(
          this.token.text,
          this.token.lang,
          this.token.escaped,
          this.token.meta
        );
      case Oe.table: {
        e = "";
        let s,
          o = "";
        s = "";
        for (let e = 0; e < this.token.header.length; e++) {
          var t = { header: !0, align: this.token.align[e] },
            r = this.inlineLexer.output(this.token.header[e]);
          s += this.renderer.tablecell(r, t);
        }
        e += this.renderer.tablerow(s);
        for (const e of this.token.cells) {
          s = "";
          for (let t = 0; t < e.length; t++)
            s += this.renderer.tablecell(this.inlineLexer.output(e[t]), {
              header: !1,
              align: this.token.align[t],
            });
          o += this.renderer.tablerow(s);
        }
        return this.renderer.table(e, o);
      }
      case Oe.blockquoteStart: {
        let e = "";
        for (; this.next().type != Oe.blockquoteEnd; ) e += this.tok();
        return this.renderer.blockquote(e);
      }
      case Oe.hr:
        return this.renderer.hr();
      case Oe.html:
        return (
          (e =
            this.token.pre || this.options.pedantic
              ? this.token.text
              : this.inlineLexer.output(this.token.text)),
          this.renderer.html(e)
        );
      default:
        if (this.simpleRenderers.length)
          for (let e = 0; e < this.simpleRenderers.length; e++)
            if (this.token.type == "simpleRule" + (e + 1))
              return this.simpleRenderers[e].call(
                this.renderer,
                this.token.execArr
              );
        if (
          ((e = `Token with "${this.token.type}" type was not found.`),
          !this.options.silent)
        )
          throw new Error(e);
        console.log(e);
    }
  }
}
class bt {
  static options = new ut();
  static simpleRenderers = [];
  static setOptions(e) {
    return Object.assign(this.options, e), this;
  }
  static setBlockRule(e, t = () => "") {
    return wt.simpleRules.push(e), this.simpleRenderers.push(t), this;
  }
  static parse(e, t) {
    try {
      t = { ...this.options, ...t };
      var { tokens: r, links: s } = this.callBlockLexer(e, t);
      return this.callParser(r, s, t);
    } catch (e) {
      return this.callMe(e);
    }
  }
  static debug(e, t = this.options) {
    var { tokens: e, links: r } = this.callBlockLexer(e, t);
    let s = e.slice();
    return (
      ((t = new gt(t)).simpleRenderers = this.simpleRenderers),
      (t = t.debug(r, e)),
      {
        tokens: (s = s.map((e) => {
          e.type = Oe[e.type] || e.type;
          var t = e.line;
          return delete e.line, t ? { line: t, ...e } : e;
        })),
        links: r,
        result: t,
      }
    );
  }
  static callBlockLexer(e = "", t) {
    if ("string" != typeof e)
      throw new Error(
        `Expected that the 'src' parameter would have a 'string' type, got '${typeof e}'`
      );
    return (
      (e = e
        .replace(/\r\n|\r/g, "\n")
        .replace(/\t/g, "    ")
        .replace(/\u00a0/g, " ")
        .replace(/\u2424/g, "\n")
        .replace(/^ +$/gm, "")),
      wt.lex(e, t, !0)
    );
  }
  static callParser(e, t, r) {
    var s;
    return this.simpleRenderers.length
      ? (((s = new gt(r)).simpleRenderers = this.simpleRenderers),
        s.parse(t, e))
      : gt.parse(e, t, r);
  }
  static callMe(e) {
    if (
      ((e.message +=
        "\nPlease report this to https://github.com/ts-stack/markdown"),
      this.options.silent)
    )
      return (
        "<p>An error occured:</p><pre>" +
        this.options.escape(e.message + "", !0) +
        "</pre>"
      );
    throw e;
  }
}
class wt {
  staticThis;
  static simpleRules = [];
  static rulesBase = null;
  static rulesGfm = null;
  static rulesTables = null;
  rules;
  options;
  links = {};
  tokens = [];
  hasRulesGfm;
  hasRulesTables;
  constructor(e, t) {
    (this.staticThis = e), (this.options = t || bt.options), this.setRules();
  }
  static lex(e, t, r, s) {
    return new this(this, t).getTokens(e, r, s);
  }
  static getRulesBase() {
    var e, t;
    return (
      this.rulesBase ||
      (((e = {
        newline: /^\n+/,
        code: /^( {4}[^\n]+\n*)+/,
        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
        lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
        blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
        list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
        html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
        paragraph:
          /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
        text: /^[^\n]+/,
        bullet: /(?:[*+-]|\d+\.)/,
        item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
      }).item = new st(e.item, "gm").setGroup(/bull/g, e.bullet).getRegexp()),
      (e.list = new st(e.list)
        .setGroup(/bull/g, e.bullet)
        .setGroup("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")
        .setGroup("def", "\\n+(?=" + e.def.source + ")")
        .getRegexp()),
      (t =
        "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b"),
      (e.html = new st(e.html)
        .setGroup("comment", /<!--[\s\S]*?-->/)
        .setGroup("closed", /<(tag)[\s\S]+?<\/\1>/)
        .setGroup("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
        .setGroup(/tag/g, t)
        .getRegexp()),
      (e.paragraph = new st(e.paragraph)
        .setGroup("hr", e.hr)
        .setGroup("heading", e.heading)
        .setGroup("lheading", e.lheading)
        .setGroup("blockquote", e.blockquote)
        .setGroup("tag", "<" + t)
        .setGroup("def", e.def)
        .getRegexp()),
      (this.rulesBase = e))
    );
  }
  static getRulesGfm() {
    var e, t, r, s;
    return (
      this.rulesGfm ||
      ((r = (t = {
        ...(e = this.getRulesBase()),
        fences:
          /^ *(`{3,}|~{3,})[ \.]*((\S+)? *[^\n]*)\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/,
        heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/,
      }).fences.source.replace("\\1", "\\2")),
      (s = e.list.source.replace("\\1", "\\3")),
      (t.paragraph = new st(e.paragraph)
        .setGroup("(?!", `(?!${r}|${s}|`)
        .getRegexp()),
      (this.rulesGfm = t))
    );
  }
  static getRulesTable() {
    return (
      this.rulesTables ||
      (this.rulesTables = {
        ...this.getRulesGfm(),
        nptable:
          /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
      })
    );
  }
  setRules() {
    this.options.gfm
      ? this.options.tables
        ? (this.rules = this.staticThis.getRulesTable())
        : (this.rules = this.staticThis.getRulesGfm())
      : (this.rules = this.staticThis.getRulesBase()),
      (this.hasRulesGfm = void 0 !== this.rules.fences),
      (this.hasRulesTables = void 0 !== this.rules.table);
  }
  getTokens(e, t, r) {
    let s,
      o = e;
    e: for (; o; )
      if (
        ((s = this.rules.newline.exec(o)) &&
          ((o = o.substring(s[0].length)), 1 < s[0].length) &&
          this.tokens.push({ type: Oe.space }),
        (s = this.rules.code.exec(o)))
      ) {
        o = o.substring(s[0].length);
        var n = s[0].replace(/^ {4}/gm, "");
        this.tokens.push({
          type: Oe.code,
          text: this.options.pedantic ? n : n.replace(/\n+$/, ""),
        });
      } else if (this.hasRulesGfm && (s = this.rules.fences.exec(o)))
        (o = o.substring(s[0].length)),
          this.tokens.push({
            type: Oe.code,
            meta: s[2],
            lang: s[3],
            text: s[4] || "",
          });
      else if ((s = this.rules.heading.exec(o)))
        (o = o.substring(s[0].length)),
          this.tokens.push({
            type: Oe.heading,
            depth: s[1].length,
            text: s[2],
          });
      else if (t && this.hasRulesTables && (s = this.rules.nptable.exec(o))) {
        o = o.substring(s[0].length);
        var i = {
          type: Oe.table,
          header: s[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
          align: s[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
          cells: [],
        };
        for (let e = 0; e < i.align.length; e++)
          /^ *-+: *$/.test(i.align[e])
            ? (i.align[e] = "right")
            : /^ *:-+: *$/.test(i.align[e])
            ? (i.align[e] = "center")
            : /^ *:-+ *$/.test(i.align[e])
            ? (i.align[e] = "left")
            : (i.align[e] = null);
        var a = s[3].replace(/\n$/, "").split("\n");
        for (let e = 0; e < a.length; e++) i.cells[e] = a[e].split(/ *\| */);
        this.tokens.push(i);
      } else if ((s = this.rules.lheading.exec(o)))
        (o = o.substring(s[0].length)),
          this.tokens.push({
            type: Oe.heading,
            depth: "=" === s[2] ? 1 : 2,
            text: s[1],
          });
      else if ((s = this.rules.hr.exec(o)))
        (o = o.substring(s[0].length)), this.tokens.push({ type: Oe.hr });
      else if ((s = this.rules.blockquote.exec(o)))
        (o = o.substring(s[0].length)),
          this.tokens.push({ type: Oe.blockquoteStart }),
          (n = s[0].replace(/^ *> ?/gm, "")),
          this.getTokens(n),
          this.tokens.push({ type: Oe.blockquoteEnd });
      else if ((s = this.rules.list.exec(o))) {
        o = o.substring(s[0].length);
        var l,
          c = s[2],
          h =
            (this.tokens.push({ type: Oe.listStart, ordered: 1 < c.length }),
            s[0].match(this.rules.item)),
          p = h.length;
        let e,
          t = !1;
        for (let s = 0; s < p; s++) {
          let n = h[s];
          (l = n.length),
            -1 !== (n = n.replace(/^ *([*+-]|\d+\.) +/, "")).indexOf("\n ") &&
              ((l -= n.length),
              (n = this.options.pedantic
                ? n.replace(/^ {1,4}/gm, "")
                : n.replace(new RegExp("^ {1," + l + "}", "gm"), ""))),
            !this.options.smartLists ||
              s === p - 1 ||
              c ===
                (l = this.staticThis.getRulesBase().bullet.exec(h[s + 1])[0]) ||
              (1 < c.length && 1 < l.length) ||
              ((o = h.slice(s + 1).join("\n") + o), (s = p - 1)),
            (e = t || /\n\n(?!\s*$)/.test(n)),
            s !== p - 1 &&
              ((t = "\n" === n.charAt(n.length - 1)), (e = e || t)),
            this.tokens.push({
              type: e ? Oe.looseItemStart : Oe.listItemStart,
            }),
            this.getTokens(n, !1, r),
            this.tokens.push({ type: Oe.listItemEnd });
        }
        this.tokens.push({ type: Oe.listEnd });
      } else if ((s = this.rules.html.exec(o))) {
        o = o.substring(s[0].length);
        var u = s[1];
        this.tokens.push({
          type: this.options.sanitize ? Oe.paragraph : Oe.html,
          pre:
            !this.options.sanitizer &&
            ("pre" === u || "script" === u || "style" === u),
          text: s[0],
        });
      } else if (t && (s = this.rules.def.exec(o)))
        (o = o.substring(s[0].length)),
          (this.links[s[1].toLowerCase()] = { href: s[2], title: s[3] });
      else if (t && this.hasRulesTables && (s = this.rules.table.exec(o))) {
        o = o.substring(s[0].length);
        var d = {
          type: Oe.table,
          header: s[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
          align: s[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
          cells: [],
        };
        for (let e = 0; e < d.align.length; e++)
          /^ *-+: *$/.test(d.align[e])
            ? (d.align[e] = "right")
            : /^ *:-+: *$/.test(d.align[e])
            ? (d.align[e] = "center")
            : /^ *:-+ *$/.test(d.align[e])
            ? (d.align[e] = "left")
            : (d.align[e] = null);
        var f = s[3].replace(/(?: *\| *)?\n$/, "").split("\n");
        for (let e = 0; e < f.length; e++)
          d.cells[e] = f[e].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
        this.tokens.push(d);
      } else {
        if (this.staticThis.simpleRules.length) {
          var g = this.staticThis.simpleRules;
          for (let e = 0; e < g.length; e++)
            if ((s = g[e].exec(o))) {
              o = o.substring(s[0].length);
              var b = "simpleRule" + (e + 1);
              this.tokens.push({ type: b, execArr: s });
              continue e;
            }
        }
        if (t && (s = this.rules.paragraph.exec(o)))
          (o = o.substring(s[0].length)),
            "\n" === s[1].slice(-1)
              ? this.tokens.push({
                  type: Oe.paragraph,
                  text: s[1].slice(0, -1),
                })
              : this.tokens.push({
                  type: 0 < this.tokens.length ? Oe.paragraph : Oe.text,
                  text: s[1],
                });
        else if ((s = this.rules.text.exec(o)))
          (o = o.substring(s[0].length)),
            this.tokens.push({ type: Oe.text, text: s[0] });
        else if (o)
          throw new Error(
            "Infinite loop on byte: " +
              o.charCodeAt(0) +
              `, near text '${o.slice(0, 30)}...'`
          );
      }
    return { tokens: this.tokens, links: this.links };
  }
}
const mt = se(
    '<div class="flex justify-end mb-2 items-end guest-container"><span class="px-4 py-2 mr-2 whitespace-pre-wrap max-w-full chatbot-guest-bubble" data-testid="guest-bubble">'
  ),
  yt =
    (bt.setOptions({ isNoP: !0 }),
    (e) => {
      let t;
      P(() => {
        t && (t.innerHTML = bt.parse(e.message));
      });
      {
        const r = mt(),
          s = r.firstChild;
        r.style.setProperty("margin-left", "50px");
        return (
          "function" == typeof t ? le(t, s) : (t = s),
          s.style.setProperty("border-radius", "6px"),
          ce(
            r,
            U(X, {
              get when() {
                return e.showAvatar;
              },
              get children() {
                return U(rt, {
                  get initialAvatarSrc() {
                    return e.avatarSrc;
                  },
                });
              },
            }),
            null
          ),
          k(
            (t) => {
              var r = e.backgroundColor ?? "#3B81F6",
                o = e.textColor ?? "#ffffff";
              return (
                r !== t._v$ &&
                  (null != (t._v$ = r)
                    ? s.style.setProperty("background-color", r)
                    : s.style.removeProperty("background-color")),
                o !== t._v$2 &&
                  (null != (t._v$2 = o)
                    ? s.style.setProperty("color", o)
                    : s.style.removeProperty("color")),
                t
              );
            },
            { _v$: void 0, _v$2: void 0 }
          ),
          r
        );
      }
    }),
  vt = se(
    '<div class="flex justify-start mb-2 items-start host-container"><span class="px-4 py-2 ml-2 max-w-full chatbot-host-bubble prose" data-testid="host-bubble">'
  ),
  xt =
    (bt.setOptions({ isNoP: !0 }),
    (e) => {
      let t;
      P(() => {
        if (
          t &&
          ((t.innerHTML = bt.parse(e.message)), e.fileAnnotations) &&
          e.fileAnnotations.length
        )
          for (const o of e.fileAnnotations) {
            var r = document.createElement("button"),
              s =
                ((r.textContent = o.fileName),
                (r.className =
                  "py-2 px-4 mb-2 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 file-annotation-button"),
                r.addEventListener("click", function () {
                  (async (t) => {
                    try {
                      var r = await je({
                          apiHost: e.apiHost,
                          body: {
                            question: "",
                            history: [],
                            fileName: t.fileName,
                          },
                        }),
                        s = new Blob([r.data]),
                        o = window.URL.createObjectURL(s),
                        n = document.createElement("a");
                      (n.href = o),
                        (n.download = t.fileName),
                        document.body.appendChild(n),
                        n.click(),
                        n.remove();
                    } catch (t) {
                      console.error("Download failed:", t);
                    }
                  })(o);
                }),
                document.createElement("div"));
            (s.className = "ml-2"),
              (s.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>'),
              r.appendChild(s),
              t.appendChild(r);
          }
      });
      {
        const r = vt(),
          s = r.firstChild;
        r.style.setProperty("margin-right", "50px"),
          ce(
            r,
            U(X, {
              get when() {
                return e.showAvatar;
              },
              get children() {
                return U(rt, {
                  get initialAvatarSrc() {
                    return e.avatarSrc;
                  },
                });
              },
            }),
            s
          );
        return (
          "function" == typeof t ? le(t, s) : (t = s),
          s.style.setProperty("border-radius", "6px"),
          k(
            (t) => {
              var r = e.backgroundColor ?? "#f7f8ff",
                o = e.textColor ?? "#303235";
              return (
                r !== t._v$ &&
                  (null != (t._v$ = r)
                    ? s.style.setProperty("background-color", r)
                    : s.style.removeProperty("background-color")),
                o !== t._v$2 &&
                  (null != (t._v$2 = o)
                    ? s.style.setProperty("color", o)
                    : s.style.removeProperty("color")),
                t
              );
            },
            { _v$: void 0, _v$2: void 0 }
          ),
          r
        );
      }
    }),
  kt = se(
    '<div class="flex items-center"><div class="w-2 h-2 mr-1 rounded-full bubble1"></div><div class="w-2 h-2 mr-1 rounded-full bubble2"></div><div class="w-2 h-2 rounded-full bubble3">'
  ),
  _t = () => kt(),
  Ct = se(
    '<div class="flex justify-start mb-2 items-start animate-fade-in host-container"><span class="px-4 py-4 ml-2 whitespace-pre-wrap max-w-full chatbot-host-bubble" data-testid="host-bubble">'
  ),
  St = () => {
    return ce((e = Ct()).firstChild, U(_t, {})), e;
    var e;
  },
  Pt = se(
    '<div data-modal-target="defaultModal" data-modal-toggle="defaultModal" class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"><span class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble" data-testid="host-bubble">'
  ),
  At = (e) => {
    return (
      (r = (t = Pt()).firstChild),
      (t.$$click = () => e.onSourceClick?.()),
      r.style.setProperty("width", "max-content"),
      r.style.setProperty("max-width", "80px"),
      r.style.setProperty("font-size", "13px"),
      r.style.setProperty("border-radius", "15px"),
      r.style.setProperty("cursor", "pointer"),
      r.style.setProperty("text-overflow", "ellipsis"),
      r.style.setProperty("overflow", "hidden"),
      r.style.setProperty("white-space", "nowrap"),
      ce(r, () => e.pageContent),
      t
    );
    var t, r;
  },
  Tt =
    (oe(["click"]),
    se(
      '<div data-modal-target="defaultModal" data-modal-toggle="defaultModal" class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"><span class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble" data-testid="host-bubble">'
    )),
  Et = (e) => {
    return (
      (r = (t = Tt()).firstChild),
      (t.$$click = () => e.onPromptClick?.()),
      r.style.setProperty("width", "max-content"),
      r.style.setProperty("font-size", "15px"),
      r.style.setProperty("border-radius", "15px"),
      r.style.setProperty("cursor", "pointer"),
      ce(r, () => e.prompt),
      t
    );
    var t, r;
  },
  $t =
    (oe(["click"]),
    se(
      '<span>Powered by<a href="https://lionai.pro" target="_blank" rel="noopener noreferrer" class="lite-badge" id="lite-badge"><span> LionAi'
    )),
  Rt = "#303235",
  Ot = (e) => {
    let t, r;
    const s = (r) => {
      r.forEach((r) => {
        r.removedNodes.forEach((r) => {
          "id" in r &&
            t &&
            "lite-badge" == r.id &&
            (console.log("Sorry, you can't remove the brand 😅"),
            e.botContainer?.append(t));
        });
      });
    };
    P(() => {
      document &&
        e.botContainer &&
        (r = new MutationObserver(s)).observe(e.botContainer, {
          subtree: !1,
          childList: !0,
        });
    }),
      A(() => {
        r && r.disconnect();
      });
    {
      const r = $t(),
        s = r.firstChild.nextSibling;
      r.style.setProperty("font-size", "13px"),
        r.style.setProperty("position", "absolute"),
        r.style.setProperty("bottom", "0"),
        r.style.setProperty("padding", "10px"),
        r.style.setProperty("margin", "auto"),
        r.style.setProperty("width", "100%"),
        r.style.setProperty("text-align", "center");
      return (
        "function" == typeof t ? le(t, s) : (t = s),
        s.style.setProperty("font-weight", "bold"),
        k(
          (t) => {
            var o = e.poweredByTextColor ?? Rt,
              n = e.badgeBackgroundColor ?? "#ffffff",
              i = e.poweredByTextColor ?? Rt;
            return (
              o !== t._v$ &&
                (null != (t._v$ = o)
                  ? r.style.setProperty("color", o)
                  : r.style.removeProperty("color")),
              n !== t._v$2 &&
                (null != (t._v$2 = n)
                  ? r.style.setProperty("background-color", n)
                  : r.style.removeProperty("background-color")),
              i !== t._v$3 &&
                (null != (t._v$3 = i)
                  ? s.style.setProperty("color", i)
                  : s.style.removeProperty("color")),
              t
            );
          },
          { _v$: void 0, _v$2: void 0, _v$3: void 0 }
        ),
        r
      );
    }
  },
  Bt = Object.create(null),
  Lt =
    ((Bt.open = "0"),
    (Bt.close = "1"),
    (Bt.ping = "2"),
    (Bt.pong = "3"),
    (Bt.message = "4"),
    (Bt.upgrade = "5"),
    (Bt.noop = "6"),
    Object.create(null)),
  Nt =
    (Object.keys(Bt).forEach((e) => {
      Lt[Bt[e]] = e;
    }),
    { type: "error", data: "parser error" }),
  jt =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob &&
      "[object BlobConstructor]" === Object.prototype.toString.call(Blob)),
  zt = "function" == typeof ArrayBuffer,
  qt = (e) =>
    "function" == typeof ArrayBuffer.isView
      ? ArrayBuffer.isView(e)
      : e && e.buffer instanceof ArrayBuffer,
  It = ({ type: e, data: t }, r, s) =>
    jt && t instanceof Blob
      ? r
        ? s(t)
        : Mt(t, s)
      : zt && (t instanceof ArrayBuffer || qt(t))
      ? r
        ? s(t)
        : Mt(new Blob([t]), s)
      : s(Bt[e] + (t || "")),
  Mt = (e, t) => {
    const r = new FileReader();
    return (
      (r.onload = function () {
        var e = r.result.split(",")[1];
        t("b" + (e || ""));
      }),
      r.readAsDataURL(e)
    );
  };
function Dt(e) {
  return e instanceof Uint8Array
    ? e
    : e instanceof ArrayBuffer
    ? new Uint8Array(e)
    : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let Ut;
const Ft = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  Ht = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256);
for (let e = 0; e < 64; e++) Ht[Ft.charCodeAt(e)] = e;
const Gt = "function" == typeof ArrayBuffer,
  Wt = (e, t) => {
    var r;
    return "string" != typeof e
      ? { type: "message", data: Yt(e, t) }
      : "b" === (r = e.charAt(0))
      ? { type: "message", data: Vt(e.substring(1), t) }
      : Lt[r]
      ? 1 < e.length
        ? { type: Lt[r], data: e.substring(1) }
        : { type: Lt[r] }
      : Nt;
  },
  Vt = (e, t) => {
    var r;
    return Gt
      ? ((r = ((e) => {
          let t,
            r,
            s,
            o,
            n,
            i = 0.75 * e.length,
            a = e.length,
            l = 0;
          "=" === e[e.length - 1] && (i--, "=" === e[e.length - 2]) && i--;
          var c = new ArrayBuffer(i),
            h = new Uint8Array(c);
          for (t = 0; t < a; t += 4)
            (r = Ht[e.charCodeAt(t)]),
              (s = Ht[e.charCodeAt(t + 1)]),
              (o = Ht[e.charCodeAt(t + 2)]),
              (n = Ht[e.charCodeAt(t + 3)]),
              (h[l++] = (r << 2) | (s >> 4)),
              (h[l++] = ((15 & s) << 4) | (o >> 2)),
              (h[l++] = ((3 & o) << 6) | (63 & n));
          return c;
        })(e)),
        Yt(r, t))
      : { base64: !0, data: e };
  },
  Yt = (e, t) =>
    "blob" !== t
      ? e instanceof ArrayBuffer
        ? e
        : e.buffer
      : e instanceof Blob
      ? e
      : new Blob([e]),
  Xt = String.fromCharCode(30);
function Jt() {
  return new TransformStream({
    transform(e, t) {
      !(function (e, t) {
        jt && e.data instanceof Blob
          ? e.data.arrayBuffer().then(Dt).then(t)
          : zt && (e.data instanceof ArrayBuffer || qt(e.data))
          ? t(Dt(e.data))
          : It(e, !1, (e) => {
              (Ut = Ut || new TextEncoder()), t(Ut.encode(e));
            });
      })(e, (r) => {
        var s,
          o = r.length;
        let n;
        o < 126
          ? ((n = new Uint8Array(1)), new DataView(n.buffer).setUint8(0, o))
          : o < 65536
          ? ((n = new Uint8Array(3)),
            (s = new DataView(n.buffer)).setUint8(0, 126),
            s.setUint16(1, o))
          : ((n = new Uint8Array(9)),
            (s = new DataView(n.buffer)).setUint8(0, 127),
            s.setBigUint64(1, BigInt(o))),
          e.data && "string" != typeof e.data && (n[0] |= 128),
          t.enqueue(n),
          t.enqueue(r);
      });
    },
  });
}
let Kt;
function Qt(e) {
  return e.reduce((e, t) => e + t.length, 0);
}
function Zt(e, t) {
  if (e[0].length === t) return e.shift();
  var r = new Uint8Array(t);
  let s = 0;
  for (let o = 0; o < t; o++)
    (r[o] = e[0][s++]), s === e[0].length && (e.shift(), (s = 0));
  return e.length && s < e[0].length && (e[0] = e[0].slice(s)), r;
}
function er(e) {
  if (e)
    return (function (e) {
      for (var t in er.prototype) e[t] = er.prototype[t];
      return e;
    })(e);
}
(er.prototype.on = er.prototype.addEventListener =
  function (e, t) {
    return (
      (this._callbacks = this._callbacks || {}),
      (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t),
      this
    );
  }),
  (er.prototype.once = function (e, t) {
    function r() {
      this.off(e, r), t.apply(this, arguments);
    }
    return (r.fn = t), this.on(e, r), this;
  }),
  (er.prototype.off =
    er.prototype.removeListener =
    er.prototype.removeAllListeners =
    er.prototype.removeEventListener =
      function (e, t) {
        if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
          this._callbacks = {};
        else {
          var r = this._callbacks["$" + e];
          if (r)
            if (1 == arguments.length) delete this._callbacks["$" + e];
            else {
              for (var s, o = 0; o < r.length; o++)
                if ((s = r[o]) === t || s.fn === t) {
                  r.splice(o, 1);
                  break;
                }
              0 === r.length && delete this._callbacks["$" + e];
            }
        }
        return this;
      }),
  (er.prototype.emit = function (e) {
    this._callbacks = this._callbacks || {};
    for (
      var t = new Array(arguments.length - 1),
        r = this._callbacks["$" + e],
        s = 1;
      s < arguments.length;
      s++
    )
      t[s - 1] = arguments[s];
    if (r) {
      s = 0;
      for (var o = (r = r.slice(0)).length; s < o; ++s) r[s].apply(this, t);
    }
    return this;
  }),
  (er.prototype.emitReserved = er.prototype.emit),
  (er.prototype.listeners = function (e) {
    return (
      (this._callbacks = this._callbacks || {}), this._callbacks["$" + e] || []
    );
  }),
  (er.prototype.hasListeners = function (e) {
    return !!this.listeners(e).length;
  });
const tr =
  "undefined" != typeof self
    ? self
    : "undefined" != typeof window
    ? window
    : Function("return this")();
function rr(e, ...t) {
  return t.reduce((t, r) => (e.hasOwnProperty(r) && (t[r] = e[r]), t), {});
}
const sr = tr.setTimeout,
  or = tr.clearTimeout;
function nr(e, t) {
  t.useNativeTimers
    ? ((e.setTimeoutFn = sr.bind(tr)), (e.clearTimeoutFn = or.bind(tr)))
    : ((e.setTimeoutFn = tr.setTimeout.bind(tr)),
      (e.clearTimeoutFn = tr.clearTimeout.bind(tr)));
}
function ir(e) {
  return "string" == typeof e
    ? (function (e) {
        let t,
          r = 0;
        for (let s = 0, o = e.length; s < o; s++)
          (t = e.charCodeAt(s)) < 128
            ? (r += 1)
            : t < 2048
            ? (r += 2)
            : t < 55296 || 57344 <= t
            ? (r += 3)
            : (s++, (r += 4));
        return r;
      })(e)
    : Math.ceil(1.33 * (e.byteLength || e.size));
}
class ar extends Error {
  constructor(e, t, r) {
    super(e),
      (this.description = t),
      (this.context = r),
      (this.type = "TransportError");
  }
}
class lr extends er {
  constructor(e) {
    super(),
      (this.writable = !1),
      nr(this, e),
      (this.opts = e),
      (this.query = e.query),
      (this.socket = e.socket);
  }
  onError(e, t, r) {
    return super.emitReserved("error", new ar(e, t, r)), this;
  }
  open() {
    return (this.readyState = "opening"), this.doOpen(), this;
  }
  close() {
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        (this.doClose(), this.onClose()),
      this
    );
  }
  send(e) {
    "open" === this.readyState && this.write(e);
  }
  onOpen() {
    (this.readyState = "open"),
      (this.writable = !0),
      super.emitReserved("open");
  }
  onData(e) {
    (e = Wt(e, this.socket.binaryType)), this.onPacket(e);
  }
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  onClose(e) {
    (this.readyState = "closed"), super.emitReserved("close", e);
  }
  pause(e) {}
  createUri(e, t = {}) {
    return (
      e +
      "://" +
      this._hostname() +
      this._port() +
      this.opts.path +
      this._query(t)
    );
  }
  _hostname() {
    var e = this.opts.hostname;
    return -1 === e.indexOf(":") ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port &&
      ((this.opts.secure && Number(443 !== this.opts.port)) ||
        (!this.opts.secure && 80 !== Number(this.opts.port)))
      ? ":" + this.opts.port
      : "";
  }
  _query(e) {
    return (e = (function (e) {
      let t = "";
      for (var r in e)
        e.hasOwnProperty(r) &&
          (t.length && (t += "&"),
          (t += encodeURIComponent(r) + "=" + encodeURIComponent(e[r])));
      return t;
    })(e)).length
      ? "?" + e
      : "";
  }
}
const cr =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
      ""
    ),
  hr = 64,
  pr = {};
let ur,
  dr = 0,
  fr = 0;
function gr(e) {
  let t = "";
  for (; (t = cr[e % hr] + t), 0 < (e = Math.floor(e / hr)); );
  return t;
}
function br() {
  var e = gr(+new Date());
  return e !== ur ? ((dr = 0), (ur = e)) : e + "." + gr(dr++);
}
for (; fr < hr; fr++) pr[cr[fr]] = fr;
let wr = !1;
try {
  wr =
    "undefined" != typeof XMLHttpRequest &&
    "withCredentials" in new XMLHttpRequest();
} catch (pt) {}
const mr = wr;
function yr(e) {
  e = e.xdomain;
  try {
    if ("undefined" != typeof XMLHttpRequest && (!e || mr))
      return new XMLHttpRequest();
  } catch (e) {}
  if (!e)
    try {
      return new tr[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {}
}
function vr() {}
const xr = null != new yr({ xdomain: !1 }).responseType;
class kr extends er {
  constructor(e, t) {
    super(),
      nr(this, t),
      (this.opts = t),
      (this.method = t.method || "GET"),
      (this.uri = e),
      (this.data = void 0 !== t.data ? t.data : null),
      this.create();
  }
  create() {
    var e,
      t = rr(
        this.opts,
        "agent",
        "pfx",
        "key",
        "passphrase",
        "cert",
        "ca",
        "ciphers",
        "rejectUnauthorized",
        "autoUnref"
      );
    t.xdomain = !!this.opts.xd;
    const r = (this.xhr = new yr(t));
    try {
      r.open(this.method, this.uri, !0);
      try {
        if (this.opts.extraHeaders)
          for (var s in (r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0),
          this.opts.extraHeaders))
            this.opts.extraHeaders.hasOwnProperty(s) &&
              r.setRequestHeader(s, this.opts.extraHeaders[s]);
      } catch (e) {}
      if ("POST" === this.method)
        try {
          r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {}
      try {
        r.setRequestHeader("Accept", "*/*");
      } catch (e) {}
      null != (e = this.opts.cookieJar) && e.addCookies(r),
        "withCredentials" in r &&
          (r.withCredentials = this.opts.withCredentials),
        this.opts.requestTimeout && (r.timeout = this.opts.requestTimeout),
        (r.onreadystatechange = () => {
          var e;
          3 === r.readyState &&
            null != (e = this.opts.cookieJar) &&
            e.parseCookies(r),
            4 === r.readyState &&
              (200 === r.status || 1223 === r.status
                ? this.onLoad()
                : this.setTimeoutFn(() => {
                    this.onError("number" == typeof r.status ? r.status : 0);
                  }, 0));
        }),
        r.send(this.data);
    } catch (e) {
      return void this.setTimeoutFn(() => {
        this.onError(e);
      }, 0);
    }
    "undefined" != typeof document &&
      ((this.index = kr.requestsCount++), (kr.requests[this.index] = this));
  }
  onError(e) {
    this.emitReserved("error", e, this.xhr), this.cleanup(!0);
  }
  cleanup(e) {
    if (void 0 !== this.xhr && null !== this.xhr) {
      if (((this.xhr.onreadystatechange = vr), e))
        try {
          this.xhr.abort();
        } catch (e) {}
      "undefined" != typeof document && delete kr.requests[this.index],
        (this.xhr = null);
    }
  }
  onLoad() {
    var e = this.xhr.responseText;
    null !== e &&
      (this.emitReserved("data", e),
      this.emitReserved("success"),
      this.cleanup());
  }
  abort() {
    this.cleanup();
  }
}
if (
  ((kr.requestsCount = 0), (kr.requests = {}), "undefined" != typeof document)
)
  if ("function" == typeof attachEvent) attachEvent("onunload", _r);
  else if ("function" == typeof addEventListener) {
    addEventListener("onpagehide" in tr ? "pagehide" : "unload", _r, !1);
  }
function _r() {
  for (var e in kr.requests)
    kr.requests.hasOwnProperty(e) && kr.requests[e].abort();
}
const Cr =
    "function" == typeof Promise && "function" == typeof Promise.resolve
      ? (e) => Promise.resolve().then(e)
      : (e, t) => t(e, 0),
  Sr = tr.WebSocket || tr.MozWebSocket,
  Pr =
    "undefined" != typeof navigator &&
    "string" == typeof navigator.product &&
    "reactnative" === navigator.product.toLowerCase();
const Ar = {
    websocket: class extends lr {
      constructor(e) {
        super(e), (this.supportsBinary = !e.forceBase64);
      }
      get name() {
        return "websocket";
      }
      doOpen() {
        if (this.check()) {
          var e = this.uri(),
            t = this.opts.protocols,
            r = Pr
              ? {}
              : rr(
                  this.opts,
                  "agent",
                  "perMessageDeflate",
                  "pfx",
                  "key",
                  "passphrase",
                  "cert",
                  "ca",
                  "ciphers",
                  "rejectUnauthorized",
                  "localAddress",
                  "protocolVersion",
                  "origin",
                  "maxPayload",
                  "family",
                  "checkServerIdentity"
                );
          this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
          try {
            this.ws = Pr ? new Sr(e, t, r) : t ? new Sr(e, t) : new Sr(e);
          } catch (e) {
            return this.emitReserved("error", e);
          }
          (this.ws.binaryType = this.socket.binaryType),
            this.addEventListeners();
        }
      }
      addEventListeners() {
        (this.ws.onopen = () => {
          this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
        }),
          (this.ws.onclose = (e) =>
            this.onClose({
              description: "websocket connection closed",
              context: e,
            })),
          (this.ws.onmessage = (e) => this.onData(e.data)),
          (this.ws.onerror = (e) => this.onError("websocket error", e));
      }
      write(e) {
        this.writable = !1;
        for (let r = 0; r < e.length; r++) {
          var t = e[r];
          const s = r === e.length - 1;
          It(t, this.supportsBinary, (e) => {
            try {
              this.ws.send(e);
            } catch (e) {}
            s &&
              Cr(() => {
                (this.writable = !0), this.emitReserved("drain");
              }, this.setTimeoutFn);
          });
        }
      }
      doClose() {
        void 0 !== this.ws && (this.ws.close(), (this.ws = null));
      }
      uri() {
        var e = this.opts.secure ? "wss" : "ws",
          t = this.query || {};
        return (
          this.opts.timestampRequests && (t[this.opts.timestampParam] = br()),
          this.supportsBinary || (t.b64 = 1),
          this.createUri(e, t)
        );
      }
      check() {
        return !!Sr;
      }
    },
    webtransport: class extends lr {
      get name() {
        return "webtransport";
      }
      doOpen() {
        "function" == typeof WebTransport &&
          ((this.transport = new WebTransport(
            this.createUri("https"),
            this.opts.transportOptions[this.name]
          )),
          this.transport.closed
            .then(() => {
              this.onClose();
            })
            .catch((e) => {
              this.onError("webtransport error", e);
            }),
          this.transport.ready.then(() => {
            this.transport.createBidirectionalStream().then((e) => {
              var t = (function (e, t) {
                Kt = Kt || new TextDecoder();
                const r = [];
                let s = 0,
                  o = -1,
                  n = !1;
                return new TransformStream({
                  transform(i, a) {
                    for (r.push(i); ; ) {
                      if (0 === s) {
                        if (Qt(r) < 1) break;
                        var l = Zt(r, 1);
                        (n = 128 == (128 & l[0])),
                          (o = 127 & l[0]),
                          (s = o < 126 ? 3 : 126 === o ? 1 : 2);
                      } else if (1 === s) {
                        if (Qt(r) < 2) break;
                        (l = Zt(r, 2)),
                          (o = new DataView(
                            l.buffer,
                            l.byteOffset,
                            l.length
                          ).getUint16(0)),
                          (s = 3);
                      } else if (2 === s) {
                        if (Qt(r) < 8) break;
                        var c = Zt(r, 8),
                          h = (c = new DataView(
                            c.buffer,
                            c.byteOffset,
                            c.length
                          )).getUint32(0);
                        if (h > Math.pow(2, 21) - 1) {
                          a.enqueue(Nt);
                          break;
                        }
                        (o = h * Math.pow(2, 32) + c.getUint32(4)), (s = 3);
                      } else {
                        if (Qt(r) < o) break;
                        (h = Zt(r, o)),
                          a.enqueue(Wt(n ? h : Kt.decode(h), t)),
                          (s = 0);
                      }
                      if (0 === o || o > e) {
                        a.enqueue(Nt);
                        break;
                      }
                    }
                  },
                });
              })(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
              const r = e.readable.pipeThrough(t).getReader();
              (t = Jt()).readable.pipeTo(e.writable),
                (this.writer = t.writable.getWriter());
              const s = () => {
                r.read()
                  .then(({ done: e, value: t }) => {
                    e || (this.onPacket(t), s());
                  })
                  .catch((e) => {});
              };
              s(),
                (e = { type: "open" }),
                this.query.sid && (e.data = `{"sid":"${this.query.sid}"}`),
                this.writer.write(e).then(() => this.onOpen());
            });
          }));
      }
      write(e) {
        this.writable = !1;
        for (let r = 0; r < e.length; r++) {
          var t = e[r];
          const s = r === e.length - 1;
          this.writer.write(t).then(() => {
            s &&
              Cr(() => {
                (this.writable = !0), this.emitReserved("drain");
              }, this.setTimeoutFn);
          });
        }
      }
      doClose() {
        var e;
        null != (e = this.transport) && e.close();
      }
    },
    polling: class extends lr {
      constructor(e) {
        if ((super(e), (this.polling = !1), "undefined" != typeof location)) {
          var t = "https:" === location.protocol;
          let r = location.port;
          (r = r || (t ? "443" : "80")),
            (this.xd =
              ("undefined" != typeof location &&
                e.hostname !== location.hostname) ||
              r !== e.port);
        }
        (t = e && e.forceBase64),
          (this.supportsBinary = xr && !t),
          this.opts.withCredentials && (this.cookieJar = void 0);
      }
      get name() {
        return "polling";
      }
      doOpen() {
        this.poll();
      }
      pause(e) {
        this.readyState = "pausing";
        const t = () => {
          (this.readyState = "paused"), e();
        };
        if (this.polling || !this.writable) {
          let e = 0;
          this.polling &&
            (e++,
            this.once("pollComplete", function () {
              --e || t();
            })),
            this.writable ||
              (e++,
              this.once("drain", function () {
                --e || t();
              }));
        } else t();
      }
      poll() {
        (this.polling = !0), this.doPoll(), this.emitReserved("poll");
      }
      onData(e) {
        ((e, t) => {
          var r = e.split(Xt),
            s = [];
          for (let e = 0; e < r.length; e++) {
            var o = Wt(r[e], t);
            if ((s.push(o), "error" === o.type)) break;
          }
          return s;
        })(e, this.socket.binaryType).forEach((e) => {
          if (
            ("opening" === this.readyState &&
              "open" === e.type &&
              this.onOpen(),
            "close" === e.type)
          )
            return (
              this.onClose({ description: "transport closed by the server" }),
              !1
            );
          this.onPacket(e);
        }),
          "closed" !== this.readyState &&
            ((this.polling = !1),
            this.emitReserved("pollComplete"),
            "open" === this.readyState) &&
            this.poll();
      }
      doClose() {
        var e = () => {
          this.write([{ type: "close" }]);
        };
        "open" === this.readyState ? e() : this.once("open", e);
      }
      write(e) {
        (this.writable = !1),
          ((e, t) => {
            const r = e.length,
              s = new Array(r);
            let o = 0;
            e.forEach((e, n) => {
              It(e, !1, (e) => {
                (s[n] = e), ++o === r && t(s.join(Xt));
              });
            });
          })(e, (e) => {
            this.doWrite(e, () => {
              (this.writable = !0), this.emitReserved("drain");
            });
          });
      }
      uri() {
        var e = this.opts.secure ? "https" : "http",
          t = this.query || {};
        return (
          !1 !== this.opts.timestampRequests &&
            (t[this.opts.timestampParam] = br()),
          this.supportsBinary || t.sid || (t.b64 = 1),
          this.createUri(e, t)
        );
      }
      request(e = {}) {
        return (
          Object.assign(
            e,
            { xd: this.xd, cookieJar: this.cookieJar },
            this.opts
          ),
          new kr(this.uri(), e)
        );
      }
      doWrite(e, t) {
        (e = this.request({ method: "POST", data: e })).on("success", t),
          e.on("error", (e, t) => {
            this.onError("xhr post error", e, t);
          });
      }
      doPoll() {
        var e = this.request();
        e.on("data", this.onData.bind(this)),
          e.on("error", (e, t) => {
            this.onError("xhr poll error", e, t);
          }),
          (this.pollXhr = e);
      }
    },
  },
  Tr =
    /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  Er = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor",
  ];
function $r(e) {
  var t = e,
    r = e.indexOf("["),
    s = e.indexOf("]");
  -1 != r &&
    -1 != s &&
    (e =
      e.substring(0, r) +
      e.substring(r, s).replace(/:/g, ";") +
      e.substring(s, e.length));
  let o = Tr.exec(e || ""),
    n = {},
    i = 14;
  for (; i--; ) n[Er[i]] = o[i] || "";
  return (
    -1 != r &&
      -1 != s &&
      ((n.source = t),
      (n.host = n.host.substring(1, n.host.length - 1).replace(/;/g, ":")),
      (n.authority = n.authority
        .replace("[", "")
        .replace("]", "")
        .replace(/;/g, ":")),
      (n.ipv6uri = !0)),
    (n.pathNames = (function (e, t) {
      var r = t.replace(/\/{2,9}/g, "/").split("/");
      return (
        ("/" != t.slice(0, 1) && 0 !== t.length) || r.splice(0, 1),
        "/" == t.slice(-1) && r.splice(r.length - 1, 1),
        r
      );
    })(0, n.path)),
    (n.queryKey = (function (e, t) {
      const r = {};
      return (
        t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (e, t, s) {
          t && (r[t] = s);
        }),
        r
      );
    })(0, n.query)),
    n
  );
}
let Rr = class e extends er {
  constructor(e, t = {}) {
    super(),
      (this.binaryType = "arraybuffer"),
      (this.writeBuffer = []),
      e && "object" == typeof e && ((t = e), (e = null)),
      e
        ? ((e = $r(e)),
          (t.hostname = e.host),
          (t.secure = "https" === e.protocol || "wss" === e.protocol),
          (t.port = e.port),
          e.query && (t.query = e.query))
        : t.host && (t.hostname = $r(t.host).host),
      nr(this, t),
      (this.secure =
        null != t.secure
          ? t.secure
          : "undefined" != typeof location && "https:" === location.protocol),
      t.hostname && !t.port && (t.port = this.secure ? "443" : "80"),
      (this.hostname =
        t.hostname ||
        ("undefined" != typeof location ? location.hostname : "localhost")),
      (this.port =
        t.port ||
        ("undefined" != typeof location && location.port
          ? location.port
          : this.secure
          ? "443"
          : "80")),
      (this.transports = t.transports || [
        "polling",
        "websocket",
        "webtransport",
      ]),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0),
      (this.opts = Object.assign(
        {
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          addTrailingSlash: !0,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !1,
        },
        t
      )),
      (this.opts.path =
        this.opts.path.replace(/\/$/, "") +
        (this.opts.addTrailingSlash ? "/" : "")),
      "string" == typeof this.opts.query &&
        (this.opts.query = (function (e) {
          var t = {},
            r = e.split("&");
          for (let e = 0, o = r.length; e < o; e++) {
            var s = r[e].split("=");
            t[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
          }
          return t;
        })(this.opts.query)),
      (this.id = null),
      (this.upgrades = null),
      (this.pingInterval = null),
      (this.pingTimeout = null),
      (this.pingTimeoutTimer = null),
      "function" == typeof addEventListener &&
        (this.opts.closeOnBeforeunload &&
          ((this.beforeunloadEventListener = () => {
            this.transport &&
              (this.transport.removeAllListeners(), this.transport.close());
          }),
          addEventListener("beforeunload", this.beforeunloadEventListener, !1)),
        "localhost" !== this.hostname) &&
        ((this.offlineEventListener = () => {
          this.onClose("transport close", {
            description: "network connection lost",
          });
        }),
        addEventListener("offline", this.offlineEventListener, !1)),
      this.open();
  }
  createTransport(e) {
    var t =
      (((t = Object.assign({}, this.opts.query)).EIO = 4),
      (t.transport = e),
      this.id && (t.sid = this.id),
      Object.assign(
        {},
        this.opts,
        {
          query: t,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port,
        },
        this.opts.transportOptions[e]
      ));
    return new Ar[e](t);
  }
  open() {
    let t;
    if (
      this.opts.rememberUpgrade &&
      e.priorWebsocketSuccess &&
      -1 !== this.transports.indexOf("websocket")
    )
      t = "websocket";
    else {
      if (0 === this.transports.length)
        return void this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
      t = this.transports[0];
    }
    this.readyState = "opening";
    try {
      t = this.createTransport(t);
    } catch (t) {
      return this.transports.shift(), void this.open();
    }
    t.open(), this.setTransport(t);
  }
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(),
      (this.transport = e)
        .on("drain", this.onDrain.bind(this))
        .on("packet", this.onPacket.bind(this))
        .on("error", this.onError.bind(this))
        .on("close", (e) => this.onClose("transport close", e));
  }
  probe(t) {
    let r = this.createTransport(t),
      s = !1;
    e.priorWebsocketSuccess = !1;
    const o = () => {
      s ||
        (r.send([{ type: "ping", data: "probe" }]),
        r.once("packet", (t) => {
          s ||
            ("pong" === t.type && "probe" === t.data
              ? ((this.upgrading = !0),
                this.emitReserved("upgrading", r),
                r &&
                  ((e.priorWebsocketSuccess = "websocket" === r.name),
                  this.transport.pause(() => {
                    s ||
                      ("closed" !== this.readyState &&
                        (h(),
                        this.setTransport(r),
                        r.send([{ type: "upgrade" }]),
                        this.emitReserved("upgrade", r),
                        (r = null),
                        (this.upgrading = !1),
                        this.flush()));
                  })))
              : (((t = new Error("probe error")).transport = r.name),
                this.emitReserved("upgradeError", t)));
        }));
    };
    function n() {
      s || ((s = !0), h(), r.close(), (r = null));
    }
    const i = (e) => {
      ((e = new Error("probe error: " + e)).transport = r.name),
        n(),
        this.emitReserved("upgradeError", e);
    };
    function a() {
      i("transport closed");
    }
    function l() {
      i("socket closed");
    }
    function c(e) {
      r && e.name !== r.name && n();
    }
    const h = () => {
      r.removeListener("open", o),
        r.removeListener("error", i),
        r.removeListener("close", a),
        this.off("close", l),
        this.off("upgrading", c);
    };
    r.once("open", o),
      r.once("error", i),
      r.once("close", a),
      this.once("close", l),
      this.once("upgrading", c),
      -1 !== this.upgrades.indexOf("webtransport") && "webtransport" !== t
        ? this.setTimeoutFn(() => {
            s || r.open();
          }, 200)
        : r.open();
  }
  onOpen() {
    if (
      ((this.readyState = "open"),
      (e.priorWebsocketSuccess = "websocket" === this.transport.name),
      this.emitReserved("open"),
      this.flush(),
      "open" === this.readyState && this.opts.upgrade)
    ) {
      let e = 0;
      for (var t = this.upgrades.length; e < t; e++)
        this.probe(this.upgrades[e]);
    }
  }
  onPacket(e) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    )
      switch (
        (this.emitReserved("packet", e),
        this.emitReserved("heartbeat"),
        this.resetPingTimeout(),
        e.type)
      ) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this.sendPacket("pong"),
            this.emitReserved("ping"),
            this.emitReserved("pong");
          break;
        case "error":
          var t = new Error("server error");
          (t.code = e.data), this.onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data),
            this.emitReserved("message", e.data);
      }
  }
  onHandshake(e) {
    this.emitReserved("handshake", e),
      (this.id = e.sid),
      (this.transport.query.sid = e.sid),
      (this.upgrades = this.filterUpgrades(e.upgrades)),
      (this.pingInterval = e.pingInterval),
      (this.pingTimeout = e.pingTimeout),
      (this.maxPayload = e.maxPayload),
      this.onOpen(),
      "closed" !== this.readyState && this.resetPingTimeout();
  }
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer),
      (this.pingTimeoutTimer = this.setTimeoutFn(() => {
        this.onClose("ping timeout");
      }, this.pingInterval + this.pingTimeout)),
      this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen),
      (this.prevBufferLen = 0) === this.writeBuffer.length
        ? this.emitReserved("drain")
        : this.flush();
  }
  flush() {
    var e;
    "closed" !== this.readyState &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length &&
      ((e = this.getWritablePackets()),
      this.transport.send(e),
      (this.prevBufferLen = e.length),
      this.emitReserved("flush"));
  }
  getWritablePackets() {
    if (
      this.maxPayload &&
      "polling" === this.transport.name &&
      1 < this.writeBuffer.length
    ) {
      let t = 1;
      for (let r = 0; r < this.writeBuffer.length; r++) {
        var e = this.writeBuffer[r].data;
        if ((e && (t += ir(e)), 0 < r && t > this.maxPayload))
          return this.writeBuffer.slice(0, r);
        t += 2;
      }
    }
    return this.writeBuffer;
  }
  write(e, t, r) {
    return this.sendPacket("message", e, t, r), this;
  }
  send(e, t, r) {
    return this.sendPacket("message", e, t, r), this;
  }
  sendPacket(e, t, r, s) {
    "function" == typeof t && ((s = t), (t = void 0)),
      "function" == typeof r && ((s = r), (r = null)),
      "closing" !== this.readyState &&
        "closed" !== this.readyState &&
        (((r = r || {}).compress = !1 !== r.compress),
        this.emitReserved(
          "packetCreate",
          (e = { type: e, data: t, options: r })
        ),
        this.writeBuffer.push(e),
        s && this.once("flush", s),
        this.flush());
  }
  close() {
    const e = () => {
        this.onClose("forced close"), this.transport.close();
      },
      t = () => {
        this.off("upgrade", t), this.off("upgradeError", t), e();
      },
      r = () => {
        this.once("upgrade", t), this.once("upgradeError", t);
      };
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        ((this.readyState = "closing"),
        this.writeBuffer.length
          ? this.once("drain", () => {
              (this.upgrading ? r : e)();
            })
          : (this.upgrading ? r : e)()),
      this
    );
  }
  onError(t) {
    (e.priorWebsocketSuccess = !1),
      this.emitReserved("error", t),
      this.onClose("transport error", t);
  }
  onClose(e, t) {
    ("opening" !== this.readyState &&
      "open" !== this.readyState &&
      "closing" !== this.readyState) ||
      (this.clearTimeoutFn(this.pingTimeoutTimer),
      this.transport.removeAllListeners("close"),
      this.transport.close(),
      this.transport.removeAllListeners(),
      "function" == typeof removeEventListener &&
        (removeEventListener(
          "beforeunload",
          this.beforeunloadEventListener,
          !1
        ),
        removeEventListener("offline", this.offlineEventListener, !1)),
      (this.readyState = "closed"),
      (this.id = null),
      this.emitReserved("close", e, t),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0));
  }
  filterUpgrades(e) {
    var t = [];
    let r = 0;
    for (var s = e.length; r < s; r++)
      ~this.transports.indexOf(e[r]) && t.push(e[r]);
    return t;
  }
};
Rr.protocol = 4;
const Or = "function" == typeof ArrayBuffer,
  Br = (e) =>
    "function" == typeof ArrayBuffer.isView
      ? ArrayBuffer.isView(e)
      : e.buffer instanceof ArrayBuffer,
  Lr = Object.prototype.toString,
  Nr =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob &&
      "[object BlobConstructor]" === Lr.call(Blob)),
  jr =
    "function" == typeof File ||
    ("undefined" != typeof File &&
      "[object FileConstructor]" === Lr.call(File));
function zr(e) {
  return (
    (Or && (e instanceof ArrayBuffer || Br(e))) ||
    (Nr && e instanceof Blob) ||
    (jr && e instanceof File)
  );
}
function qr(e, t) {
  if (e && "object" == typeof e)
    if (Array.isArray(e)) {
      for (let t = 0, r = e.length; t < r; t++) if (qr(e[t])) return !0;
    } else {
      if (zr(e)) return !0;
      if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length)
        return qr(e.toJSON(), !0);
      for (const t in e)
        if (Object.prototype.hasOwnProperty.call(e, t) && qr(e[t])) return !0;
    }
  return !1;
}
function Ir(e) {
  var t = [],
    r = e.data;
  return (
    (e.data = Mr(r, t)), (e.attachments = t.length), { packet: e, buffers: t }
  );
}
function Mr(e, t) {
  if (!e) return e;
  var r;
  if (zr(e)) return (r = { _placeholder: !0, num: t.length }), t.push(e), r;
  if (Array.isArray(e)) {
    var s = new Array(e.length);
    for (let r = 0; r < e.length; r++) s[r] = Mr(e[r], t);
    return s;
  }
  if ("object" != typeof e || e instanceof Date) return e;
  var o = {};
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (o[r] = Mr(e[r], t));
  return o;
}
function Dr(e, t) {
  return (e.data = Ur(e.data, t)), delete e.attachments, e;
}
function Ur(e, t) {
  if (e) {
    if (e && !0 === e._placeholder) {
      if ("number" == typeof e.num && 0 <= e.num && e.num < t.length)
        return t[e.num];
      throw new Error("illegal attachments");
    }
    if (Array.isArray(e)) for (let r = 0; r < e.length; r++) e[r] = Ur(e[r], t);
    else if ("object" == typeof e)
      for (const r in e)
        Object.prototype.hasOwnProperty.call(e, r) && (e[r] = Ur(e[r], t));
  }
  return e;
}
const Fr = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener",
];
!(function (e) {
  (e[(e.CONNECT = 0)] = "CONNECT"),
    (e[(e.DISCONNECT = 1)] = "DISCONNECT"),
    (e[(e.EVENT = 2)] = "EVENT"),
    (e[(e.ACK = 3)] = "ACK"),
    (e[(e.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
    (e[(e.BINARY_EVENT = 5)] = "BINARY_EVENT"),
    (e[(e.BINARY_ACK = 6)] = "BINARY_ACK");
})((Be = Be || {}));
function Hr(e) {
  return "[object Object]" === Object.prototype.toString.call(e);
}
class Gr extends er {
  constructor(e) {
    super(), (this.reviver = e);
  }
  add(e) {
    let t;
    if ("string" == typeof e) {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      var r = (t = this.decodeString(e)).type === Be.BINARY_EVENT;
      ((!r && t.type !== Be.BINARY_ACK) ||
        ((t.type = r ? Be.EVENT : Be.ACK),
        (this.reconstructor = new Wr(t)),
        0 === t.attachments)) &&
        super.emitReserved("decoded", t);
    } else {
      if (!zr(e) && !e.base64) throw new Error("Unknown type: " + e);
      if (!this.reconstructor)
        throw new Error("got binary data when not reconstructing a packet");
      (t = this.reconstructor.takeBinaryData(e)) &&
        ((this.reconstructor = null), super.emitReserved("decoded", t));
    }
  }
  decodeString(e) {
    let t = 0;
    var r = { type: Number(e.charAt(0)) };
    if (void 0 === Be[r.type]) throw new Error("unknown packet type " + r.type);
    if (r.type === Be.BINARY_EVENT || r.type === Be.BINARY_ACK) {
      for (var s = t + 1; "-" !== e.charAt(++t) && t != e.length; );
      if ((s = e.substring(s, t)) != Number(s) || "-" !== e.charAt(t))
        throw new Error("Illegal attachments");
      r.attachments = Number(s);
    }
    if ("/" === e.charAt(t + 1)) {
      for (s = t + 1; ++t && "," !== e.charAt(t) && t !== e.length; );
      r.nsp = e.substring(s, t);
    } else r.nsp = "/";
    if ("" !== (s = e.charAt(t + 1)) && Number(s) == s) {
      for (s = t + 1; ++t; ) {
        var o = e.charAt(t);
        if (null == o || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length) break;
      }
      r.id = Number(e.substring(s, t + 1));
    }
    if (e.charAt(++t)) {
      if (((s = this.tryParse(e.substr(t))), !Gr.isPayloadValid(r.type, s)))
        throw new Error("invalid payload");
      r.data = s;
    }
    return r;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch (e) {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case Be.CONNECT:
        return Hr(t);
      case Be.DISCONNECT:
        return void 0 === t;
      case Be.CONNECT_ERROR:
        return "string" == typeof t || Hr(t);
      case Be.EVENT:
      case Be.BINARY_EVENT:
        return (
          Array.isArray(t) &&
          ("number" == typeof t[0] ||
            ("string" == typeof t[0] && -1 === Fr.indexOf(t[0])))
        );
      case Be.ACK:
      case Be.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  destroy() {
    this.reconstructor &&
      (this.reconstructor.finishedReconstruction(),
      (this.reconstructor = null));
  }
}
class Wr {
  constructor(e) {
    (this.packet = e), (this.buffers = []), (this.reconPack = e);
  }
  takeBinaryData(e) {
    return (
      this.buffers.push(e),
      this.buffers.length === this.reconPack.attachments
        ? ((e = Dr(this.reconPack, this.buffers)),
          this.finishedReconstruction(),
          e)
        : null
    );
  }
  finishedReconstruction() {
    (this.reconPack = null), (this.buffers = []);
  }
}
var Vr = Object.freeze({
  __proto__: null,
  Decoder: Gr,
  Encoder: class {
    constructor(e) {
      this.replacer = e;
    }
    encode(e) {
      return (e.type !== Be.EVENT && e.type !== Be.ACK) || !qr(e)
        ? [this.encodeAsString(e)]
        : this.encodeAsBinary({
            type: e.type === Be.EVENT ? Be.BINARY_EVENT : Be.BINARY_ACK,
            nsp: e.nsp,
            data: e.data,
            id: e.id,
          });
    }
    encodeAsString(e) {
      let t = "" + e.type;
      return (
        (e.type !== Be.BINARY_EVENT && e.type !== Be.BINARY_ACK) ||
          (t += e.attachments + "-"),
        e.nsp && "/" !== e.nsp && (t += e.nsp + ","),
        null != e.id && (t += e.id),
        null != e.data && (t += JSON.stringify(e.data, this.replacer)),
        t
      );
    }
    encodeAsBinary(e) {
      e = Ir(e);
      var t = this.encodeAsString(e.packet);
      return (e = e.buffers).unshift(t), e;
    }
  },
  get PacketType() {
    return Be;
  },
  protocol: 5,
});
function Yr(e, t, r) {
  return (
    e.on(t, r),
    function () {
      e.off(t, r);
    }
  );
}
const Xr = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1,
});
class Jr extends er {
  constructor(e, t, r) {
    super(),
      (this.connected = !1),
      (this.recovered = !1),
      (this.receiveBuffer = []),
      (this.sendBuffer = []),
      (this._queue = []),
      (this._queueSeq = 0),
      (this.ids = 0),
      (this.acks = {}),
      (this.flags = {}),
      (this.io = e),
      (this.nsp = t),
      r && r.auth && (this.auth = r.auth),
      (this._opts = Object.assign({}, r)),
      this.io._autoConnect && this.open();
  }
  get disconnected() {
    return !this.connected;
  }
  subEvents() {
    var e;
    this.subs ||
      ((e = this.io),
      (this.subs = [
        Yr(e, "open", this.onopen.bind(this)),
        Yr(e, "packet", this.onpacket.bind(this)),
        Yr(e, "error", this.onerror.bind(this)),
        Yr(e, "close", this.onclose.bind(this)),
      ]));
  }
  get active() {
    return !!this.subs;
  }
  connect() {
    return (
      this.connected ||
        (this.subEvents(),
        this.io._reconnecting || this.io.open(),
        "open" === this.io._readyState && this.onopen()),
      this
    );
  }
  open() {
    return this.connect();
  }
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  emit(e, ...t) {
    if (Xr.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    var r, s;
    return (
      t.unshift(e),
      !this._opts.retries || this.flags.fromQueue || this.flags.volatile
        ? (((e = { type: Be.EVENT, data: t, options: {} }).options.compress =
            !1 !== this.flags.compress),
          "function" == typeof t[t.length - 1] &&
            ((r = this.ids++),
            (s = t.pop()),
            this._registerAckCallback(r, s),
            (e.id = r)),
          (s =
            this.io.engine &&
            this.io.engine.transport &&
            this.io.engine.transport.writable),
          (!this.flags.volatile || (s && this.connected)) &&
            (this.connected
              ? (this.notifyOutgoingListeners(e), this.packet(e))
              : this.sendBuffer.push(e)),
          (this.flags = {}))
        : this._addToQueue(t),
      this
    );
  }
  _registerAckCallback(e, t) {
    var r = null != (r = this.flags.timeout) ? r : this._opts.ackTimeout;
    if (void 0 === r) this.acks[e] = t;
    else {
      const s = this.io.setTimeoutFn(() => {
        delete this.acks[e];
        for (let t = 0; t < this.sendBuffer.length; t++)
          this.sendBuffer[t].id === e && this.sendBuffer.splice(t, 1);
        t.call(this, new Error("operation has timed out"));
      }, r);
      this.acks[e] = (...e) => {
        this.io.clearTimeoutFn(s), t.apply(this, [null, ...e]);
      };
    }
  }
  emitWithAck(e, ...t) {
    const r = void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
    return new Promise((s, o) => {
      t.push((e, t) => (r ? (e ? o(e) : s(t)) : s(e))), this.emit(e, ...t);
    });
  }
  _addToQueue(e) {
    let t;
    "function" == typeof e[e.length - 1] && (t = e.pop());
    const r = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags),
    };
    e.push((e, ...s) => {
      if (r === this._queue[0])
        return (
          null !== e
            ? r.tryCount > this._opts.retries &&
              (this._queue.shift(), t) &&
              t(e)
            : (this._queue.shift(), t && t(null, ...s)),
          (r.pending = !1),
          this._drainQueue()
        );
    }),
      this._queue.push(r),
      this._drainQueue();
  }
  _drainQueue(e = !1) {
    var t;
    !this.connected ||
      0 === this._queue.length ||
      ((t = this._queue[0]).pending && !e) ||
      ((t.pending = !0),
      t.tryCount++,
      (this.flags = t.flags),
      this.emit.apply(this, t.args));
  }
  packet(e) {
    (e.nsp = this.nsp), this.io._packet(e);
  }
  onopen() {
    "function" == typeof this.auth
      ? this.auth((e) => {
          this._sendConnectPacket(e);
        })
      : this._sendConnectPacket(this.auth);
  }
  _sendConnectPacket(e) {
    this.packet({
      type: Be.CONNECT,
      data: this._pid
        ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e)
        : e,
    });
  }
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  onclose(e, t) {
    (this.connected = !1),
      delete this.id,
      this.emitReserved("disconnect", e, t);
  }
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case Be.CONNECT:
          e.data && e.data.sid
            ? this.onconnect(e.data.sid, e.data.pid)
            : this.emitReserved(
                "connect_error",
                new Error(
                  "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                )
              );
          break;
        case Be.EVENT:
        case Be.BINARY_EVENT:
          this.onevent(e);
          break;
        case Be.ACK:
        case Be.BINARY_ACK:
          this.onack(e);
          break;
        case Be.DISCONNECT:
          this.ondisconnect();
          break;
        case Be.CONNECT_ERROR:
          this.destroy();
          var t = new Error(e.data.message);
          (t.data = e.data.data), this.emitReserved("connect_error", t);
      }
  }
  onevent(e) {
    var t = e.data || [];
    null != e.id && t.push(this.ack(e.id)),
      this.connected
        ? this.emitEvent(t)
        : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length)
      for (const t of this._anyListeners.slice()) t.apply(this, e);
    super.emit.apply(this, e),
      this._pid &&
        e.length &&
        "string" == typeof e[e.length - 1] &&
        (this._lastOffset = e[e.length - 1]);
  }
  ack(e) {
    const t = this;
    let r = !1;
    return function (...s) {
      r || ((r = !0), t.packet({ type: Be.ACK, id: e, data: s }));
    };
  }
  onack(e) {
    var t = this.acks[e.id];
    "function" == typeof t && (t.apply(this, e.data), delete this.acks[e.id]);
  }
  onconnect(e, t) {
    (this.id = e),
      (this.recovered = t && this._pid === t),
      (this._pid = t),
      (this.connected = !0),
      this.emitBuffered(),
      this.emitReserved("connect"),
      this._drainQueue(!0);
  }
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)),
      (this.receiveBuffer = []),
      this.sendBuffer.forEach((e) => {
        this.notifyOutgoingListeners(e), this.packet(e);
      }),
      (this.sendBuffer = []);
  }
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), (this.subs = void 0)),
      this.io._destroy(this);
  }
  disconnect() {
    return (
      this.connected && this.packet({ type: Be.DISCONNECT }),
      this.destroy(),
      this.connected && this.onclose("io client disconnect"),
      this
    );
  }
  close() {
    return this.disconnect();
  }
  compress(e) {
    return (this.flags.compress = e), this;
  }
  get volatile() {
    return (this.flags.volatile = !0), this;
  }
  timeout(e) {
    return (this.flags.timeout = e), this;
  }
  onAny(e) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.push(e),
      this
    );
  }
  prependAny(e) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.unshift(e),
      this
    );
  }
  offAny(e) {
    if (this._anyListeners)
      if (e) {
        var t = this._anyListeners;
        for (let r = 0; r < t.length; r++)
          if (e === t[r]) return t.splice(r, 1), this;
      } else this._anyListeners = [];
    return this;
  }
  listenersAny() {
    return this._anyListeners || [];
  }
  onAnyOutgoing(e) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.push(e),
      this
    );
  }
  prependAnyOutgoing(e) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.unshift(e),
      this
    );
  }
  offAnyOutgoing(e) {
    if (this._anyOutgoingListeners)
      if (e) {
        var t = this._anyOutgoingListeners;
        for (let r = 0; r < t.length; r++)
          if (e === t[r]) return t.splice(r, 1), this;
      } else this._anyOutgoingListeners = [];
    return this;
  }
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length)
      for (const t of this._anyOutgoingListeners.slice()) t.apply(this, e.data);
  }
}
function Kr(e) {
  (this.ms = (e = e || {}).min || 100),
    (this.max = e.max || 1e4),
    (this.factor = e.factor || 2),
    (this.jitter = 0 < e.jitter && e.jitter <= 1 ? e.jitter : 0),
    (this.attempts = 0);
}
(Kr.prototype.duration = function () {
  var e,
    t,
    r = this.ms * Math.pow(this.factor, this.attempts++);
  return (
    this.jitter &&
      ((e = Math.random()),
      (t = Math.floor(e * this.jitter * r)),
      (r = 0 == (1 & Math.floor(10 * e)) ? r - t : r + t)),
    0 | Math.min(r, this.max)
  );
}),
  (Kr.prototype.reset = function () {
    this.attempts = 0;
  }),
  (Kr.prototype.setMin = function (e) {
    this.ms = e;
  }),
  (Kr.prototype.setMax = function (e) {
    this.max = e;
  }),
  (Kr.prototype.setJitter = function (e) {
    this.jitter = e;
  });
class Qr extends er {
  constructor(e, t) {
    super(),
      (this.nsps = {}),
      (this.subs = []),
      e && "object" == typeof e && ((t = e), (e = void 0)),
      ((t = t || {}).path = t.path || "/socket.io"),
      (this.opts = t),
      nr(this, t),
      this.reconnection(!1 !== t.reconnection),
      this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0),
      this.reconnectionDelay(t.reconnectionDelay || 1e3),
      this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3),
      this.randomizationFactor(null != (r = t.randomizationFactor) ? r : 0.5),
      (this.backoff = new Kr({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor(),
      })),
      this.timeout(null == t.timeout ? 2e4 : t.timeout),
      (this._readyState = "closed"),
      (this.uri = e);
    var r = t.parser || Vr;
    (this.encoder = new r.Encoder()),
      (this.decoder = new r.Decoder()),
      (this._autoConnect = !1 !== t.autoConnect),
      this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length
      ? ((this._reconnection = !!e), this)
      : this._reconnection;
  }
  reconnectionAttempts(e) {
    return void 0 === e
      ? this._reconnectionAttempts
      : ((this._reconnectionAttempts = e), this);
  }
  reconnectionDelay(e) {
    var t;
    return void 0 === e
      ? this._reconnectionDelay
      : ((this._reconnectionDelay = e),
        null != (t = this.backoff) && t.setMin(e),
        this);
  }
  randomizationFactor(e) {
    var t;
    return void 0 === e
      ? this._randomizationFactor
      : ((this._randomizationFactor = e),
        null != (t = this.backoff) && t.setJitter(e),
        this);
  }
  reconnectionDelayMax(e) {
    var t;
    return void 0 === e
      ? this._reconnectionDelayMax
      : ((this._reconnectionDelayMax = e),
        null != (t = this.backoff) && t.setMax(e),
        this);
  }
  timeout(e) {
    return arguments.length ? ((this._timeout = e), this) : this._timeout;
  }
  maybeReconnectOnOpen() {
    !this._reconnecting &&
      this._reconnection &&
      0 === this.backoff.attempts &&
      this.reconnect();
  }
  open(e) {
    if (!~this._readyState.indexOf("open")) {
      this.engine = new Rr(this.uri, this.opts);
      const s = this.engine,
        o = this,
        n =
          ((this._readyState = "opening"),
          (this.skipReconnect = !1),
          Yr(s, "open", function () {
            o.onopen(), e && e();
          })),
        i = (t) => {
          this.cleanup(),
            (this._readyState = "closed"),
            this.emitReserved("error", t),
            e ? e(t) : this.maybeReconnectOnOpen();
        };
      var t = Yr(s, "error", i);
      if (!1 !== this._timeout) {
        var r = this._timeout;
        const e = this.setTimeoutFn(() => {
          n(), i(new Error("timeout")), s.close();
        }, r);
        this.opts.autoUnref && e.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(e);
          });
      }
      this.subs.push(n), this.subs.push(t);
    }
    return this;
  }
  connect(e) {
    return this.open(e);
  }
  onopen() {
    this.cleanup(), (this._readyState = "open"), this.emitReserved("open");
    var e = this.engine;
    this.subs.push(
      Yr(e, "ping", this.onping.bind(this)),
      Yr(e, "data", this.ondata.bind(this)),
      Yr(e, "error", this.onerror.bind(this)),
      Yr(e, "close", this.onclose.bind(this)),
      Yr(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  onping() {
    this.emitReserved("ping");
  }
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (e) {
      this.onclose("parse error", e);
    }
  }
  ondecoded(e) {
    Cr(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  onerror(e) {
    this.emitReserved("error", e);
  }
  socket(e, t) {
    let r = this.nsps[e];
    return (
      r
        ? this._autoConnect && !r.active && r.connect()
        : ((r = new Jr(this, e, t)), (this.nsps[e] = r)),
      r
    );
  }
  _destroy(e) {
    for (const e of Object.keys(this.nsps)) {
      if (this.nsps[e].active) return;
    }
    this._close();
  }
  _packet(e) {
    var t = this.encoder.encode(e);
    for (let r = 0; r < t.length; r++) this.engine.write(t[r], e.options);
  }
  cleanup() {
    this.subs.forEach((e) => e()),
      (this.subs.length = 0),
      this.decoder.destroy();
  }
  _close() {
    (this.skipReconnect = !0),
      (this._reconnecting = !1),
      this.onclose("forced close"),
      this.engine && this.engine.close();
  }
  disconnect() {
    return this._close();
  }
  onclose(e, t) {
    this.cleanup(),
      this.backoff.reset(),
      (this._readyState = "closed"),
      this.emitReserved("close", e, t),
      this._reconnection && !this.skipReconnect && this.reconnect();
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect) return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        (this._reconnecting = !1);
    else {
      var t = this.backoff.duration();
      this._reconnecting = !0;
      const r = this.setTimeoutFn(() => {
        e.skipReconnect ||
          (this.emitReserved("reconnect_attempt", e.backoff.attempts),
          e.skipReconnect) ||
          e.open((t) => {
            t
              ? ((e._reconnecting = !1),
                e.reconnect(),
                this.emitReserved("reconnect_error", t))
              : e.onreconnect();
          });
      }, t);
      this.opts.autoUnref && r.unref(),
        this.subs.push(() => {
          this.clearTimeoutFn(r);
        });
    }
  }
  onreconnect() {
    var e = this.backoff.attempts;
    (this._reconnecting = !1),
      this.backoff.reset(),
      this.emitReserved("reconnect", e);
  }
}
const Zr = {};
function es(e, t) {
  "object" == typeof e && ((t = e), (e = void 0));
  e = (function (e, t = "", r) {
    let s = e;
    return (
      (r = r || ("undefined" != typeof location && location)),
      "string" == typeof (e = null == e ? r.protocol + "//" + r.host : e) &&
        ("/" === e.charAt(0) &&
          (e = "/" === e.charAt(1) ? r.protocol + e : r.host + e),
        /^(https?|wss?):\/\//.test(e) ||
          (e = void 0 !== r ? r.protocol + "//" + e : "https://" + e),
        (s = $r(e))),
      s.port ||
        (/^(http|ws)$/.test(s.protocol)
          ? (s.port = "80")
          : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")),
      (s.path = s.path || "/"),
      (e = -1 !== s.host.indexOf(":") ? "[" + s.host + "]" : s.host),
      (s.id = s.protocol + "://" + e + ":" + s.port + t),
      (s.href =
        s.protocol + "://" + e + (r && r.port === s.port ? "" : ":" + s.port)),
      s
    );
  })(e, (t = t || {}).path || "/socket.io");
  var r = e.source,
    s = e.id,
    o = e.path;
  o = Zr[s] && o in Zr[s].nsps;
  let n;
  return (
    (n = (o =
      t.forceNew || t["force new connection"] || !1 === t.multiplex || o)
      ? new Qr(r, t)
      : (Zr[s] || (Zr[s] = new Qr(r, t)), Zr[s])),
    e.query && !t.query && (t.query = e.queryKey),
    n.socket(e.path, t)
  );
}
Object.assign(es, { Manager: Qr, Socket: Jr, io: es, connect: es });
const ts = se("<style>"),
  rs = se(
    '<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true"><style></style><div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"></div><div class="fixed inset-0 z-10 overflow-y-auto"><div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"><div class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">'
  ),
  ss = se("<div><pre>");
const os = (e) => {
    let t;
    const [r] = V(e, ["onOpen", "onClose", "isOpen", "value"]),
      [s, o] =
        (P(() => {
          t &&
            (t.innerHTML = (function (e) {
              return (e = (e =
                "string" != typeof e ? JSON.stringify(e, void 0, 2) : e)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")).replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
                function (e) {
                  let t = "number";
                  return (
                    /^"/.test(e)
                      ? (t = /:$/.test(e) ? "key" : "string")
                      : /true|false/.test(e)
                      ? (t = "boolean")
                      : /null/.test(e) && (t = "null"),
                    '<span class="' + t + '">' + e + "</span>"
                  );
                }
              );
            })(JSON.stringify(e?.value, void 0, 2)));
        }),
        x(r.isOpen ?? !1)),
      n =
        (_(() => {
          xe(e.isOpen) || e.isOpen === s() || a();
        }),
        (e) => {
          e.stopPropagation();
        }),
      i = () => {
        o(!1), r.onClose?.(), (document.body.style.overflow = "auto");
      },
      a = () => {
        s()
          ? i()
          : (o(!0), r.onOpen?.(), (document.body.style.overflow = "hidden"));
      };
    return U(X, {
      get when() {
        return s();
      },
      get children() {
        return [
          (ce((o = ts()), ve), o),
          ((o = rs()),
          (r = o.firstChild),
          (s = r.nextSibling.nextSibling.firstChild.firstChild),
          o.style.setProperty("z-index", "1100"),
          o.addEventListener("click", i),
          ce(r, ve),
          s.style.setProperty("background-color", "transparent"),
          s.style.setProperty("margin-left", "20px"),
          s.style.setProperty("margin-right", "20px"),
          s.addEventListener("click", n),
          s.addEventListener("pointerdown", n),
          ce(
            s,
            (() => {
              const r = C(() => !!e.value);
              return () => {
                return (
                  r() &&
                  ((s = (e = ss()).firstChild),
                  e.style.setProperty("background", "white"),
                  e.style.setProperty("margin", "auto"),
                  e.style.setProperty("padding", "7px"),
                  "function" == typeof (o = t) ? le(o, s) : (t = s),
                  e)
                );
                var e, s, o;
              };
            })()
          ),
          o),
        ];
        var r, s, o;
      },
    });
  },
  ns = se("<div>"),
  is = se(
    '<div><div class="flex w-full h-full justify-center"><div class="overflow-y-scroll min-w-full w-full min-h-full px-3 pt-10 relative scrollable-container chatbot-chat-view scroll-smooth">'
  ),
  as = se('<span class="px-3 whitespace-pre-wrap font-semibold max-w-full">'),
  ls = se("<span>Clear"),
  cs = se("<div><div>"),
  hs = se('<div class="w-full h-32">'),
  ps = "Hi there! How can I help?",
  us = (e) => {
    const t = W({ showTitle: !0 }, e);
    let r, s, o;
    const [n, i] = x(""),
      [a, l] = x(!1),
      [c, h] = x(!1),
      [p, u] = x({}),
      [d, f] = x([{ message: t.welcomeMessage ?? ps, type: "apiMessage" }], {
        equals: !1,
      }),
      [g, b] = x(""),
      [w, m] = x(!1),
      [y, v] = x(Ne()),
      [S, A] = x([], { equals: !1 }),
      T =
        (P(() => {
          if (e?.observersConfig) {
            const {
              observeUserInput: t,
              observeLoading: r,
              observeMessages: s,
            } = e.observersConfig;
            "function" == typeof t &&
              C(() => {
                t(n());
              }),
              "function" == typeof r &&
                C(() => {
                  r(a());
                }),
              "function" == typeof s &&
                C(() => {
                  s(d());
                });
          }
          s &&
            setTimeout(() => {
              r?.scrollTo(0, r.scrollHeight);
            }, 50);
        }),
        () => {
          setTimeout(() => {
            r?.scrollTo(0, r.scrollHeight);
          }, 50);
        }),
      E = (e) => {
        localStorage.setItem(
          t.chatflowid + "_EXTERNAL",
          JSON.stringify({ chatId: y(), chatHistory: e })
        );
      },
      $ = (e) => {
        f((t) => {
          var r = t.map((r, s) =>
            s === t.length - 1 ? { ...r, message: r.message + e } : r
          );
          return E(r), [...r];
        });
      },
      R = (e) => {
        f((t) => {
          var r = t.map((r, s) =>
            s === t.length - 1 ? { ...r, sourceDocuments: e } : r
          );
          return E(r), [...r];
        });
      },
      O = async (e) => {
        if ((i(e), "" !== e.trim())) {
          l(!0), T();
          const o = t.welcomeMessage ?? ps;
          var r,
            s = d().filter((e) => e.message !== o);
          (s =
            (f(
              (t) => (
                (t = [...t, { message: e, type: "userMessage" }]), E(t), t
              )
            ),
            { question: e, history: s, chatId: y() })),
            (s =
              (t.chatflowConfig && (s.overrideConfig = t.chatflowConfig),
              w() && (s.socketIOClientId = g()),
              await (({
                chatflowid: e,
                apiHost: t = "http://localhost:3000",
                body: r,
              }) =>
                _e({
                  method: "POST",
                  url: t + "/api/v1/prediction/" + e,
                  body: r,
                }))({
                chatflowid: t.chatflowid,
                apiHost: t.apiHost,
                body: s,
              })));
          if (s.data) {
            const e = s.data;
            if (!w()) {
              let t = "";
              (t =
                e.text ||
                (e.json
                  ? JSON.stringify(e.json, null, 2)
                  : JSON.stringify(e, null, 2))),
                f(
                  (r) => (
                    (r = [
                      ...r,
                      {
                        message: t,
                        sourceDocuments: e?.sourceDocuments,
                        fileAnnotations: e?.fileAnnotations,
                        type: "apiMessage",
                      },
                    ]),
                    E(r),
                    r
                  )
                );
            }
            l(!1), i(""), T();
          }
          s.error &&
            ((s = s.error),
            console.error(s),
            (s =
              "string" == typeof s
                ? s
                : s.response.data ||
                  s.response.status + ": " + s.response.statusText),
            ([r = "Oops! There seems to be an error. Please try again."] = [s]),
            f(
              (e) => ((e = [...e, { message: r, type: "apiMessage" }]), E(e), e)
            ),
            l(!1),
            i(""),
            T());
        }
      },
      B = () => {
        try {
          localStorage.removeItem(t.chatflowid + "_EXTERNAL"),
            v(Ne()),
            f([{ message: t.welcomeMessage ?? ps, type: "apiMessage" }]);
        } catch (t) {
          var e =
            t.response.data || t.response.status + ": " + t.response.statusText;
          console.error("error: " + e);
        }
      },
      L =
        (_(() => {
          d() && T();
        }),
        _(() => {
          t.fontSize && o && (o.style.fontSize = t.fontSize + "px");
        }),
        _(async () => {
          var e = ((e = localStorage.getItem(t.chatflowid + "_EXTERNAL")) &&
            ((e = JSON.parse(e)),
            v(e.chatId),
            (e = e.chatHistory.map((e) => {
              var t = { message: e.message, type: e.type };
              return (
                e.sourceDocuments && (t.sourceDocuments = e.sourceDocuments),
                e.fileAnnotations && (t.fileAnnotations = e.fileAnnotations),
                t
              );
            })),
            f([...e])),
          await (({ chatflowid: e, apiHost: t = "http://localhost:3000" }) =>
            _e({ method: "GET", url: t + "/api/v1/chatflows-streaming/" + e }))(
            { chatflowid: t.chatflowid, apiHost: t.apiHost }
          )).data;
          e && m(e?.isStreaming ?? !1),
            (e = await (({
              chatflowid: e,
              apiHost: t = "http://localhost:3000",
            }) =>
              _e({
                method: "GET",
                url: t + "/api/v1/public-chatbotConfig/" + e,
              }))({ chatflowid: t.chatflowid, apiHost: t.apiHost }));
          if (e.data) {
            const t = e.data;
            if (t.starterPrompts) {
              const e = [];
              Object.getOwnPropertyNames(t.starterPrompts).forEach((r) => {
                e.push(t.starterPrompts[r].prompt);
              }),
                A(e);
            }
          }
          const r = es(t.apiHost);
          return (
            r.on("connect", () => {
              b(r.id);
            }),
            r.on("start", () => {
              f((e) => [...e, { message: "", type: "apiMessage" }]);
            }),
            r.on("sourceDocuments", R),
            r.on("token", $),
            () => {
              i(""),
                l(!1),
                f([{ message: t.welcomeMessage ?? ps, type: "apiMessage" }]),
                r && (r.disconnect(), b(""));
            }
          );
        }),
        (e) => {
          try {
            return new URL(e);
          } catch (e) {}
        });
    return [
      (() => {
        const e = is(),
          i = e.firstChild,
          l = i.firstChild;
        var c;
        return (
          "function" ==
          typeof (c = ("function" == typeof (c = o) ? le(c, e) : (o = e), r))
            ? le(c, l)
            : (r = l),
          l.style.setProperty("padding-bottom", "100px"),
          l.style.setProperty("padding-top", "70px"),
          ce(
            l,
            U(Y, {
              get each() {
                return [...d()];
              },
              children: (e, r) => [
                C(
                  (() => {
                    const r = C(() => "userMessage" === e.type);
                    return () =>
                      r() &&
                      U(yt, {
                        get message() {
                          return e.message;
                        },
                        get backgroundColor() {
                          return t.userMessage?.backgroundColor;
                        },
                        get textColor() {
                          return t.userMessage?.textColor;
                        },
                        get showAvatar() {
                          return t.userMessage?.showAvatar;
                        },
                        get avatarSrc() {
                          return t.userMessage?.avatarSrc;
                        },
                      });
                  })()
                ),
                C(
                  (() => {
                    const r = C(() => "apiMessage" === e.type);
                    return () =>
                      r() &&
                      U(xt, {
                        get message() {
                          return e.message;
                        },
                        get fileAnnotations() {
                          return e.fileAnnotations;
                        },
                        get apiHost() {
                          return t.apiHost;
                        },
                        get backgroundColor() {
                          return t.botMessage?.backgroundColor;
                        },
                        get textColor() {
                          return t.botMessage?.textColor;
                        },
                        get showAvatar() {
                          return t.botMessage?.showAvatar;
                        },
                        get avatarSrc() {
                          return t.botMessage?.avatarSrc;
                        },
                      });
                  })()
                ),
                C(
                  (() => {
                    const t = C(
                      () =>
                        !(
                          "userMessage" !== e.type ||
                          !a() ||
                          r() !== d().length - 1
                        )
                    );
                    return () => t() && U(St, {});
                  })()
                ),
                C(
                  (() => {
                    const t = C(
                      () => !(!e.sourceDocuments || !e.sourceDocuments.length)
                    );
                    return () => {
                      return (
                        t() &&
                        ((r = ns()).style.setProperty("display", "flex"),
                        r.style.setProperty("flex-direction", "row"),
                        r.style.setProperty("width", "100%"),
                        ce(
                          r,
                          U(Y, {
                            get each() {
                              return [
                                ...((e) => {
                                  const t = [],
                                    r = [];
                                  return (
                                    e.sourceDocuments.forEach((e) => {
                                      L(e.metadata.source) &&
                                      !t.includes(e.metadata.source)
                                        ? (t.push(e.metadata.source), r.push(e))
                                        : L(e.metadata.source) || r.push(e);
                                    }),
                                    r
                                  );
                                })(e),
                              ];
                            },
                            children: (e) => {
                              const t = L(e.metadata.source);
                              return U(At, {
                                get pageContent() {
                                  return t ? t.pathname : e.pageContent;
                                },
                                get metadata() {
                                  return e.metadata;
                                },
                                onSourceClick: () => {
                                  t
                                    ? window.open(e.metadata.source, "_blank")
                                    : (u(e), h(!0));
                                },
                              });
                            },
                          })
                        ),
                        r)
                      );
                      var r;
                    };
                  })()
                ),
              ],
            })
          ),
          ce(
            i,
            (() => {
              const e = C(() => !!t.showTitle);
              return () => {
                if (e()) {
                  const e = cs(),
                    r = e.firstChild;
                  return (
                    e.style.setProperty("display", "flex"),
                    e.style.setProperty("flex-direction", "row"),
                    e.style.setProperty("align-items", "center"),
                    e.style.setProperty("height", "50px"),
                    e.style.setProperty("position", "absolute"),
                    e.style.setProperty("top", "0"),
                    e.style.setProperty("left", "0"),
                    e.style.setProperty("width", "100%"),
                    ce(
                      e,
                      U(X, {
                        get when() {
                          return t.titleAvatarSrc;
                        },
                        get children() {
                          return [
                            ((e = ns()).style.setProperty("width", "15px"), e),
                            U(rt, {
                              get initialAvatarSrc() {
                                return t.titleAvatarSrc;
                              },
                            }),
                          ];
                          var e;
                        },
                      }),
                      r
                    ),
                    ce(
                      e,
                      U(X, {
                        get when() {
                          return t.title;
                        },
                        get children() {
                          var e = as();
                          return ce(e, () => t.title), e;
                        },
                      }),
                      r
                    ),
                    r.style.setProperty("flex", "1"),
                    ce(
                      e,
                      U(Ye, {
                        get sendButtonColor() {
                          return t.bubbleTextColor;
                        },
                        type: "button",
                        get isDisabled() {
                          return 1 === d().length;
                        },
                        class: "my-2 ml-2",
                        "on:click": B,
                        get children() {
                          var e = ls();
                          return (
                            e.style.setProperty(
                              "font-family",
                              "Poppins, sans-serif"
                            ),
                            e
                          );
                        },
                      }),
                      null
                    ),
                    k(
                      (r) => {
                        var s = t.bubbleBackgroundColor,
                          o = t.bubbleTextColor,
                          n = t.isFullPage ? "0px" : "6px",
                          i = t.isFullPage ? "0px" : "6px";
                        return (
                          s !== r._v$ &&
                            (null != (r._v$ = s)
                              ? e.style.setProperty("background", s)
                              : e.style.removeProperty("background")),
                          o !== r._v$2 &&
                            (null != (r._v$2 = o)
                              ? e.style.setProperty("color", o)
                              : e.style.removeProperty("color")),
                          n !== r._v$3 &&
                            (null != (r._v$3 = n)
                              ? e.style.setProperty("border-top-left-radius", n)
                              : e.style.removeProperty(
                                  "border-top-left-radius"
                                )),
                          i !== r._v$4 &&
                            (null != (r._v$4 = i)
                              ? e.style.setProperty(
                                  "border-top-right-radius",
                                  i
                                )
                              : e.style.removeProperty(
                                  "border-top-right-radius"
                                )),
                          r
                        );
                      },
                      { _v$: void 0, _v$2: void 0, _v$3: void 0, _v$4: void 0 }
                    ),
                    e
                  );
                }
                return null;
              };
            })(),
            null
          ),
          ce(
            i,
            U(Qe, {
              get backgroundColor() {
                return t.textInput?.backgroundColor;
              },
              get textColor() {
                return t.textInput?.textColor;
              },
              get placeholder() {
                return t.textInput?.placeholder;
              },
              get sendButtonColor() {
                return t.textInput?.sendButtonColor;
              },
              get fontSize() {
                return t.fontSize;
              },
              get disabled() {
                return a();
              },
              get defaultValue() {
                return n();
              },
              onSubmit: O,
            }),
            null
          ),
          ce(
            e,
            U(X, {
              get when() {
                return 1 === d().length;
              },
              get children() {
                return U(X, {
                  get when() {
                    return 0 < S().length;
                  },
                  get children() {
                    var e = ns();
                    return (
                      e.style.setProperty("display", "flex"),
                      e.style.setProperty("flex-direction", "row"),
                      e.style.setProperty("padding", "10px"),
                      e.style.setProperty("width", "100%"),
                      e.style.setProperty("flex-wrap", "wrap"),
                      ce(
                        e,
                        U(Y, {
                          get each() {
                            return [...S()];
                          },
                          children: (e) =>
                            U(Et, {
                              prompt: e,
                              onPromptClick: () => {
                                O(e);
                              },
                            }),
                        })
                      ),
                      e
                    );
                  },
                });
              },
            }),
            null
          ),
          ce(
            e,
            U(Ot, {
              get badgeBackgroundColor() {
                return t.badgeBackgroundColor;
              },
              get poweredByTextColor() {
                return t.poweredByTextColor;
              },
              botContainer: o,
            }),
            null
          ),
          ce(
            e,
            U(ds, {
              ref(e) {
                "function" == typeof s ? s(e) : (s = e);
              },
            }),
            null
          ),
          k(() =>
            ie(
              e,
              "relative flex w-full h-full text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container " +
                t.class
            )
          ),
          e
        );
      })(),
      C(
        (() => {
          const e = C(() => !!c());
          return () =>
            e() &&
            U(os, {
              get isOpen() {
                return c();
              },
              get value() {
                return p();
              },
              onClose: () => h(!1),
            });
        })()
      ),
    ];
  },
  ds = (e) => {
    return (
      (t = hs()), "function" == typeof (r = e.ref) ? le(r, t) : (e.ref = t), t
    );
    var t, r;
  },
  fs = se("<style>"),
  gs = se('<div part="bot">'),
  bs = (e) => {
    const [t] = V(e, ["theme"]),
      [r, s] = x(!1),
      [o, n] = x(!1);
    var i;
    return [
      (ce((i = fs()), ve), i),
      U(
        Ae,
        W(() => t.theme?.button, {
          toggleBot: () => {
            r() ? s(!1) : (o() || n(!0), s(!0));
          },
          get isBotOpened() {
            return r();
          },
        })
      ),
      (() => {
        const s = gs();
        return (
          s.style.setProperty(
            "transition",
            "transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out"
          ),
          s.style.setProperty("transform-origin", "bottom right"),
          s.style.setProperty("box-shadow", "rgb(0 0 0 / 16%) 0px 5px 40px"),
          s.style.setProperty("z-index", "42424242"),
          ce(
            s,
            U(X, {
              get when() {
                return o();
              },
              get children() {
                return U(us, {
                  get badgeBackgroundColor() {
                    return t.theme?.chatWindow?.backgroundColor;
                  },
                  get bubbleBackgroundColor() {
                    return t.theme?.button?.backgroundColor ?? "#3B81F6";
                  },
                  get bubbleTextColor() {
                    return t.theme?.button?.iconColor ?? "white";
                  },
                  get showTitle() {
                    return t.theme?.chatWindow?.showTitle;
                  },
                  get title() {
                    return t.theme?.chatWindow?.title;
                  },
                  get titleAvatarSrc() {
                    return t.theme?.chatWindow?.titleAvatarSrc;
                  },
                  get welcomeMessage() {
                    return t.theme?.chatWindow?.welcomeMessage;
                  },
                  get poweredByTextColor() {
                    return t.theme?.chatWindow?.poweredByTextColor;
                  },
                  get textInput() {
                    return t.theme?.chatWindow?.textInput;
                  },
                  get botMessage() {
                    return t.theme?.chatWindow?.botMessage;
                  },
                  get userMessage() {
                    return t.theme?.chatWindow?.userMessage;
                  },
                  get fontSize() {
                    return t.theme?.chatWindow?.fontSize;
                  },
                  get chatflowid() {
                    return e.chatflowid;
                  },
                  get chatflowConfig() {
                    return e.chatflowConfig;
                  },
                  get apiHost() {
                    return e.apiHost;
                  },
                  get observersConfig() {
                    return e.observersConfig;
                  },
                });
              },
            })
          ),
          k(
            (o) => {
              var n = t.theme?.chatWindow?.height
                  ? t.theme?.chatWindow?.height.toString() + "px"
                  : "calc(100% - 100px)",
                i = t.theme?.chatWindow?.width
                  ? t.theme?.chatWindow?.width.toString() + "px"
                  : void 0,
                a = r() ? "scale3d(1, 1, 1)" : "scale3d(0, 0, 1)",
                l = t.theme?.chatWindow?.backgroundColor || "#ffffff",
                c =
                  "fixed sm:right-5 rounded-lg w-full sm:w-[400px] max-h-[704px]" +
                  (r() ? " opacity-1" : " opacity-0 pointer-events-none") +
                  ("large" === e.theme?.button?.size
                    ? " bottom-24"
                    : " bottom-20");
              return (
                n !== o._v$ &&
                  (null != (o._v$ = n)
                    ? s.style.setProperty("height", n)
                    : s.style.removeProperty("height")),
                i !== o._v$2 &&
                  (null != (o._v$2 = i)
                    ? s.style.setProperty("width", i)
                    : s.style.removeProperty("width")),
                a !== o._v$3 &&
                  (null != (o._v$3 = a)
                    ? s.style.setProperty("transform", a)
                    : s.style.removeProperty("transform")),
                l !== o._v$4 &&
                  (null != (o._v$4 = l)
                    ? s.style.setProperty("background-color", l)
                    : s.style.removeProperty("background-color")),
                c !== o._v$5 && ie(s, (o._v$5 = c)),
                o
              );
            },
            {
              _v$: void 0,
              _v$2: void 0,
              _v$3: void 0,
              _v$4: void 0,
              _v$5: void 0,
            }
          ),
          s
        );
      })(),
    ];
  },
  ws = se("<style>"),
  ms = se("<div>"),
  ys = (e, { element: t }) => {
    const [r, s] = x(!1),
      o = new IntersectionObserver((e) => {
        e.some((e) => e.isIntersecting) && s(!0);
      });
    return (
      P(() => {
        o.observe(t);
      }),
      A(() => {
        o.disconnect();
      }),
      [
        (ce((n = ws()), ve), n),
        U(X, {
          get when() {
            return r();
          },
          get children() {
            const t = ms();
            return (
              t.style.setProperty("margin", "0px"),
              ce(
                t,
                U(us, {
                  get badgeBackgroundColor() {
                    return e.theme?.chatWindow?.backgroundColor;
                  },
                  get bubbleBackgroundColor() {
                    return e.theme?.button?.backgroundColor ?? "#3B81F6";
                  },
                  get bubbleTextColor() {
                    return e.theme?.button?.iconColor ?? "white";
                  },
                  get showTitle() {
                    return e.theme?.chatWindow?.showTitle;
                  },
                  get title() {
                    return e.theme?.chatWindow?.title;
                  },
                  get titleAvatarSrc() {
                    return e.theme?.chatWindow?.titleAvatarSrc;
                  },
                  get welcomeMessage() {
                    return e.theme?.chatWindow?.welcomeMessage;
                  },
                  get poweredByTextColor() {
                    return e.theme?.chatWindow?.poweredByTextColor;
                  },
                  get textInput() {
                    return e.theme?.chatWindow?.textInput;
                  },
                  get botMessage() {
                    return e.theme?.chatWindow?.botMessage;
                  },
                  get userMessage() {
                    return e.theme?.chatWindow?.userMessage;
                  },
                  get fontSize() {
                    return e.theme?.chatWindow?.fontSize;
                  },
                  get chatflowid() {
                    return e.chatflowid;
                  },
                  get chatflowConfig() {
                    return e.chatflowConfig;
                  },
                  get apiHost() {
                    return e.apiHost;
                  },
                  isFullPage: !0,
                  get observersConfig() {
                    return e.observersConfig;
                  },
                })
              ),
              k(
                (r) => {
                  var s = e.theme?.chatWindow?.backgroundColor || "#ffffff",
                    o = e.theme?.chatWindow?.height
                      ? e.theme?.chatWindow?.height.toString() + "px"
                      : "100vh",
                    n = e.theme?.chatWindow?.width
                      ? e.theme?.chatWindow?.width.toString() + "px"
                      : "100%";
                  return (
                    s !== r._v$ &&
                      (null != (r._v$ = s)
                        ? t.style.setProperty("background-color", s)
                        : t.style.removeProperty("background-color")),
                    o !== r._v$2 &&
                      (null != (r._v$2 = o)
                        ? t.style.setProperty("height", o)
                        : t.style.removeProperty("height")),
                    n !== r._v$3 &&
                      (null != (r._v$3 = n)
                        ? t.style.setProperty("width", n)
                        : t.style.removeProperty("width")),
                    r
                  );
                },
                { _v$: void 0, _v$2: void 0, _v$3: void 0 }
              ),
              t
            );
          },
        }),
      ]
    );
    var n;
  },
  vs = (e) => {
    var t = e.id
      ? document.getElementById(e.id)
      : document.querySelector("flowise-fullchatbot");
    if (!t) throw new Error("<flowise-fullchatbot> element not found.");
    Object.assign(t, e);
  },
  xs = (e) => {
    var t = document.createElement("flowise-chatbot");
    Object.assign(t, e), document.body.appendChild(t);
  },
  ks =
    ("undefined" != typeof window &&
      (me("flowise-fullchatbot", ye, ys), me("flowise-chatbot", ye, bs)),
    { initFull: vs, init: xs });
((e) => {
  "undefined" != typeof window && (window.Chatbot = { ...e });
})(ks);
export { ks as default };
