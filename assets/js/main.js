/* Khodiyar Restaurant — shared page script: links, menu rendering, WhatsApp order cart */
(function () {
  "use strict";
  var K = window.KHODIYAR;
  if (!K) return;
  var C = K.config;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function rupees(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function photoUrl(key, w) {
    var id = K.photos[key];
    return id ? "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&q=70&w=" + w : "";
  }
  function imgTag(key, sizes, alt, eager) {
    if (!key || !K.photos[key]) return "";
    var set = [400, 800, 1200].map(function (w) { return photoUrl(key, w) + " " + w + "w"; }).join(", ");
    return '<img ' + (eager ? "" : 'loading="lazy" ') + 'decoding="async" alt="' + esc(alt || "") + '" src="' + photoUrl(key, 800) +
      '" srcset="' + set + '" sizes="' + (sizes || "100vw") + '">';
  }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function waLink(text) { return C.whatsapp + "?text=" + encodeURIComponent(text); }

  var ICON = {
    arr: '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    chat: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5A12.5 12.5 0 0 0 5.2 22.3L3.6 28.4l6.3-1.6A12.5 12.5 0 1 0 16 3.5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M11.6 9.6c.4 0 .8.1 1 .6l1.2 2.7c.1.3.1.7-.1 1l-.9 1.1c-.2.2-.2.5 0 .8.9 1.6 2.2 2.9 3.9 3.8.3.2.6.1.8-.1l1-1.1c.3-.3.7-.4 1-.2l2.6 1.2c.4.2.6.6.5 1.1-.3 1.6-1.6 2.6-3.1 2.5-4.8-.4-9.6-5.1-10-9.9-.1-1.5.8-2.9 2.1-3.5z" fill="currentColor"/></svg>',
    call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>'
  };

  /* ---------- catalogue: one entry per orderable line ---------- */
  var CAT = {};          // key -> {name, price}
  var BY_NAME = {};      // dish name -> first key (for featured cards)
  K.menu.forEach(function (cat) {
    cat.items.forEach(function (it, i) {
      var base = cat.id + "-" + i;
      it._key = base;
      if (it.v) {
        it.v.forEach(function (v, vi) { CAT[base + "-" + vi] = { name: it.n + " (" + v[0] + ")", price: v[1] }; });
      } else {
        CAT[base] = { name: it.n, price: it.p };
        if (!BY_NAME[it.n]) BY_NAME[it.n] = base;
      }
    });
  });
  function minPrice(cat) {
    var m = Infinity;
    cat.items.forEach(function (it) {
      if (it.v) it.v.forEach(function (v) { m = Math.min(m, v[1]); });
      else m = Math.min(m, it.p);
    });
    return m;
  }

  /* ---------- static links ---------- */
  var linkMap = {
    zomato: C.zomato,
    whatsapp: waLink(C.whatsappText),
    call: C.phoneLink,
    email: "mailto:" + C.email,
    review: C.googleReview
  };
  $$("[data-link]").forEach(function (a) {
    var href = linkMap[a.getAttribute("data-link")];
    if (!href) return;
    a.setAttribute("href", href);
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-text]").forEach(function (el) {
    var k = el.getAttribute("data-text");
    if (k === "phone") el.textContent = C.phoneDisplay;
    if (k === "email") el.textContent = C.email;
  });
  $$("[data-price-of]").forEach(function (el) {
    var key = BY_NAME[el.getAttribute("data-price-of")];
    if (key) el.textContent = CAT[key].price;
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var total = Object.keys(CAT).length;
  $$("[data-dish-count]").forEach(function (el) { el.textContent = (Math.floor(total / 5) * 5) + "+"; });

  /* ---------- header: mobile nav + header height ---------- */
  var header = $(".site-header");
  var toggle = $("#menu-toggle");
  var mnav = $("#mobile-nav");
  function setHdr() { if (header) document.documentElement.style.setProperty("--hdr-h", header.offsetHeight + "px"); }
  if (toggle && mnav) {
    toggle.addEventListener("click", function () {
      var open = mnav.hidden;
      mnav.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      setHdr();
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { mnav.hidden = true; toggle.setAttribute("aria-expanded", "false"); setHdr(); }); });
  }
  setHdr();
  window.addEventListener("resize", setHdr);

  /* ---------- home: featured dish cards ---------- */
  var dishesEl = $("#dishes");
  if (dishesEl && K.featured) {
    var n = K.featured.length;
    dishesEl.innerHTML = K.featured.map(function (f, i) {
      var key = BY_NAME[f.dish];
      if (!key) return "";
      var words = f.dish.split(" ");
      var title = esc(words[0]) + (words.length > 1 ? " <em>" + esc(words.slice(1).join(" ")) + "</em>" : "");
      var pad = function (x) { return (x < 10 ? "0" : "") + x; };
      return '<article class="dish reveal">' +
        '<div class="dish-top"><span class="pill-label">' + esc(f.label) + '</span><span class="dish-num">' + pad(i + 1) + " — " + pad(n) + "</span></div>" +
        '<div class="dish-photo"><span class="ph" aria-hidden="true"></span>' + imgTag(f.photo, "(min-width:1040px) 360px, (min-width:700px) 45vw, 92vw", f.dish) + "</div>" +
        '<span class="dish-kicker">' + esc(f.kicker) + "</span>" +
        "<h3>" + title + "</h3>" +
        "<p>" + esc(f.desc) + "</p>" +
        '<div class="dish-price"><strong>' + rupees(CAT[key].price) + "</strong></div>" +
        '<div data-ctl="' + key + '" data-style="big"></div>' +
        "</article>";
    }).join("");
  }

  /* ---------- home: category cards ---------- */
  var catsEl = $("#cats");
  if (catsEl) {
    catsEl.innerHTML = K.menu.map(function (cat) {
      return '<a class="cat reveal" data-hue="' + cat.hue + '" href="menu.html#' + cat.id + '">' +
        '<span class="cat-photo"><span class="ph" aria-hidden="true"></span>' + imgTag(cat.img, "(min-width:760px) 25vw, 50vw", "") +
        '<span class="count">' + cat.items.length + " dishes</span></span>" +
        '<span class="cat-body"><span class="gu">' + esc(cat.gu) + "</span><h3>" + esc(cat.title) + '</h3><span class="from">from ' + rupees(minPrice(cat)) + "</span></span></a>";
    }).join("");
  }

  /* ---------- menu page ---------- */
  var root = $("#menu-root");
  if (root) {
    $("#chips").innerHTML = K.menu.map(function (cat) {
      return '<a class="chip" data-hue="' + cat.hue + '" href="#' + cat.id + '">' + esc(cat.title) + "</a>";
    }).join("");
    root.innerHTML = K.menu.map(function (cat) {
      var rows = cat.items.map(function (it) {
        var badge = it.tag === "special" ? '<span class="badge">★ House special</span>' : "";
        var price, act;
        if (it.v) {
          price = it.v.map(function (v) { return esc(v[0]) + " " + rupees(v[1]); }).join(" · ");
          act = it.v.map(function (v, vi) { return '<span data-ctl="' + it._key + "-" + vi + '" data-style="small" data-vl="' + esc(v[0]) + '"></span>'; }).join("");
        } else {
          price = rupees(it.p);
          act = '<span data-ctl="' + it._key + '" data-style="small"></span>';
        }
        return '<li class="m-item' + (it.v ? " has-variants" : "") + '" data-name="' + esc(it.n.toLowerCase()) + '">' +
          '<span class="veg" title="Vegetarian"></span>' +
          '<span class="m-name"><span class="n">' + esc(it.n) + "</span>" + badge + '<span class="m-price">' + price + "</span></span>" +
          '<span class="m-act">' + act + "</span></li>";
      }).join("");
      return '<section class="m-section" id="' + cat.id + '" data-hue="' + cat.hue + '">' +
        '<div class="m-head"><div><span class="gu">' + esc(cat.gu) + "</span><h2>" + esc(cat.title) + '</h2><span class="meta">' +
        cat.items.length + " dishes · from " + rupees(minPrice(cat)) + "</span></div>" +
        '<div class="m-thumb"><span class="ph" aria-hidden="true"></span>' + imgTag(cat.img, "120px", "") + "</div></div>" +
        '<ul class="m-items">' + rows + "</ul></section>";
    }).join("");

    var input = $("#menu-search"), clearBtn = $("#search-clear"), emptyEl = $("#menu-empty");
    var runSearch = function () {
      var q = input.value.trim().toLowerCase();
      clearBtn.hidden = !q;
      var any = false;
      $$(".m-section", root).forEach(function (sec) {
        var shown = 0;
        var catHit = q && sec.querySelector("h2").textContent.toLowerCase().indexOf(q) !== -1;
        $$(".m-item", sec).forEach(function (li) {
          var nEl = $(".n", li), raw = nEl.textContent;
          var hit = !q || catHit || li.getAttribute("data-name").indexOf(q) !== -1;
          li.hidden = !hit;
          if (hit) shown++;
          var at = q ? raw.toLowerCase().indexOf(q) : -1;
          nEl.innerHTML = at === -1 ? esc(raw) : esc(raw.slice(0, at)) + "<mark>" + esc(raw.slice(at, at + q.length)) + "</mark>" + esc(raw.slice(at + q.length));
        });
        sec.hidden = shown === 0;
        if (shown) any = true;
      });
      emptyEl.hidden = any;
      if (!any) $("[data-q]", emptyEl).textContent = input.value.trim();
    };
    input.addEventListener("input", runSearch);
    clearBtn.addEventListener("click", function () { input.value = ""; runSearch(); input.focus(); });

    var chipsEl = $("#chips");
    var chips = $$(".chip", chipsEl);
    var sections = $$(".m-section", root);
    var current = null;
    var onScroll = function () {
      var offset = (header ? header.offsetHeight : 0) + chipsEl.offsetHeight + 40;
      var id = sections[0] && sections[0].id;
      sections.forEach(function (s) { if (!s.hidden && s.getBoundingClientRect().top - offset <= 0) id = s.id; });
      if (id === current) return;
      current = id;
      chips.forEach(function (c) {
        var on = c.getAttribute("href") === "#" + id;
        c.classList.toggle("active", on);
        if (on) chipsEl.scrollTo({ left: c.offsetLeft - chipsEl.clientWidth / 2 + c.clientWidth / 2, behavior: "smooth" });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ================= DINE-IN ORDER CART ================= */
  // Orders placed here are for guests sitting at a table. Delivery is through Zomato only.
  var CART_HOURS = 6; // an unsent order is forgotten after this many hours
  var saved = store("khodiyar-cart") || {};
  var cart = {};
  if (saved.items && saved.t && Date.now() - saved.t < CART_HOURS * 3600e3) cart = saved.items;
  Object.keys(cart).forEach(function (k) { if (!CAT[k] || !(cart[k] > 0)) delete cart[k]; });
  var details = { name: (store("khodiyar-details") || {}).name || "", table: "", notes: "" };
  try { details.table = sessionStorage.getItem("khodiyar-table") || ""; } catch (e) { /* ignore */ }

  // table number from the QR link: menu.html?table=5 or menu.html#table-5
  try {
    var qs = new URLSearchParams(location.search).get("table");
    var hm = /^#table-?(\w+)$/i.exec(location.hash);
    var fromLink = qs || (hm && hm[1]);
    if (fromLink) details.table = String(fromLink).slice(0, 10);
  } catch (e) { /* ignore */ }
  function showTableNote() {
    var tn = $("#table-note");
    if (!tn) return;
    tn.hidden = !details.table;
    $("b", tn).textContent = details.table;
  }
  showTableNote();

  /* drawer + bar + toast markup */
  var shell = document.createElement("div");
  shell.innerHTML =
    '<div class="overlay" id="overlay"></div>' +
    '<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">' +
      '<div class="drawer-head"><div style="display:grid;gap:6px"><span class="kicker">Dine-in order</span>' +
        '<h2 id="drawer-title">Your order <span>✳</span></h2></div>' +
        '<button class="icon-btn" id="drawer-close" type="button" aria-label="Close your order">' + ICON.close + "</button></div>" +
      '<div class="drawer-body">' +
        '<ul class="lines" id="lines"></ul>' +
        '<div class="cart-empty" id="cart-empty"><strong>Nothing here yet</strong><span>Add dishes from the menu and send your order to us on WhatsApp.</span>' +
          '<a class="btn btn-dark btn-sm" href="menu.html" id="empty-browse">Browse the menu</a></div>' +
        '<form class="order-form" id="order-form" novalidate>' +
          '<span class="form-title">Your table</span>' +
          '<div class="row2">' +
            '<div class="field" data-f="table"><label for="o-table">Table number</label><input id="o-table" name="table" autocomplete="off" placeholder="e.g. 5"><span class="err" hidden>Please add your table number.</span></div>' +
            '<div class="field" data-f="name"><label for="o-name">Your name <small>(optional)</small></label><input id="o-name" name="name" autocomplete="given-name" placeholder="First name"></div>' +
          "</div>" +
          '<div class="field" data-f="notes"><label for="o-notes">Notes <small>(optional)</small></label><textarea id="o-notes" name="notes" placeholder="Less spicy, Jain, no onion-garlic…"></textarea></div>' +
          '<div class="notice" role="note"><strong>For dine-in only</strong>' +
            "<span>Orders sent from here are served at your table. We don't deliver them. For delivery, please order on Zomato.</span>" +
            '<a href="' + esc(C.zomato) + '" target="_blank" rel="noopener">Order delivery on Zomato ↗</a></div>' +
        "</form>" +
      "</div>" +
      '<div class="drawer-foot">' +
        '<div class="subtotal"><span>Items total</span><strong id="subtotal">₹0</strong></div>' +
        '<p class="fine">No online payment. We confirm your order on WhatsApp and serve it at your table.</p>' +
        '<a class="btn btn-wa btn-block send-btn" id="send" href="#" target="_blank" rel="noopener">' + ICON.chat + " Send order on WhatsApp</a>" +
        '<button class="clear-link" id="clear" type="button">Clear order</button>' +
      "</div>" +
    "</aside>" +
    '<button class="order-bar" id="order-bar" type="button" aria-controls="drawer"><span class="ob-text"><small id="ob-count">0 items</small><strong id="ob-total">₹0</strong></span><span class="ob-cta">View order ' +
      '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
  while (shell.firstChild) document.body.appendChild(shell.firstChild);

  var drawer = $("#drawer"), overlay = $("#overlay"), form = $("#order-form"), sendBtn = $("#send");
  var bar = $("#order-bar"), toastEl = $("#toast");
  var lastFocus = null, toastTimer = null;

  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }
  function count() { var c = 0; for (var k in cart) c += cart[k]; return c; }
  function subtotal() { var s = 0; for (var k in cart) s += CAT[k].price * cart[k]; return s; }

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("lock");
    bar.classList.remove("show");
    setTimeout(function () { $("#drawer-close").focus(); }, 50);
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("lock");
    renderBar();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", openDrawer); });
  bar.addEventListener("click", openDrawer);
  $("#drawer-close").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  $("#empty-browse").addEventListener("click", function (e) { if (root) { e.preventDefault(); closeDrawer(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

  /* controls on cards and menu rows */
  function ctlHtml(el) {
    var key = el.getAttribute("data-ctl");
    var q = cart[key] || 0;
    var big = el.getAttribute("data-style") === "big";
    var vl = el.getAttribute("data-vl");
    var name = CAT[key] ? CAT[key].name : "";
    if (big) {
      if (!q) return '<button class="add" type="button" data-add="' + key + '">Add to my order ' + ICON.arr + "</button>";
      return '<div class="stepper"><span class="lbl">In your order</span><span class="ctl">' +
        '<button type="button" data-dec="' + key + '" aria-label="Remove one ' + esc(name) + '">−</button><output>' + q + "</output>" +
        '<button type="button" data-inc="' + key + '" aria-label="Add one more ' + esc(name) + '">+</button></span></div>';
    }
    if (!q) {
      return '<button class="add-sm" type="button" data-add="' + key + '" aria-label="Add ' + esc(name) + '">' +
        (vl ? esc(vl) + " <small>" + rupees(CAT[key].price) + "</small>" : "Add") + ' <span aria-hidden="true">+</span></button>';
    }
    return '<span class="qty-sm">' + (vl ? '<span class="vl">' + esc(vl) + "</span>" : "") +
      '<button type="button" data-dec="' + key + '" aria-label="Remove one ' + esc(name) + '">−</button><output>' + q + "</output>" +
      '<button type="button" data-inc="' + key + '" aria-label="Add one more ' + esc(name) + '">+</button></span>';
  }
  function syncControls() { $$("[data-ctl]").forEach(function (el) { el.innerHTML = ctlHtml(el); }); }

  function renderLines() {
    var keys = Object.keys(cart);
    $("#lines").innerHTML = keys.map(function (k) {
      var it = CAT[k];
      return '<li class="line"><span class="line-name">' + esc(it.name) + '<span class="line-each">' + rupees(it.price) + " each</span></span>" +
        '<span class="line-total">' + rupees(it.price * cart[k]) + "</span>" +
        '<span class="mini-stepper"><button type="button" data-dec="' + k + '" aria-label="Remove one ' + esc(it.name) + '">−</button><output>' + cart[k] +
        '</output><button type="button" data-inc="' + k + '" aria-label="Add one more ' + esc(it.name) + '">+</button></span></li>';
    }).join("");
    var empty = keys.length === 0;
    $("#cart-empty").hidden = !empty;
    form.hidden = empty;
    $("#clear").hidden = empty;
    $("#subtotal").textContent = rupees(subtotal());
    sendBtn.classList.toggle("is-off", empty);
  }
  function renderBar() {
    var c = count();
    $("#ob-count").textContent = c + (c === 1 ? " item" : " items");
    $("#ob-total").textContent = rupees(subtotal());
    bar.classList.toggle("show", c > 0 && !drawer.classList.contains("open"));
    $$(".cart-count").forEach(function (el) { el.textContent = c; el.hidden = c === 0; });
  }
  function renderAll() {
    syncControls();
    renderLines();
    renderBar();
    updateSendLink();
    store("khodiyar-cart", { items: cart, t: Date.now() });
  }

  function change(key, d) {
    if (!CAT[key]) return;
    var q = (cart[key] || 0) + d;
    if (q <= 0) delete cart[key]; else cart[key] = Math.min(q, 99);
    renderAll();
    if (d > 0 && !drawer.classList.contains("open")) {
      $$(".cart-btn").forEach(function (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); });
      if ((cart[key] || 0) === 1) toast("Added <b>" + esc(CAT[key].name) + "</b>");
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec]");
    if (!t) return;
    if (t.hasAttribute("data-add")) change(t.getAttribute("data-add"), 1);
    else if (t.hasAttribute("data-inc")) change(t.getAttribute("data-inc"), 1);
    else change(t.getAttribute("data-dec"), -1);
  });
  $("#clear").addEventListener("click", function () { cart = {}; renderAll(); toast("Order cleared"); });

  /* order form */
  var fields = { table: $("#o-table"), name: $("#o-name"), notes: $("#o-notes") };
  Object.keys(fields).forEach(function (k) { if (details[k]) fields[k].value = details[k]; });

  form.addEventListener("input", function (e) {
    var f = e.target.closest(".field");
    if (f) { f.classList.remove("bad"); var er = $(".err", f); if (er) er.hidden = true; }
    saveDetails();
  });
  function saveDetails() {
    Object.keys(fields).forEach(function (k) { details[k] = fields[k].value.trim(); });
    details.table = details.table.slice(0, 10);
    store("khodiyar-details", { name: details.name });
    try { sessionStorage.setItem("khodiyar-table", details.table); } catch (e) { /* ignore */ }
    showTableNote();
    updateSendLink();
  }

  function buildMessage() {
    var lines = ["Hello Khodiyar Restaurant! 🙏", "Dine-in order" + (details.table ? " for Table " + details.table : "") + ":", ""];
    var i = 1;
    Object.keys(cart).forEach(function (k) {
      lines.push(i++ + ". " + CAT[k].name + " × " + cart[k] + " — " + rupees(CAT[k].price * cart[k]));
    });
    lines.push("", "Items total: " + rupees(subtotal()));
    lines.push("Table: " + (details.table || "-"));
    if (details.name) lines.push("Name: " + details.name);
    if (details.notes) lines.push("Notes: " + details.notes.slice(0, 400));
    lines.push("", "Please confirm my order. Thank you!");
    return lines.join("\n");
  }
  function updateSendLink() { sendBtn.setAttribute("href", waLink(buildMessage())); }

  function validate() {
    var bad = [];
    var need = { table: !!details.table };
    Object.keys(need).forEach(function (k) {
      var f = $('[data-f="' + k + '"]', form);
      var ok = need[k];
      f.classList.toggle("bad", !ok);
      var er = $(".err", f); if (er) er.hidden = ok;
      if (!ok) bad.push(fields[k]);
    });
    return bad;
  }
  sendBtn.addEventListener("click", function (e) {
    saveDetails();
    if (!count()) { e.preventDefault(); toast("Add a dish first"); return; }
    var bad = validate();
    if (bad.length) { e.preventDefault(); bad[0].focus(); toast("Please add your table number"); return; }
    updateSendLink();
    toast("Opening WhatsApp. Tap <b>Send</b> there to place your order.");
  });

  /* ---------- floating contact button ---------- */
  var fab = document.createElement("div");
  fab.className = "fab";
  fab.innerHTML =
    '<div class="fab-menu" id="fab-menu">' +
      '<a class="fab-item" target="_blank" rel="noopener" href="' + esc(waLink(C.whatsappText)) + '"><span class="i" style="background:var(--wa)">' + ICON.chat + "</span><span>WhatsApp us<small>Questions &amp; table bookings</small></span></a>" +
      '<a class="fab-item" href="' + C.phoneLink + '"><span class="i" style="background:var(--maroon)">' + ICON.call + "</span><span>Call us<small>" + esc(C.phoneDisplay) + "</small></span></a>" +
    "</div>" +
    '<button class="fab-main" type="button" aria-expanded="false" aria-controls="fab-menu" aria-label="Contact us on WhatsApp or phone">' +
      '<span class="lbl">Contact us</span><span class="ico">' + ICON.chat + "</span></button>";
  document.body.appendChild(fab);
  var fabBtn = $(".fab-main", fab);
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  fabBtn.addEventListener("click", function () {
    if (canHover) { var w = window.open(waLink(C.whatsappText), "_blank", "noopener"); if (w) return; }
    var open = fab.classList.toggle("open");
    fabBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    if (fab.classList.contains("open") && !fab.contains(e.target)) { fab.classList.remove("open"); fabBtn.setAttribute("aria-expanded", "false"); }
  });

  renderAll();
})();
