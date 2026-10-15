let nageurs = [];
let filteredNageurs = [];
let currentPage = 1;
let nageursPerPage = 8;
let sortColumn = "";
let sortDirection = "asc";

const formNageur = document.getElementById("nageur-form");
const idNageur = document.getElementById("nageur-id");

const nomNageur = document.getElementById("nom");
const prenomNageur = document.getElementById("prenom");
const niveauNageur = document.getElementById("niveau");
const horaireNageur = document.getElementById("horaire");
const notesNageur = document.getElementById("notes");

const errorNomNageur = document.getElementById("nom-error");
const errorPrenomNageur = document.getElementById("prenom-error");
const errorNiveauNageur = document.getElementById("niveau-error");
const errorHoraireNageur = document.getElementById("horaire-error");
const errorNotesNageur = document.getElementById("notes-error");

const paginationContainer = document.getElementById("nageur-pagination");

const submitNageurBtn = document.getElementById("submit-btn");
const cancelNageurEdit = document.getElementById("cancel-edit");

const nageursTableBody = document.querySelector("#nageurs-table tbody");

const searchInput = document.getElementById("search-nageur");
const clearSearchBtn = document.getElementById("clear-search");
cancelNageurEdit.style.display = "none";




function showFieldError(input, errorElem, message) {
  input.classList.add("is-danger");
  errorElem.style.display = "block";
  errorElem.textContent = message;
}

function clearFieldError(input, errorElem) {
  input.classList.remove("is-danger");
  errorElem.style.display = "none";
  errorElem.textContent = "";
}


nomNageur.addEventListener("input", () => {
  if (nomNageur.value) {
    clearFieldError(nomNageur, errorNomNageur);
  }
});
prenomNageur.addEventListener("input", () => {
  if (prenomNageur.value) {
    clearFieldError(prenomNageur, errorPrenomNageur);
  }
});
niveauNageur.addEventListener("input", () => {
  if (niveauNageur.value) {
    clearFieldError(niveauNageur, errorNiveauNageur);
  }
});
horaireNageur.addEventListener("input", () => {
  if (horaireNageur.value) {
    clearFieldError(horaireNageur, errorHoraireNageur);
  }
});
notesNageur.addEventListener("input", () => {
  if (notesNageur.value) {
    clearFieldError(notesNageur, errorNotesNageur);
  }
});




function renderNageurs(list = filteredNageurs) {
        nageursTableBody.innerHTML = "";

    if (list.length === 0) {
        nageursTableBody.innerHTML =
            `<tr><td colspan="6" class="has-text-centered">Aucun nageur trouvé</td></tr>`;
        return;
    }

    list.forEach(nageur => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${nageur.prenom} ${nageur.nom}</td>
            <td>${nageur.niveau}</td>
            <td>${nageur.horaire}</td>
            <td>${nageur.notes}</td>
            <td>
                <button class="button is-small is-primary" data-edit="${nageur.id}">
                <i class="fas fa-edit"></i></button>
                <button class="button is-small is-danger" data-del="${nageur.id}">
                <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        nageursTableBody.appendChild(tr);
    });
}




function sortNageurs(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
        sortColumn = column;
        sortDirection = "asc";
    }

    filteredNageurs.sort((a, b) => {
        let valA, valB;

        switch (column) {
            case "nom":
                valA = `${a.prenom} ${a.nom}`.toLowerCase();
                valB = `${b.prenom} ${b.nom}`.toLowerCase();
                break;
            case "niveau":
                valA = a.niveau.toLowerCase();
                valB = b.niveau.toLowerCase();
                break;
            default:
                valA = String(a[column] || "").toLowerCase();
                valB = String(b[column] || "").toLowerCase();
                break;
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    paginate();
    updateSortIcons();
}

function updateSortIcons() {
    document.querySelectorAll(".sort-link").forEach(th => {
        const col = th.dataset.column;
        const icon = th.querySelector(".sort-icon");
        if (!icon) return;
        if (col === sortColumn) {
            icon.textContent = sortDirection === "asc" ? "▲" : "▼";
        } else {
            icon.textContent = "";
        }
    });
}

function paginate() {
    const start = (currentPage - 1) * nageursPerPage;
    const end = start + nageursPerPage;

    const pageItems = filteredNageurs.slice(start, end);

    renderNageurs(pageItems);
    renderPagination();
}

function renderPagination() {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredNageurs.length / nageursPerPage);
    if (totalPages <= 1) return;

    const prevBtn = createPaginationButton("« Précédent", currentPage > 1, () => {
        currentPage--;
        paginate();
    });
    paginationContainer.appendChild(prevBtn);

    for (let page = 1; page <= totalPages; page++) {
        const isActive = page === currentPage;

        const btn = createPaginationButton(page, true, () => {
            currentPage = page;
            paginate();
        });

        if (isActive) btn.classList.add("is-primary");

        paginationContainer.appendChild(btn);
    }

    const nextBtn = createPaginationButton("Suivant »", currentPage < totalPages, () => {
        currentPage++;
        paginate();
    });
    paginationContainer.appendChild(nextBtn);
}

function createPaginationButton(text, enabled, onClick) {
    const btn = document.createElement("button");
    btn.className = "button is-small";
    btn.textContent = text;

    btn.disabled = !enabled;

    if (enabled) {
        btn.addEventListener("click", onClick);
    }

    return btn;
}

async function loadNageurs() {
    try {
        const res = await fetch('/allNageurs');
        if (!res.ok) {
            showError('Erreur lors de la recuperation des nageurs');
            return;
        }
        nageurs = await res.json();
        filteredNageurs = [...nageurs];
        currentPage = 1;
        paginate();
    } catch (err) {
        console.error(err);
        showError('Erreur lors de la recuperation des nageurs');
    }
}

searchInput.addEventListener("input", () => {
    const term = searchInput.value;
    filteredNageurs = nageurs.filter(c =>
        [c.prenom, c.nom, c.niveau, c.horaire, c.notes]
        .map(v => (v || ""))
        .some(v => v.includes(term))
    );
    currentPage = 1;
    paginate();
});

clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    filteredNageurs = [...nageurs];
    paginate();
});

