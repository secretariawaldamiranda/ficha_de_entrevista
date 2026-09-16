const form = document.querySelector('#interviewForm');
const stage = document.querySelector('#stage');
const storageKey = 'ficha-entrevista-formosa-v1';

function resizeSheet() {
  if (window.matchMedia('print').matches) return;
  const available = Math.max(304, window.innerWidth - 16);
  const scale = Math.min(1, available / 794);
  form.style.transform = `scale(${scale})`;
  stage.style.height = `${1123 * scale + 72}px`;
}

function saveForm() {
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = value; });
  form.querySelectorAll('input:not([type="radio"])').forEach(input => {
    data[input.name] = input.value;
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadForm() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.entries(data).forEach(([name, value]) => {
      const fields = form.elements.namedItem(name);
      if (!fields) return;
      if (fields instanceof RadioNodeList) fields.value = value;
      else fields.value = value;
    });
  } catch { localStorage.removeItem(storageKey); }
}

form.addEventListener('input', saveForm);
form.addEventListener('change', saveForm);
document.querySelector('#printButton').addEventListener('click', () => window.print());
document.querySelector('#clearButton').addEventListener('click', () => {
  if (!confirm('Deseja apagar todos os dados preenchidos nesta ficha?')) return;
  form.reset();
  localStorage.removeItem(storageKey);
});
window.addEventListener('resize', resizeSheet);
window.addEventListener('beforeprint', () => { form.style.transform = 'none'; });
window.addEventListener('afterprint', resizeSheet);

loadForm();
resizeSheet();
