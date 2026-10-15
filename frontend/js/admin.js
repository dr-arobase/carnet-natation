async function loadUsers() {
  const msg = document.getElementById('user-list-msg');
  const table = document.getElementById('users-table');
  const tbody = table.querySelector('tbody');
  if (msg) msg.textContent = 'Chargement...';
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch('/api/admin/users', { headers });
    if (!res.ok) {
      if (msg) msg.textContent = 'Impossible de charger les utilisateurs (authentification requise).';
      table.style.display = 'none';
      return;
    }
    const users = await res.json();
    tbody.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      const created = u.created_at ? new Date(u.created_at).toLocaleString() : '';
      tr.innerHTML = `<td>${u.username}</td><td>${u.role}</td><td>${created}</td><td></td>`;
      const actions = tr.querySelector('td:last-child');
      const del = document.createElement('button');
      del.textContent = 'Supprimer';
      del.className = 'button is-danger is-small';
      del.addEventListener('click', async () => {
        if (!confirm(`Supprimer l'utilisateur ${u.username} ?`)) return;
        try {
          const dres = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE', headers });
          if (!dres.ok) {
            const err = await dres.json().catch(()=>({ error: 'Erreur' }));
            alert(err.error || 'Échec suppression');
            return;
          }
          tr.remove();
        } catch (e) {
          console.error(e);
          alert('Erreur lors de la suppression');
        }
      });
      actions.appendChild(del);
      tbody.appendChild(tr);
    });
    table.style.display = '';
    if (msg) msg.textContent = '';
  } catch (err) {
    if (msg) msg.textContent = 'Erreur lors du chargement.';
    table.style.display = 'none';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});
