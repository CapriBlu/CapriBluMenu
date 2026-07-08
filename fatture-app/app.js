const form = document.getElementById("invoiceForm");
const invoiceList = document.getElementById("invoiceList");
const searchInput = document.getElementById("searchInput");
const imageInput = document.getElementById("invoiceImage");
const previewBox = document.getElementById("previewBox");
const imagePreview = document.getElementById("imagePreview");
const exportBtn = document.getElementById("exportBtn");

const aiJsonInput = document.getElementById("aiJsonInput");
const importAiBtn = document.getElementById("importAiBtn");
const pasteExampleBtn = document.getElementById("pasteExampleBtn");
const aiMessage = document.getElementById("aiMessage");

const totalMonth = document.getElementById("totalMonth");
const paidCount = document.getElementById("paidCount");
const unpaidCount = document.getElementById("unpaidCount");
const expiredCount = document.getElementById("expiredCount");
const navButtons = document.querySelectorAll(".bottom-nav button");

let invoices = JSON.parse(localStorage.getItem("capriBluInvoices")) || [];

document.getElementById("date").valueAsDate = new Date();

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    imagePreview.src = event.target.result;
    previewBox.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const invoice = {
    id: Date.now(),
    type: document.getElementById("type").value,
    name: document.getElementById("name").value.trim(),
    number: document.getElementById("number").value.trim(),
    date: document.getElementById("date").value,
    amount: Number(document.getElementById("amount").value),
    dueDate: document.getElementById("dueDate").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value.trim(),
    image: imagePreview.src || "",
    createdAt: new Date().toISOString()
  };

  invoices.unshift(invoice);
  saveInvoices();
  resetForm();
  renderInvoices();
  scrollToSection("archiveSection");
});

searchInput.addEventListener("input", renderInvoices);

