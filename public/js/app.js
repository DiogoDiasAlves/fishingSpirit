(() => {
  "use strict";

  const PRODUCTS = window.FS_PRODUCTS;
  const CATEGORIES = window.FS_CATEGORIES;
  const SPECIES = window.FS_SPECIES;
  const FREE_SHIPPING = 299;
  const SHIPPING_FEE = 24.9;
  const PIX_OFF = 0.05;
  const CART_KEY = "fs-cart-v1";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? "";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const stars = (r) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
  const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const state = { category: "all", species: null, query: "", sort: "featured" };

  /* ---------------- Carrinho (persistido no navegador) ---------------- */
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((i) => byId(i.id) && i.qty > 0) : [];
    } catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* modo privado */ }
  }
  const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);

  function addToCart(id, qty = 1) {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty += qty; else cart.push({ id, qty });
    saveCart();
    renderCart();
    const btn = $("#cartBtn");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    const p = byId(id);
    toast(`<img src="${p.image}" alt=""><span>${esc(p.name)} foi pro carrinho!</span><button type="button" data-open-cart>Ver carrinho</button>`);
  }
  function setQty(id, qty) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = qty;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  /* ---------------- Render: navegação, categorias, espécies ---------------- */
  function renderStatic() {
    $("#navLinks").innerHTML =
      `<a href="#produtos" data-cat="all">Todos</a>` +
      CATEGORIES.map((c) => `<a href="#produtos" data-cat="${c.id}">${c.name}</a>`).join("") +
      `<a href="#especies">Por peixe</a><a href="#produtos" data-cat="promo">Ofertas 🔥</a>`;

    $("#categoryGrid").innerHTML = CATEGORIES.map((c) => `
      <a class="cat" href="#produtos" data-cat="${c.id}">
        <img src="${c.image}" alt="" loading="lazy">
        <strong>${c.short}</strong>
        <span>${c.copy}</span>
      </a>`).join("");

    $("#filterChips").innerHTML =
      `<button class="chip" data-cat="all" role="tab">Todos</button>` +
      CATEGORIES.map((c) => `<button class="chip" data-cat="${c.id}" role="tab">${c.short}</button>`).join("") +
      `<button class="chip" data-cat="promo" role="tab">Ofertas 🔥</button>`;

    $("#speciesGrid").innerHTML = SPECIES.map((s) => {
      const n = PRODUCTS.filter((p) => p.species.includes(s.id)).length;
      return `<a class="specie" href="#produtos" data-species="${s.id}">
        <span class="specie__emoji">${s.emoji}</span>
        <strong>${s.name}</strong>
        <span>${s.copy}</span>
        <em>${n} produtos indicados →</em>
      </a>`;
    }).join("");

    $("#footerCats").innerHTML = CATEGORIES.map((c) => `<li><a href="#produtos" data-cat="${c.id}">${c.name}</a></li>`).join("");
    $("#year").textContent = new Date().getFullYear();

    // duplica a faixa do topo para a animação contínua no celular
    const track = $(".topbar__track");
    track.innerHTML += track.innerHTML;
  }

  /* ---------------- Render: produtos ---------------- */
  function filteredProducts() {
    const q = normalize(state.query.trim());
    let list = PRODUCTS.filter((p) => {
      if (state.category === "promo" && !p.oldPrice) return false;
      if (state.category !== "all" && state.category !== "promo" && p.category !== state.category) return false;
      if (state.species && !p.species.includes(state.species)) return false;
      if (q) {
        const hay = normalize([p.name, p.short, catName(p.category), ...p.species.map((s) => SPECIES.find((x) => x.id === s)?.name || "")].join(" "));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0),
      featured: (a, b) => (b.badge === "Mais vendida") - (a.badge === "Mais vendida") || PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b),
    };
    return list.sort(sorters[state.sort]);
  }

  function cardHTML(p, i) {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
    <article class="card" style="animation-delay:${Math.min(i, 8) * 40}ms">
      <div class="card__media">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="600" height="600">
        <div class="card__badges">
          ${off ? `<span class="badge badge--sale">-${off}%</span>` : ""}
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        </div>
        <button class="card__quick" data-view="${p.id}">Ver detalhes</button>
      </div>
      <div class="card__body">
        <span class="card__cat">${catName(p.category)}</span>
        <h3 class="card__title"><button data-view="${p.id}">${esc(p.name)}</button></h3>
        <p class="card__short">${esc(p.short)}</p>
        ${p.rating ? `<div class="rating"><span class="rating__stars">${stars(p.rating)}</span>${p.rating.toFixed(1)} (${p.reviews})</div>` : ""}
        <div class="price">
          ${p.oldPrice ? `<span class="price__old">${money(p.oldPrice)}</span>` : ""}
          <span class="price__now">${money(p.price)}</span>
          <span class="price__pix"><b>${money(p.price * (1 - PIX_OFF))}</b> no Pix</span>
        </div>
        <button class="btn btn--primary btn--block" data-add="${p.id}">Adicionar ao carrinho</button>
      </div>
    </article>`;
  }

  function renderProducts() {
    const list = filteredProducts();
    $("#productGrid").innerHTML = list.map(cardHTML).join("");
    $("#emptyState").hidden = list.length > 0;

    $$("[data-cat]", $("#filterChips")).forEach((c) => c.classList.toggle("is-active", c.dataset.cat === state.category));
    $$("[data-cat]", $("#navLinks")).forEach((c) => c.classList.toggle("is-active", c.dataset.cat === state.category && state.category !== "all"));

    const title = state.category === "promo" ? "Ofertas que fisgam"
      : state.category !== "all" ? catName(state.category)
      : "Os favoritos da galera";
    $("#productsTitle").textContent = title;

    const af = $("#activeFilter");
    const parts = [];
    if (state.species) parts.push(`Indicados pra <b>${SPECIES.find((s) => s.id === state.species).name}</b>`);
    if (state.query) parts.push(`Busca: <b>"${esc(state.query)}"</b>`);
    af.hidden = !parts.length;
    af.innerHTML = parts.length ? `<span>${parts.join(" · ")} — ${list.length} ${list.length === 1 ? "produto" : "produtos"}</span><button type="button" data-clear>Limpar ✕</button>` : "";
  }

  /* ---------------- Render: carrinho ---------------- */
  function renderCart() {
    const count = cartCount();
    const sub = cartSubtotal();
    const badge = $("#cartCount");
    badge.textContent = count;
    badge.classList.toggle("has-items", count > 0);

    const missing = Math.max(0, FREE_SHIPPING - sub);
    $("#shippingText").innerHTML = missing > 0
      ? `Faltam <b>${money(missing)}</b> pra ganhar <b>frete grátis</b> 🚚`
      : `Boa! Seu pedido tem <b>frete grátis</b> 🎉`;
    $("#shippingFill").style.width = `${Math.min(100, (sub / FREE_SHIPPING) * 100)}%`;
    $("#shippingBar").classList.toggle("done", missing === 0 && sub > 0);

    $("#cartFoot").hidden = count === 0;
    $("#shippingBar").hidden = count === 0;
    $("#cartSubtotal").textContent = money(sub);
    $("#cartPix").textContent = money(sub * (1 - PIX_OFF));

    $("#cartItems").innerHTML = count === 0
      ? `<div class="cart-empty"><div class="big">🎣</div><strong>Seu carrinho tá vazio</strong>Bora encher essa caixa de pesca?<br><button class="btn btn--primary" data-close data-goto="produtos">Ver produtos</button></div>`
      : cart.map(({ id, qty }) => {
        const p = byId(id);
        return `<div class="line-item">
          <img src="${p.image}" alt="">
          <div>
            <h5>${esc(p.name)}</h5>
            <span class="unit">${money(p.price)}</span>
            <div class="qty" aria-label="Quantidade">
              <button type="button" data-qty="${id}" data-delta="-1" aria-label="Diminuir">−</button>
              <span>${qty}</span>
              <button type="button" data-qty="${id}" data-delta="1" aria-label="Aumentar">+</button>
            </div>
          </div>
          <div>
            <div class="total">${money(p.price * qty)}</div>
            <button type="button" class="remove" data-remove="${id}">Remover</button>
          </div>
        </div>`;
      }).join("");
  }

  /* ---------------- Drawer, modal e toast ---------------- */
  const overlay = $("#overlay");
  const drawer = $("#cartDrawer");
  const modal = $("#modal");
  let lastFocus = null;

  function openCart() {
    closeModal();
    lastFocus = document.activeElement;
    overlay.hidden = false;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("[data-close]", drawer).focus();
  }
  function closeCart() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    if (modal.hidden) document.body.classList.remove("no-scroll");
    lastFocus?.focus?.();
  }
  function openModal(html, narrow = false) {
    if (drawer.classList.contains("is-open")) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      overlay.hidden = true;
    } else {
      lastFocus = document.activeElement;
    }
    $("#modalContent").innerHTML = html;
    $(".modal__card", modal).classList.toggle("narrow", narrow);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    lastFocus?.focus?.();
  }

  let toastTimer;
  function toast(html) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ---------------- Página do produto (quick view) ---------------- */
  function openProduct(id) {
    const p = byId(id);
    const pix = p.price * (1 - PIX_OFF);
    const specs = Object.entries(p.specs).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
    const spp = p.species.map((s) => SPECIES.find((x) => x.id === s).name).join(", ");
    openModal(`
      <div class="pdp">
        <div class="pdp__media"><img src="${p.image}" alt="${esc(p.name)}"></div>
        <div class="pdp__info">
          <span class="card__cat">${catName(p.category)}</span>
          <h3 id="modalTitle">${esc(p.name)}</h3>
          ${p.rating ? `<div class="rating"><span class="rating__stars">${stars(p.rating)}</span>${p.rating.toFixed(1)} · ${p.reviews} avaliações</div>` : ""}
          <div class="price">
            ${p.oldPrice ? `<span class="price__old">${money(p.oldPrice)}</span>` : ""}
            <span class="price__now">${money(p.price)}</span>
            <span class="price__pix"><b>${money(pix)}</b> no Pix (5% off)</span>
            <span class="pdp__installments">ou 6x de ${money(p.price / 6)} sem juros</span>
          </div>
          <p>${esc(p.description)}</p>
          ${p.colors?.length > 1 ? `<div class="swatches"><span class="label">Cor:</span>${p.colors.map((c, i) => `<button type="button" class="swatch${i === 0 ? " is-active" : ""}" style="background:${c}" aria-label="Cor ${i + 1}" data-swatch></button>`).join("")}</div>` : ""}
          ${spp ? `<p style="font-size:14px">🎯 <b>Indicado pra:</b> ${spp}</p>` : ""}
          <table class="specs">${specs}</table>
          <div class="pdp__buy">
            <div class="qty"><button type="button" data-pdp-qty="-1" aria-label="Diminuir">−</button><span id="pdpQty">1</span><button type="button" data-pdp-qty="1" aria-label="Aumentar">+</button></div>
            <button class="btn btn--primary btn--lg" data-add="${p.id}" data-from-pdp>Adicionar ao carrinho</button>
          </div>
          <div class="pdp__trust"><span>🚚 Envio em 24h</span><span>🔄 Troca em 30 dias</span><span>🔒 Compra segura</span></div>
        </div>
      </div>`);
  }

  /* ---------------- Checkout (demonstrativo) ---------------- */
  function openCheckout() {
    if (!cart.length) return;
    const sub = cartSubtotal();
    const ship = sub >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    openModal(`
      <form class="checkout" id="checkoutForm" novalidate>
        <h3 id="modalTitle">Finalizar compra</h3>
        <p>Rapidinho: só o essencial pra sua encomenda chegar.</p>
        <div class="form-grid">
          <div class="field field--full"><label for="coName">Nome completo</label><input id="coName" required autocomplete="name"></div>
          <div class="field"><label for="coEmail">E-mail</label><input id="coEmail" type="email" required autocomplete="email"></div>
          <div class="field"><label for="coPhone">WhatsApp</label><input id="coPhone" type="tel" required autocomplete="tel" placeholder="(00) 00000-0000"></div>
          <div class="field"><label for="coCep">CEP</label><input id="coCep" required inputmode="numeric" autocomplete="postal-code" placeholder="00000-000"></div>
          <div class="field"><label for="coNum">Número</label><input id="coNum" required></div>
          <div class="field field--full"><label for="coAddr">Endereço</label><input id="coAddr" required autocomplete="street-address"></div>
        </div>
        <div class="pay-options" role="radiogroup" aria-label="Forma de pagamento">
          <div class="pay-option"><input type="radio" name="pay" id="payPix" value="pix" checked><label for="payPix">⚡ Pix<small>5% de desconto</small></label></div>
          <div class="pay-option"><input type="radio" name="pay" id="payCard" value="card"><label for="payCard">💳 Cartão<small>Até 6x sem juros</small></label></div>
          <div class="pay-option"><input type="radio" name="pay" id="payBoleto" value="boleto"><label for="payBoleto">📄 Boleto<small>Vence em 3 dias</small></label></div>
        </div>
        <div class="summary" id="coSummary"></div>
        <button class="btn btn--primary btn--lg btn--block" type="submit">Confirmar pedido</button>
      </form>`, true);

    const summary = () => {
      const pix = $("#payPix").checked;
      const discount = pix ? sub * PIX_OFF : 0;
      $("#coSummary").innerHTML = `
        <div class="row"><span>Produtos (${cartCount()})</span><span>${money(sub)}</span></div>
        <div class="row"><span>Frete</span>${ship ? `<span>${money(ship)}</span>` : `<span class="free">Grátis</span>`}</div>
        ${discount ? `<div class="row"><span>Desconto Pix</span><span class="free">− ${money(discount)}</span></div>` : ""}
        <div class="row total"><span>Total</span><span>${money(sub + ship - discount)}</span></div>`;
    };
    summary();
    $$("input[name=pay]").forEach((r) => r.addEventListener("change", summary));

    $("#coCep").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 8);
      e.target.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    });
    $("#coPhone").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 11);
      e.target.value = d.length > 7 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });

    $("#checkoutForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = $$("input[required]", e.target).find((i) => !i.value.trim() || !i.checkValidity());
      if (invalid) {
        invalid.focus();
        invalid.style.borderColor = "var(--red)";
        setTimeout(() => (invalid.style.borderColor = ""), 1600);
        return;
      }
      const name = $("#coName").value.trim().split(" ")[0];
      const order = "FS" + Math.floor(100000 + Math.random() * 900000);
      cart = [];
      saveCart();
      renderCart();
      openModal(`
        <div class="success">
          <div class="big">🎣</div>
          <h3 id="modalTitle">Pedido fisgado!</h3>
          <p>Valeu, ${esc(name)}! Seu pedido foi recebido.</p>
          <p>Mandamos os detalhes no seu e-mail e WhatsApp.</p>
          <span class="order">Pedido #${order}</span><br>
          <button class="btn btn--primary btn--lg" data-close>Voltar pra loja</button>
        </div>`, true);
    });
  }

  /* ---------------- Filtros ---------------- */
  function setCategory(cat) {
    state.category = cat;
    state.species = null;
    renderProducts();
  }
  function clearFilters() {
    Object.assign(state, { category: "all", species: null, query: "" });
    $("#searchInput").value = "";
    renderProducts();
  }
  function goToProducts() {
    $("#produtos").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  /* ---------------- Eventos ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) {
      if (e.target === modal) closeModal();
      return;
    }

    if (t.dataset.add) {
      e.preventDefault();
      const qty = t.hasAttribute("data-from-pdp") ? +$("#pdpQty").textContent : 1;
      addToCart(t.dataset.add, qty);
      if (t.hasAttribute("data-from-pdp")) { closeModal(); return; }
      const label = t.textContent;
      t.classList.add("added"); t.textContent = "✓ Adicionado";
      setTimeout(() => { t.classList.remove("added"); t.textContent = label; }, 1400);
      return;
    }
    if (t.dataset.view) return openProduct(t.dataset.view);
    if (t.dataset.qty) return setQty(t.dataset.qty, cart.find((i) => i.id === t.dataset.qty).qty + +t.dataset.delta);
    if (t.dataset.remove) return setQty(t.dataset.remove, 0);
    if (t.dataset.pdpQty) {
      const el = $("#pdpQty");
      el.textContent = Math.max(1, Math.min(99, +el.textContent + +t.dataset.pdpQty));
      return;
    }
    if (t.hasAttribute("data-swatch")) {
      $$("[data-swatch]", t.parentElement).forEach((s) => s.classList.toggle("is-active", s === t));
      return;
    }
    if (t.hasAttribute("data-open-cart")) { $("#toast").classList.remove("show"); return openCart(); }
    if (t.hasAttribute("data-clear")) return clearFilters();
    if (t.dataset.cat) {
      e.preventDefault();
      setCategory(t.dataset.cat);
      $("#nav").classList.remove("is-open");
      if (!t.closest("#filterChips")) goToProducts();
      return;
    }
    if (t.dataset.catLink) { e.preventDefault(); setCategory(t.dataset.catLink); goToProducts(); return; }
    if (t.dataset.species) {
      e.preventDefault();
      Object.assign(state, { category: "all", species: t.dataset.species });
      renderProducts();
      goToProducts();
      return;
    }
    if (t.hasAttribute("data-close")) {
      closeCart(); closeModal();
      if (t.dataset.goto) goToProducts();
      return;
    }
  });

  $("#cartBtn").addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);
  $("#checkoutBtn").addEventListener("click", openCheckout);
  $("#clearFilters").addEventListener("click", clearFilters);
  $("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("is-open"));
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

  let searchTimer;
  $("#searchInput").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = e.target.value; renderProducts(); }, 150);
  });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.query = $("#searchInput").value;
    renderProducts();
    goToProducts();
  });

  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast(`<span>🐟 Bem-vindo ao cardume! Seu cupom <b>PRIMEIRAPESCA</b> chega no e-mail.</span>`);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeCart(); }
  });

  renderStatic();
  renderProducts();
  renderCart();
})();
