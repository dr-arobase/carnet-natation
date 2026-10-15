        function filtrerListe() {
            const input = document.getElementById('searchInput').value.toLowerCase();
            const filtreNiveau = document.getElementById('niveauFilter').value.toLowerCase();
            const filtreHoraire = document.getElementById('horaireFilter').value.toLowerCase();
            const filtreSession = document.getElementById('sessionFilter').value.toLowerCase();
            const table = document.getElementById('tableNageurs');
            const lignes = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            for (let i = 0; i < lignes.length; i++) {
                const nom = lignes[i].getElementsByTagName('td')[0].textContent.toLowerCase();
                const niveau = lignes[i].getElementsByTagName('td')[1].textContent.toLowerCase();
                const horaire = lignes[i].getElementsByTagName('td')[2].textContent.toLowerCase();
                const session = lignes[i].getElementsByTagName('td')[3].textContent.toLowerCase();

                const matchNom = nom.includes(input);
                const matchNiveau = filtreNiveau === "" || niveau === filtreNiveau;
                const matchHoraire = filtreHoraire === "" || horaire.includes(filtreHoraire);
                const matchSession = filtreSession === "" || session === filtreSession;

                if (matchNom && matchNiveau && matchHoraire && matchSession) {
                    lignes[i].style.display = "";
                } else {
                    lignes[i].style.display = "none";
                }
            }
        }
        
        function toggleListe() {
            const liste = document.getElementById('liste');
            if (liste.style.display === 'none' || liste.classList.contains('hidden')) {
            liste.style.display = 'block';
            liste.classList.remove('hidden');
            } else {
            liste.style.display = 'none';
            liste.classList.add('hidden');
            }
        }

        function toggleAjouter() {
            const ajouter = document.getElementById('ajouter');
            if (ajouter.style.display === 'none' || ajouter.classList.contains('hidden')) {
            ajouter.style.display = 'block';
            ajouter.classList.remove('hidden');
            } else {
            ajouter.style.display = 'none';
            ajouter.classList.add('hidden');
            }
        }
        // Form submission handled by Flask; helper left out to avoid conflicts
        function toggleSupprimer() {
            const supprimer = document.getElementById('supprimer');
            if (supprimer.style.display === 'none' || supprimer.classList.contains('hidden')) {
                supprimer.style.display = 'block';
                supprimer.classList.remove('hidden');
            } else {
                supprimer.style.display = 'none';
                supprimer.classList.add('hidden');
            }
        }
        // Suppression handled by form POST
        function toggleModifier() {
            const modifier = document.getElementById('modifier');
            if (modifier.style.display === 'none' || modifier.classList.contains('hidden')) {
                modifier.style.display = 'block';
                modifier.classList.remove('hidden');
            } else {
                modifier.style.display = 'none';
                modifier.classList.add('hidden');
            }
        }
        // Modification handled by form POST
        const menu = document.getElementById('menu');
        let timer;

        function cacherMenu() {
            if (menu) menu.classList.add('hidden');
        }

        function montrerMenu() {
            if (menu) menu.classList.remove('hidden');
            resetTimer();
        }

        function resetTimer() {
            clearTimeout(timer);
            timer = setTimeout(cacherMenu, 4000);
        }

        ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
            window.addEventListener(event, montrerMenu);
        });

        resetTimer();

        // ===== FONCTIONS POUR L'INDEX.HTML =====

        function toggleProchainCours() {
            toggleSection('prochainCours');
        }

        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const button = document.getElementById('themeToggle');
            if (button) {
                button.textContent = newTheme === 'light' ? '🎨 Changer de thème (→ Sombre)' : '🎨 Changer de thème (→ Clair)';
            }
        }

        function changeLanguage() {
            const langSwitch = document.getElementById('langSwitch');
            const selectedLang = langSwitch ? langSwitch.value : 'fr';
            
            localStorage.setItem('language', selectedLang);
            
            // Ici on pourrait implémenter la traduction
            if (selectedLang === 'en') {
                // Exemple de traduction basique
                document.querySelector('h1').textContent = 'Welcome to Swimming Record Book';
            } else {
                document.querySelector('h1').textContent = '🏊‍♂️ Bienvenue au Carnet de Natation';
            }
        }

        function lockScreen() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('user_session');
                window.location.href = 'login.html'; // Page de connexion à créer
            }
        }

        // ===== FONCTIONS POUR NATATION.HTML =====

        function toggleHoraires() {
            toggleSection('horaires');
        }

        function togglePresence() {
            toggleSection('presence');
        }

        function toggleEvaluer() {
            toggleSection('evaluer');
        }

        function toggleAttribuer() {
            toggleSection('attribuer');
        }

        function toggleExporter() {
            toggleSection('exporter');
        }

        function toggleProgression() {
            toggleSection('progression');
        }

        function toggleHistorique() {
            toggleSection('historique');
        }

        function toggleMoniteur() {
            toggleSection('moniteur');
        }

        function toggleFiltrer() {
            toggleSection('filtrer');
        }

        function exporterPDF() {
            alert('Export PDF en cours...');
            // Ici on implémenterait l'export PDF réel
        }

        function exporterCSV() {
            alert('Export CSV en cours...');
            // Ici on implémenterait l'export CSV réel
        }

        function exporterExcel() {
            alert('Export Excel en cours...');
            // Ici on implémenterait l'export Excel réel
        }

        function showHistorique(type) {
            const content = document.getElementById('historiqueContent');
            if (!content) return;
            
            let html = '';
            switch(type) {
                case 'presences':
                    html = '<h4>Historique des présences</h4><p>Affichage des présences des 3 derniers mois...</p>';
                    break;
                case 'evaluations':
                    html = '<h4>Historique des évaluations</h4><p>Toutes les évaluations effectuées...</p>';
                    break;
                case 'niveaux':
                    html = '<h4>Changements de niveau</h4><p>Historique des promotions de niveau...</p>';
                    break;
            }
            content.innerHTML = html;
        }

        function appliquerFiltres() {
            alert('Filtres appliqués !');
            // Ici on implémenterait la logique de filtrage
        }

        function resetFiltres() {
            // Reset tous les filtres
            const checkboxes = document.querySelectorAll('#filtrer input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            
            document.getElementById('heureDebut').value = '09:00';
            document.getElementById('heureFin').value = '17:00';
            
            if (document.getElementById('niveauxFiltre')) {
                document.getElementById('niveauxFiltre').selectedIndex = -1;
            }
        }

        // ===== FONCTIONS POUR SAUVETAGE.HTML =====

        function toggleParticipants() {
            toggleSection('participants');
        }

        function toggleInscription() {
            toggleSection('inscription');
        }

        function toggleFormulaires() {
            toggleSection('formulaires');
        }

        function toggleExamens() {
            toggleSection('examens');
        }

        function toggleValidation() {
            toggleSection('validation');
        }

        function toggleCalendrier() {
            toggleSection('calendrier');
        }

        function toggleMateriel() {
            toggleSection('materiel');
        }

        function togglePresencesSauvetage() {
            toggleSection('presencesSauvetage');
        }

        function filtrerParticipants() {
            const searchTerm = document.getElementById('searchParticipants')?.value.toLowerCase() || '';
            const niveauFilter = document.getElementById('niveauSauvetageFilter')?.value || '';
            
            const table = document.getElementById('tableParticipants');
            if (!table) return;
            
            const rows = table.getElementsByTagName('tbody')[0]?.getElementsByTagName('tr') || [];
            
            for (let i = 0; i < rows.length; i++) {
                const nom = rows[i].getElementsByTagName('td')[0]?.textContent.toLowerCase() || '';
                const niveau = rows[i].getElementsByTagName('td')[1]?.textContent.toLowerCase() || '';
                
                const matchNom = nom.includes(searchTerm);
                const matchNiveau = niveauFilter === '' || niveau.includes(niveauFilter);
                
                rows[i].style.display = (matchNom && matchNiveau) ? '' : 'none';
            }
        }

        function telechargerDocument(type) {
            const documents = {
                'consentement': 'Formulaire_Consentement.pdf',
                'medical': 'Certificat_Medical.pdf',
                'reglement': 'Reglement_Interieur.pdf',
                'guide': 'Guide_Preparation.pdf'
            };
            
            alert(`Téléchargement de ${documents[type]} en cours...`);
            // Ici on implémenterait le téléchargement réel
        }

        function validerCandidat(candidatId) {
            if (confirm('Confirmer la validation de ce candidat ?')) {
                alert('Candidat validé avec succès !');
                // Ici on implémenterait la validation réelle
            }
        }

        function rejeterCandidat(candidatId) {
            const raison = prompt('Raison du refus (optionnel) :');
            alert('Candidat refusé.');
            // Ici on implémenterait le rejet avec raison
        }

        function gererSession(sessionId) {
            alert(`Gestion de la session ${sessionId}`);
            // Ouvrir un modal de gestion de session
        }

        function ajouterSession() {
            alert('Ouverture du formulaire d\'ajout de session');
            // Ouvrir un modal d'ajout de session
        }

        function verifierMateriel(materielId) {
            const now = new Date().toLocaleDateString('fr-FR');
            alert(`Matériel ${materielId} vérifié le ${now}`);
            // Mettre à jour la base de données
        }

        function marquerPresence(participantId, statut) {
            alert(`${participantId} marqué comme : ${statut}`);
            // Sauvegarder le statut de présence
        }

        // ===== FONCTIONS POUR STATS.HTML =====

        function toggleProgressionStats() {
            toggleSection('progression');
        }

        function toggleAssiduite() {
            toggleSection('assiduite');
        }

        function toggleReussite() {
            toggleSection('reussite');
        }

        function toggleHistoriqueStats() {
            toggleSection('historique');
        }

        function toggleStatsMoniteur() {
            toggleSection('moniteur');
        }

        function toggleExportStats() {
            toggleSection('export');
        }

        function exporterRapport(type, format) {
            alert(`Export du rapport ${type} en format ${format}`);
            // Implémenter l'export de rapport
        }

        // ===== FONCTIONS POUR ACCOUNT.HTML =====

        function toggleProfil() {
            toggleSection('profil');
        }

        function toggleMotDePasse() {
            toggleSection('motdepasse');
        }

        function toggleCreerCompte() {
            toggleSection('creerCompte');
        }

        function toggleJournalConnexion() {
            toggleSection('journalConnexion');
        }

        function toggleImporterEleves() {
            toggleSection('importerEleves');
        }

        function toggleModeSuperviseur() {
            toggleSection('modeSuperviseur');
        }

        function toggleParametres() {
            toggleSection('parametres');
        }

        function changerPhoto() {
            document.getElementById('photoInput').click();
        }

        function previsualiserImport() {
            alert('Prévisualisation de l\'import');
            // Implémenter la prévisualisation
        }

        function telechargerModele() {
            alert('Téléchargement du modèle CSV');
            // Implémenter le téléchargement
        }

        function sauvegarderParametres() {
            alert('Paramètres sauvegardés !');
            // Sauvegarder les préférences utilisateur
        }

        // ===== FONCTIONS POUR ADMIN.HTML =====

        function togglePermissions() {
            toggleSection('permissions');
        }

        function toggleBaseDonnees() {
            toggleSection('baseDonnees');
        }

        function toggleExportTotal() {
            toggleSection('exportTotal');
        }

        function toggleCoursTest() {
            toggleSection('coursTest');
        }

        function toggleMessageMoniteurs() {
            toggleSection('messageMoniteurs');
        }

        function togglePlanificationAuto() {
            toggleSection('planificationAuto');
        }

        function toggleGestionGroupes() {
            toggleSection('gestionGroupes');
        }

        function sauvegarderPermissions() {
            alert('Permissions sauvegardées !');
        }

        function lancerSauvegarde() {
            if (confirm('Lancer la sauvegarde maintenant ?')) {
                alert('Sauvegarde en cours...');
                // Implémenter la sauvegarde
            }
        }

        function restaurerSauvegarde(filename) {
            if (confirm(`Restaurer la sauvegarde ${filename} ? Cela remplacera toutes les données actuelles.`)) {
                alert('Restauration en cours...');
                // Implémenter la restauration
            }
        }

        function lancerExportComplet() {
            alert('Export complet en cours...');
            // Implémenter l'export complet avec progress bar
        }

        // ===== FONCTIONS POUR OUTILS.HTML =====

        function toggleRechercheAvancee() {
            toggleSection('rechercheAvancee');
        }

        function toggleTempsSession() {
            toggleSection('tempsSession');
        }

        function toggleRappelsAlertes() {
            toggleSection('rappelsAlertes');
        }

        function toggleCertificats() {
            toggleSection('certificats');
        }

        function togglePhotosProfil() {
            toggleSection('photosProfil');
        }

        function togglePlanCours() {
            toggleSection('planCours');
        }

        // ===== FONCTION UTILITAIRE GÉNÉRALE =====

        function toggleSection(sectionId) {
            // Cacher toutes les autres sections
            const sections = document.querySelectorAll('main section');
            sections.forEach(section => {
                if (section.id !== sectionId) {
                    section.classList.add('hidden');
                }
            });
            
            // Toggle la section demandée
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.toggle('hidden');
            }
        }

        // ===== INITIALISATION =====

        document.addEventListener('DOMContentLoaded', function() {
            // Charger le thème sauvegardé
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            
            // Charger la langue sauvegardée
            const savedLang = localStorage.getItem('language') || 'fr';
            const langSwitch = document.getElementById('langSwitch');
            if (langSwitch) {
                langSwitch.value = savedLang;
            }
            
            // Mettre à jour le texte du bouton de thème
            const themeButton = document.getElementById('themeToggle');
            if (themeButton) {
                themeButton.textContent = savedTheme === 'light' ? 
                    '🎨 Changer de thème (→ Sombre)' : 
                    '🎨 Changer de thème (→ Clair)';
            }
        });