const aboutModal = document.getElementById('aboutModal');
const openAboutBtn = document.getElementById('openAboutModalBtn');
const closeAboutBtn = document.getElementsByClassName('close')[0];

function openModal() {
    aboutModal.style.display = 'block';
}

function closeModal() {
    aboutModal.style.display = 'none';
}

openAboutBtn.addEventListener('click', openModal);
closeAboutBtn.addEventListener('click', closeModal);

window.addEventListener('click', function (event) {
if (event.target == aboutModal) {
    closeModal();
}
});