formNageur.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = idNageur.value.trim();
        const nom = nomNageur.value.trim();
        const prenom = prenomNageur.value.trim();
        const niveau = niveauNageur.value.trim();
        const horaire = horaireNageur.value.trim();
        const notes = notesNageur.value.trim();
        
        let hasError = false;

        if (!nom) {
            showFieldError(nomNageur, errorNomNageur, "Un nom valide est requis");
            hasError = true;
        } else clearFieldError(nomNageur, errorNomNageur);

        if (!prenom) {
            showFieldError(prenomNageur, errorPrenomNageur, "Un prénom valide est requis");
            hasError = true;
        } else clearFieldError(prenomNageur, errorPrenomNageur);

        if (!niveau) {
            showFieldError(niveauNageur, errorNiveauNageur, "Un niveau valide est requis");
            hasError = true;
        } else clearFieldError(niveauNageur, errorNiveauNageur);

        if (!horaire) {
            showFieldError(horaireNageur, errorHoraireNageur, "Un horaire valide est requis");
            hasError = true;
        } else clearFieldError(horaireNageur, errorHoraireNageur);

        if (hasError) return;

        try {
            if (id) {
                const res = await fetch(`/updateNageurs/${encodeURIComponent(id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nom, prenom, niveau, horaire, notes })
                });
                if (!res.ok) {
                    showError('Erreur lors de la modification du nageur');
                    return;
                }
                showSuccess("Nageur modifié avec succès");
                formNageur.reset();
                idNageur.value = "";
                cancelNageurEdit.style.display = "none";
                submitNageurBtn.textContent = "Ajouter le nageur";

                await loadNageurs();

            } else {
                const res = await fetch(`/addNageurs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nom, prenom, niveau, horaire, notes })
                });

                if (!res.ok) {
                    showError("Erreur lors de l'ajout du nageur");
                    return;
                }
                showSuccess("Nageur ajouté avec succès");
                formNageur.reset();
                idNageur.value = "";
                cancelNageurEdit.style.display = "none";
                submitNageurBtn.textContent = "Ajouter le nageur";

                await loadNageurs();
            }
        } catch (err) {
            console.error(err);
            showError('Erreur lors de l ajout/modification du nageur');
    }
});

cancelNageurEdit.addEventListener("click", (e) => {
        e.preventDefault();
        formNageur.reset();
        idNageur.value = "";
        submitNageurBtn.textContent = "Ajouter le nageur";
        cancelNageurEdit.style.display = "none";
});

nageursTableBody.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('button[data-edit]');
        const delBtn = e.target.closest('button[data-del]');

        if (editBtn) {
            const id = editBtn.dataset.edit;
            const nageur = nageurs.find(c => String(c.id) === String(id));
            if (!nageur) {
                showError("Nageur introuvable pour modification");
                return;
            }

            idNageur.value = nageur.id;
            nomNageur.value = nageur.nom;
            prenomNageur.value = nageur.prenom;
            niveauNageur.value = nageur.niveau;
            horaireNageur.value = nageur.horaire;
            notesNageur.value = nageur.notes;

            showSuccess("Nageur modifié avec succès");
            submitNageurBtn.textContent = 'Enregistrer';
            cancelNageurEdit.style.display = 'inline-flex';

            return;
        }

        if (delBtn) {
            const id = delBtn.dataset.del;
            if (!confirm('Voulez-vous vraiment supprimer ce nageur ?'))
                return;
            try {
                const res = await fetch(`/deleteNageurs/${encodeURIComponent(id)}`, { method: 'DELETE' });
                if (!res.ok) {
                    const errBody = await res.text().catch(() => '');
                    console.error('Delete failed', res.status, errBody);
                    showError('Erreur lors de la suppression du nageur');
                    return;
                }
                showSuccess("Nageur supprimé avec succès");
                await loadNageurs();
            } catch (err) {
                console.error(err);
                showError('Erreur lors de la suppression du nageur');
            }
            return;
        }
});

function showSuccess(message = "Succès !") {
    const box = document.getElementById("success-message");
    if (!box) return;
    box.textContent = message;
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 2500);
}

function showError(message = "Erreur.") {
    const box = document.getElementById("error-message");
    if (!box) return;
    box.textContent = message;
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    const sortLinks = document.querySelectorAll('.sort-link');
    sortLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', () => {
            const column = link.dataset.column;
            sortNageurs(column);
        });
    });
});


loadNageurs();