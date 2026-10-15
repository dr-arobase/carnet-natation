// gestion utilisateurs — version corrigée
let utilisateurs = [];
let filtered = [];
let currentPage = 1;
const perPage = 10;

const form = document.getElementById('client-form'); // admin.html uses client-form
const inputUsername = document.getElementById("Nom-d'utilisateur");
const inputPassword = document.getElementById('Mot-de-passe');
const inputRole = document.getElementById('Role');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-edit');
const successBox = document.getElementById('success-message');
const errorBox = document.getElementById('error-message');
const tableBody = document.querySelector('#clients-table tbody');
const searchInput = document.getElementById('search-utilisateur');
const clearSearch = document.getElementById('clear-search');
cancelClientEdit.style.display = "none";



function showSuccess(msg) { 
    if (successBox) { successBox.textContent = msg; successBox.style.display = 'block'; setTimeout(()=> successBox.style.display='none',2500); } }
function showError(msg) { if (errorBox) { errorBox.textContent = msg; errorBox.style.display = 'block'; setTimeout(()=> errorBox.style.display='none',3000); } }

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadUsers() {
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';
    try {
        const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
        if (!res.ok) {
            tableBody.innerHTML = '<tr><td colspan="5">Impossible de charger les utilisateurs.</td></tr>';
            return;
        }
        utilisateurs = await res.json();
        filtered = [...utilisateurs];
        renderTable();
    } catch (e) {
        console.error(e);
        tableBody.innerHTML = '<tr><td colspan="5">Erreur serveur.</td></tr>';
    }
}

function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!filtered.length) {
        tableBody.innerHTML = '<tr><td colspan="5">Aucun utilisateur.</td></tr>';
        return;
    }
    filtered.forEach(u => {
        const tr = document.createElement('tr');
        const created = u.created_at ? new Date(u.created_at).toLocaleString() : '';
        tr.innerHTML = `
            <td>${u.username || ''}</td>
            <td>${u.password || u.mot_de_passe || u.mode_de_passe || ''}</td>
            <td>${u.role || ''}</td>
            <td>${created}</td>
            <td>
                <button class="button is-small is-primary" data-edit="${u.id}">
                <i class="fas fa-edit"></i></button>
                <button class="button is-small is-danger" data-del="${u.id}">
                <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = inputUsername?.value?.trim();
    const password = inputPassword?.value || '';
    const role = inputRole?.value || 'user';
    if (!username || !password) { 
        showError('Nom d\'utilisateur et mot de passe requis.'); 
        return; 
    }
    try {
        const res = await fetch('/addUser', {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
            body: JSON.stringify({ username, password, role })
        });
        if (!res.ok) {
            const j = await res.json().catch(()=>({}));
            showError(j.error || 'Échec création utilisateur');
            return;
        }
        showSuccess('Utilisateur créé');
        form.reset();
        await loadUsers();
    } catch (err) {
        console.error(err);
        showError('Erreur serveur');
    }
});

tableBody?.addEventListener('click', async (e) => {
    const del = e.target.closest('button[data-del]');
    if (del) {
        const id = del.dataset.del;
        if (!confirm('Supprimer cet utilisateur ?')) return;
        try {
            const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (!res.ok) {
                const j = await res.json().catch(()=>({}));
                showError(j.error || 'Impossible de supprimer');
                return;
            }
            showSuccess('Utilisateur supprimé');
            await loadUsers();
        } catch (err) {
            console.error(err);
            showError('Erreur suppression');
        }
    }
});

searchInput?.addEventListener('input', () => {
    const term = (searchInput.value || '').toLowerCase();
    filtered = utilisateurs.filter(u => (u.username || '').toLowerCase().includes(term) || (u.role || '').toLowerCase().includes(term));
    renderTable();
});

clearSearch?.addEventListener('click', () => { if (searchInput) searchInput.value=''; filtered = [...utilisateurs]; renderTable(); });

// initial load
document.addEventListener('DOMContentLoaded', () => { loadUsers(); });
