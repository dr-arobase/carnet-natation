// Minimal client.js: graceful behavior if backend endpoints are missing
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('client-form');
  const tableBody = document.querySelector('#clients-table tbody');
  const success = document.getElementById('success-message');
  const error = document.getElementById('error-message');

  async function loadClients() {
    tableBody.innerHTML = '<tr><td colspan="6">Chargement...</td></tr>';
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/clients', { headers });
      if (!res.ok) {
        tableBody.innerHTML = '<tr><td colspan="6">Aucun service clients disponible.</td></tr>';
        return;
      }
      const clients = await res.json();
      if (!Array.isArray(clients) || clients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Aucun client trouvé.</td></tr>';
        return;
      }
      tableBody.innerHTML = '';
      clients.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.nom} ${c.prenom}</td>
          <td>${c.telephone || ''}</td>
          <td>${c.email || ''}</td>
          <td>${c.adresse || ''}</td>
          <td>${c.loan_count || 0}</td>
          <td><button class="button is-small is-danger" data-id="${c.id}">Supprimer</button></td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (e) {
      tableBody.innerHTML = '<tr><td colspan="6">Erreur lors du chargement des clients.</td></tr>';
      console.error(e);
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';
    const data = {
      nom: document.getElementById('nom').value,
      prenom: document.getElementById('prenom').value,
      telephone: document.getElementById('telephone').value,
      email: document.getElementById('email').value,
      adresse: document.getElementById('adresse').value
    };
    try {
      const token = localStorage.getItem('token');
      const headers = Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {});
      const res = await fetch('/api/clients', { method: 'POST', headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Erreur serveur');
      if (success) success.style.display = '';
      form.reset();
      loadClients();
    } catch (err) {
      if (error) error.style.display = '';
      console.error(err);
    }
  });

  // Delegate delete
  document.querySelector('#clients-table')?.addEventListener('click', async (e) => {
    if (e.target.matches('button[data-id]')) {
      const id = e.target.getAttribute('data-id');
      if (!confirm('Supprimer ce client ?')) return;
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/clients/${id}`, { method: 'DELETE', headers });
        if (!res.ok) throw new Error('Échec suppression');
        loadClients();
      } catch (err) {
        alert('Impossible de supprimer le client');
        console.error(err);
      }
    }
  });

  document.getElementById('clear-search')?.addEventListener('click', () => {
    const search = document.getElementById('search-client');
    if (search) search.value = '';
    loadClients();
  });

  // initial load
  loadClients();
});