exportBtn.addEventListener("click", function () {
  const data = JSON.stringify(invoices, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "capri-blu-fatture.json";
  link.click();

  URL.revokeObjectURL(url);
});

importAiBtn.addEventListener("click", function () {
  importInvoiceFromAI();
});

pasteExampleBtn.addEventListener("click", function () {
  const example = {
    type: "fornitore",
    name: "Fornitore Srl",
    number: "123/2026",
    date: "2026-07-08",
    amount: 122.00,
    dueDate: "2026-07-31",
    status: "da_pagare",
    notes: "Fattura letta da foto"
  };

  aiJsonInput.value = JSON.stringify(example, null, 2);
  showAiMessage("Esempio inserito. Ora puoi premere Importa dati.", "success");
});

navButtons.forEach(button => {
  button.addEventListener("click", function () {
    const target = button.dataset.target;
    scrollToSection(target);
  });
});

function importInvoiceFromAI() {
  const rawJson = aiJsonInput.value.trim();

  if (!rawJson) {
    showAiMessage("Incolla prima i dati JSON della fattura.", "error");
    return;
  }

  let data;

  try {
    data = JSON.parse(rawJson);
  } catch (error) {
    showAiMessage("JSON non valido. Controlla virgole, virgolette e parentesi.", "error");
    return;
  }

  const cleanedInvoice = normalizeAiInvoice(data);

  if (!cleanedInvoice.name || !cleanedInvoice.number || !cleanedInvoice.date || !cleanedInvoice.amount) {
    showAiMessage("Mancano dati obbligatori: nome, numero, data o totale.", "error");
    return;
  }

  fillManualForm(cleanedInvoice);
  showAiMessage("Dati importati nel modulo. Controlla e premi Salva fattura.", "success");
  scrollToSection("newSection");
}

function normalizeAiInvoice(data) {
  return {
    type: data.type || data.tipo || "fornitore",
    name: data.name || data.nome || data.fornitore || data.cliente || "",
    number: data.number || data.numero || data.numero_fattura || "",
    date: data.date || data.data || data.data_fattura || "",
    amount: Number(data.amount || data.totale || data.importo || 0),
    dueDate: data.dueDate || data.scadenza || data.data_scadenza || "",
    status: data.status || data.stato || "da_pagare",
    notes: data.notes || data.note || "Importata da ChatGPT"
  };
}

function fillManualForm(invoice) {
  document.getElementById("type").value = invoice.type === "cliente" ? "cliente" : "fornitore";
  document.getElementById("name").value = invoice.name;
  document.getElementById("number").value = invoice.number;
  document.getElementById("date").value = invoice.date;
  document.getElementById("amount").value = invoice.amount;
  document.getElementById("dueDate").value = invoice.dueDate;
  document.getElementById("status").value = invoice.status === "pagata" ? "pagata" : "da_pagare";
  document.getElementById("notes").value = invoice.notes;
}

function showAiMessage(message, type) {
  aiMessage.textContent = message;
  aiMessage.className = `ai-message ${type}`;
  aiMessage.classList.remove("hidden");
}

function saveInvoices() {
  localStorage.setItem("capriBluInvoices", JSON.stringify(invoices));
}

function resetForm() {
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
  imagePreview.src = "";
  previewBox.classList.add("hidden");
}

function renderInvoices() {
  const query = searchInput.value.toLowerCase();

  const filtered = invoices.filter(invoice => {
    return (
      invoice.name.toLowerCase().includes(query) ||
      invoice.number.toLowerCase().includes(query) ||
      invoice.status.toLowerCase().includes(query)
    );
  });

  invoiceList.innerHTML = "";

  if (filtered.length === 0) {
    invoiceList.innerHTML = `<p class="invoice-meta">Nessuna fattura trovata.</p>`;
  }

  filtered.forEach(invoice => {
    const status = getInvoiceStatus(invoice);
    const item = document.createElement("div");
    item.className = "invoice-item";

    item.innerHTML = `
      <div class="invoice-top">
        <div>
          <div class="invoice-name">${escapeHtml(invoice.name)}</div>
          <div class="invoice-meta">Fattura ${escapeHtml(invoice.number)} · ${formatDate(invoice.date)}</div>
          ${invoice.dueDate ? `<div class="invoice-meta">Scadenza: ${formatDate(invoice.dueDate)}</div>` : ""}
        </div>
        <div class="invoice-amount">${formatCurrency(invoice.amount)}</div>
      </div>

      <span class="badge ${status.className}">${status.label}</span>
      ${invoice.notes ? `<div class="invoice-meta">Note: ${escapeHtml(invoice.notes)}</div>` : ""}
      <button class="delete-btn" onclick="deleteInvoice(${invoice.id})">Elimina</button>
    `;

    invoiceList.appendChild(item);
  });

  updateDashboard();
}

function getInvoiceStatus(invoice) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

  if (invoice.status === "pagata") {
    return { label: "Pagata", className: "pagata" };
  }

  if (dueDate && dueDate < today) {
    return { label: "Scaduta", className: "scaduta" };
  }

  return { label: "Da pagare", className: "da_pagare" };
}

function deleteInvoice(id) {
  const confirmed = confirm("Vuoi eliminare questa fattura?");
  if (!confirmed) return;

  invoices = invoices.filter(invoice => invoice.id !== id);
  saveInvoices();
  renderInvoices();
}

function updateDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyInvoices = invoices.filter(invoice => {
    const date = new Date(invoice.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const total = monthlyInvoices.reduce((sum, invoice) => {
    return sum + Number(invoice.amount || 0);
  }, 0);

  const paid = invoices.filter(invoice => invoice.status === "pagata").length;
  const unpaid = invoices.filter(invoice => invoice.status === "da_pagare").length;

  const expired = invoices.filter(invoice => {
    if (invoice.status === "pagata" || !invoice.dueDate) return false;
    return new Date(invoice.dueDate) < new Date();
  }).length;

  totalMonth.textContent = formatCurrency(total);
  paidCount.textContent = paid;
  unpaidCount.textContent = unpaid;
  expiredCount.textContent = expired;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("it-IT");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });

  navButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.target === id);
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {
    console.log("Service worker non registrato.");
  });
}

renderInvoices();
